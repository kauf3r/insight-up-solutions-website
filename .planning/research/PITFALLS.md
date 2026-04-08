# Domain Pitfalls: Replit-to-Vercel Migration

**Domain:** Express + Vite SPA migration from Replit to Vercel Serverless
**Researched:** 2026-04-08
**Confidence:** HIGH (verified against official Vercel docs, Neon docs, esbuild docs)

---

## Critical Pitfalls

Mistakes that cause deploy failures, broken production, or require architectural rework.

### Pitfall 1: `express.static()` is Silently Ignored on Vercel

**What goes wrong:** The current `server/vite.ts` uses `express.static(distPath)` in production mode (line 79) and a catch-all `app.use("*")` for SPA fallback (line 82). On Vercel, `express.static()` is completely ignored -- it does not serve files. The app deploys but returns 404 for all static assets (CSS, JS bundles, images, video).

**Why it happens:** Vercel's Express integration wraps the entire Express app as a single serverless function. Static assets must be served from the `public/` directory at the project root via Vercel's CDN, not through Express middleware.

**Consequences:** Every asset request (stylesheets, JavaScript bundles, images, favicon, video) returns a 404 or the SPA HTML. The site appears completely broken -- blank page or unstyled content.

**Warning signs:**
- Deploy succeeds but site shows blank white page
- Browser console shows 404 errors for `.js` and `.css` files
- Video element shows broken media icon

**Prevention:**
1. Remove `express.static()` and the SPA catch-all middleware entirely from the Vercel entry point
2. Place Vite's build output (`dist/public/`) contents into the Vercel `public/` directory, or configure the Vercel output directory to match
3. Configure SPA fallback in `vercel.json` rewrites instead of Express middleware

**Detection:** Test deployment in Vercel preview environment before pointing domain.

**Phase:** Must be addressed in Phase 1 (core migration). This is the most fundamental architectural difference.

---

### Pitfall 2: `import.meta.dirname` Breaks in esbuild ESM Bundle

**What goes wrong:** The server code uses `import.meta.dirname` in three places: `server/index.ts` (line 17, video path resolution) and `server/vite.ts` (lines 49, 71, static file paths). The current build script bundles with esbuild using `--format=esm`. After bundling, `import.meta.dirname` refers to the bundled output file's directory, NOT the original source directory. Path resolution for `public/` assets will point to the wrong location.

**Why it happens:** esbuild bundles multiple files into one. `import.meta.dirname` is evaluated at runtime and reflects the bundled file's location, not the original source file's location. This is a documented esbuild semantic change when bundling ESM.

**Consequences:** The video streaming middleware (`server/index.ts` lines 14-49) resolves paths incorrectly. In production mode, `path.join(import.meta.dirname, 'public', req.path)` points to a nonexistent directory. However, since `express.static()` is ignored on Vercel anyway (Pitfall 1), this becomes moot IF static assets are handled by Vercel's CDN. The real risk is if any OTHER path resolution using `import.meta.dirname` is added during migration.

**Warning signs:**
- `ENOENT` errors in serverless function logs for file paths
- Video streaming endpoint returns 404 despite file existing

**Prevention:**
1. Remove the video streaming middleware entirely -- Vercel's CDN handles video files from `public/` automatically with proper range request support
2. Remove the `serveStatic()` function from `server/vite.ts` -- it is not needed on Vercel
3. If `import.meta.dirname` is needed for any other purpose, use the esbuild banner polyfill:
   ```javascript
   banner: {
     js: `import { fileURLToPath } from 'node:url'; import { dirname } from 'node:path'; const __filename = fileURLToPath(import.meta.url); const __dirname = dirname(__filename);`
   }
   ```
4. For the Vercel entry point, avoid filesystem operations entirely -- the serverless function should only handle API routes

**Phase:** Phase 1 (core migration). Strip file-system-dependent code from the serverless entry point.

---

### Pitfall 3: SPA Routes Return 404 on Direct Access / Refresh

**What goes wrong:** Without proper `vercel.json` rewrites, navigating directly to `/products/trinity-pro` or refreshing any page other than `/` returns Vercel's default 404 page. Client-side wouter routing works for in-app navigation but breaks on hard refresh.

**Why it happens:** Vercel resolves URLs as server-side file paths. When a user hits `/solutions/surveying`, Vercel looks for a file or function at that path. Since it is a client-side route handled by wouter, no server-side resource exists, and Vercel returns 404.

**Consequences:** Every deep link, bookmark, shared URL, and browser refresh breaks. SEO crawlers that follow links get 404s. Users who refresh lose their page.

**Warning signs:**
- Direct URL access to any non-root route returns 404
- Browser refresh on any route other than `/` fails
- Users report "broken links" from shared URLs

**Prevention:**
Create `vercel.json` with rewrites that route API calls to the serverless function and everything else to `index.html`:
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Order matters: API rewrites MUST come before the SPA catch-all, or API requests will be swallowed by the `index.html` rewrite.

**Detection:** Test by directly navigating to `/products`, `/demo`, `/contact`, `/solutions/surveying` in the preview deployment.

**Phase:** Phase 1 (core migration). Must ship with the initial `vercel.json`.

---

### Pitfall 4: Replit Resend Connector Code Crashes on Vercel

**What goes wrong:** The entire `server/lib/resend.ts` file is built around Replit's connector API. It fetches credentials from `REPLIT_CONNECTORS_HOSTNAME` using `REPL_IDENTITY` or `WEB_REPL_RENEWAL` tokens. None of these environment variables exist on Vercel. Every email send attempt throws `"X_REPLIT_TOKEN not found for repl/depl"` and crashes.

**Why it happens:** Replit connectors are a Replit-specific abstraction for managing third-party API credentials. They do not exist outside Replit.

**Consequences:** ALL form submissions trigger email errors. Customer confirmation emails never send. Admin notification emails never send. The lead capture -- the core value of the site -- appears to work (DB insert succeeds, 201 response returns) but no one gets notified. Leads go dark.

**Warning signs:**
- Form submissions return 201 success but no emails arrive
- Serverless function logs show `"X_REPLIT_TOKEN not found"` errors
- Resend dashboard shows zero sends

**Prevention:**
1. Replace `server/lib/resend.ts` entirely with a simple direct-API-key implementation:
   ```typescript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   export function getResendClient() {
     return {
       client: resend,
       fromEmail: 'Insight Up Solutions <info@insightupsolutions.com>'
     };
   }
   ```
2. Set `RESEND_API_KEY` in Vercel environment variables (obtain from Resend dashboard)
3. The Resend SDK (`resend` v6.4.2 already in dependencies) works directly with an API key -- no connector needed
4. Optionally install the [Resend Vercel integration](https://vercel.com/integrations/resend) for automatic env var provisioning

**Detection:** Submit a test form immediately after first deployment. Check both customer and admin inboxes. Check Resend dashboard for send activity.

**Phase:** Phase 1 (core migration). Without this, the site's primary function (lead capture with notification) is broken.

---

### Pitfall 5: TypeScript Path Aliases Fail in esbuild Serverless Bundle

**What goes wrong:** The server code imports `@shared/schema` in both `server/routes.ts` (line 9) and `server/storage.ts` (line 17). The current build script uses esbuild with `--bundle` which should resolve aliases. However, esbuild does NOT natively read `tsconfig.json` paths. The current build command (`esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`) has no alias configuration. If the `@shared` alias is resolved during the Vite build (which has it configured), it may work incidentally when the imports are pre-resolved by TypeScript. But with `--packages=external`, esbuild skips node_modules resolution, and path aliases are NOT node packages -- they will fail.

**Why it happens:** esbuild treats `@shared/schema` as an external package (due to `--packages=external`). Since no `@shared` package exists in `node_modules`, the import fails at runtime with `Cannot find module '@shared/schema'`.

**Consequences:** The serverless function fails to start. Every API request returns a 500 error. The entire backend is down.

**Warning signs:**
- Build succeeds but every API request returns 500
- Serverless function logs show `Cannot find module '@shared/schema'`
- `Cannot find module '@/...'` errors in function startup

**Prevention:**
Two approaches:
1. **Replace aliases with relative imports in server code** (simplest):
   Change `import ... from "@shared/schema"` to `import ... from "../shared/schema"` in all server files. This avoids the alias resolution problem entirely.
2. **Add esbuild alias configuration** using the `--alias:@shared=./shared` flag or an esbuild config file with the `alias` option:
   ```
   esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --alias:@shared=./shared
   ```
3. If using Vercel's zero-config Express detection (which does its own bundling), ensure the tsconfig paths are respected or convert to relative imports.

**Detection:** Run the build locally and test `node dist/index.js` before deploying. The import failure will crash immediately.

**Phase:** Phase 1 (core migration). This blocks the serverless function from starting.

---

### Pitfall 6: Dual Database Driver Confusion

**What goes wrong:** The codebase has TWO separate database connection setups:
- `server/db.ts`: Uses `Pool` from `@neondatabase/serverless` (WebSocket-based) with `drizzle-orm/neon-serverless`. Imports `ws` for WebSocket polyfill. **This file is never imported by any route or storage code** -- it is dead code.
- `server/storage.ts`: Uses `neon` from `@neondatabase/serverless` (HTTP-based) with `drizzle-orm/neon-http`. This is the ACTUAL driver used in production.

During migration, a developer might "fix" the database connection by modifying `db.ts` (the more visible, properly-named file) instead of `storage.ts` (where the actual connection lives). Or they might try to consolidate and accidentally switch from the HTTP driver to the WebSocket driver.

**Why it happens:** Dead code left from initial scaffolding. The names are confusing: `db.ts` suggests it is THE database module, but `storage.ts` is the one actually used.

**Consequences:**
- If `db.ts` is modified thinking it is the active connection: changes have no effect, wasting debugging time
- If switched from HTTP (`neon`) to WebSocket (`Pool`): the `ws` package is needed as a WebSocket polyfill, which adds cold start latency and may have compatibility issues in Vercel's runtime
- If both are accidentally imported: two connection pools to the same database, potential connection exhaustion

**Warning signs:**
- Database changes in `db.ts` have no observable effect
- Seeing WebSocket-related errors if `ws` import fails in serverless context
- Connection pool exhaustion errors in Neon dashboard

**Prevention:**
1. Delete `server/db.ts` entirely -- it is dead code
2. Keep `storage.ts` using the `neon` HTTP driver -- it is already the correct choice for Vercel serverless (faster cold starts, no WebSocket dependency)
3. Remove `ws` from dependencies if no other code uses it (check first)
4. Consider switching to Neon's connection pooling URL if Vercel Fluid Compute is enabled (TCP with pooling is faster for warm instances)

**Phase:** Phase 1 cleanup. Quick win that prevents confusion.

---

## Moderate Pitfalls

### Pitfall 7: Video Streaming Middleware is Incompatible with Serverless

**What goes wrong:** `server/index.ts` lines 14-49 implement custom video streaming with range request support using `fs.createReadStream()`. This middleware:
1. Uses the filesystem (which works differently in serverless)
2. Creates streaming responses that may timeout in serverless (Vercel default is 10s for Hobby, 60s for Pro)
3. Is completely unnecessary because Vercel's CDN handles range requests natively for static assets

**Prevention:**
1. Remove the video streaming middleware entirely
2. Place the MP4 file in the Vercel `public/` directory
3. Vercel's CDN automatically handles `Accept-Ranges`, `Content-Range`, and streaming for files served from `public/`
4. The video file is 1.7MB -- well within Vercel's static asset limits and CDN cache limits (10MB per cached response)

**Phase:** Phase 1 (core migration). Remove during serverless entry point creation.

---

### Pitfall 8: Replit Script Tag in HTML and Vite Plugin Remnants

**What goes wrong:** `client/index.html` line 21 includes `<script type="text/javascript" src="https://replit.com/public/js/replit-dev-banner.js"></script>`. This loads a Replit-branded banner on every page load. Additionally, `vite.config.ts` imports `@replit/vite-plugin-runtime-error-modal` (always loaded) and conditionally imports `@replit/vite-plugin-cartographer`.

**Consequences:**
- The Replit banner script adds an external HTTP request to every page load, even though it likely no-ops outside Replit. At worst it could inject visible UI elements. At minimum it is unnecessary latency.
- `@replit/vite-plugin-runtime-error-modal` may inject its own runtime code into the production build
- The Replit plugins are dev-only concerns that have no business in a Vercel deployment

**Prevention:**
1. Remove the Replit script tag from `client/index.html`
2. Remove `@replit/vite-plugin-runtime-error-modal` from `vite.config.ts` plugins array
3. Remove the conditional cartographer import (already dev-only + Replit-only, but clean it up)
4. Remove both `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-runtime-error-modal` from `devDependencies` in `package.json`

**Phase:** Phase 1 (core migration). Easy cleanup, do it first.

---

### Pitfall 9: Express Entry Point Structure Mismatch for Vercel

**What goes wrong:** The current `server/index.ts` has an IIFE `(async () => { ... })()` that calls `seedDatabase()`, sets up Vite dev middleware, configures error handlers, and calls `server.listen()`. Vercel's Express integration expects either a default export of the Express app OR an `app.listen()` call at a standard file location (`index.ts`, `server.ts`, `app.ts`, or `src/` variants).

The current file structure does not match: the entry point is `server/index.ts` (not at root), it wraps the HTTP server creation inside `registerRoutes()`, and it has Vite dev server setup that should not exist in the serverless function.

**Consequences:**
- Vercel may not detect the Express app automatically
- The IIFE pattern with `server.listen()` may conflict with Vercel's port management
- `seedDatabase()` runs on every cold start, which is fine (it is idempotent) but adds cold start latency
- Vite dev middleware imports (`./vite`) pull in `vite` as a dependency into the production bundle, massively bloating it

**Prevention:**
1. Create a new Vercel-specific entry point (e.g., `api/index.ts` or root `app.ts`) that:
   - Creates the Express app
   - Registers API routes (from `server/routes.ts`)
   - Exports the app as default: `export default app`
   - Does NOT call `app.listen()`
   - Does NOT import Vite dev modules
   - Does NOT call `setupVite()` or `serveStatic()`
2. Keep the existing `server/index.ts` as the local development entry point
3. Configure `vercel.json` to point to the new entry point
4. Move `seedDatabase()` out of the request path -- run it as a one-time build step or separate function

**Phase:** Phase 1 (core migration). This is the central architectural change.

---

### Pitfall 10: `seedDatabase()` Runs on Every Cold Start

**What goes wrong:** `server/index.ts` calls `await seedDatabase()` at startup (line 83). In a serverless environment, this runs on every cold start. While the seed is idempotent (it checks for existing data), it still makes a database query to check, adding 100-500ms to every cold start.

**Prevention:**
1. Move seed execution out of the serverless function startup
2. Run `seedDatabase()` as a one-time operation: either via a separate API endpoint, a build step, or a standalone script
3. Since the Neon database already has data (per PROJECT.md: "real lead data exists"), seeding is unnecessary for the migration
4. If keeping it for fresh deployments, gate it behind an environment variable: `if (process.env.RUN_SEED === 'true')`

**Phase:** Phase 1 optimization. Not blocking but impacts cold start performance.

---

### Pitfall 11: `vercel.json` Rewrite Order Breaks API or SPA

**What goes wrong:** If the SPA catch-all rewrite is listed before the API rewrite, ALL requests (including `/api/products`, `/api/demo-bookings`, etc.) are rewritten to `/index.html`. The API becomes unreachable. Conversely, if API routes are too broadly matched, SPA routes may be intercepted.

**Prevention:**
Correct order in `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
If using Vercel's zero-config Express detection (new as of 2025), the Express app handles API routes natively and rewrites may only be needed for the SPA fallback.

**Detection:** Test all API endpoints (`/api/products`, `/api/demo-bookings`, etc.) AND client-side routes after deployment.

**Phase:** Phase 1 (core migration).

---

### Pitfall 12: Vite Build Output Directory vs. Vercel Expectations

**What goes wrong:** The Vite config builds to `dist/public/` (`build.outDir` in vite.config.ts, line 28). The esbuild bundles server code to `dist/`. On Vercel, static assets must be in a `public/` directory at the project root OR the output directory must be configured in Vercel's dashboard/config.

If the build output structure does not align with Vercel's expectations:
- Static assets end up inside the serverless function bundle instead of on the CDN
- The 250MB function size limit is hit unnecessarily
- Assets are served through the function (slow, expensive) instead of the CDN (fast, free)

**Prevention:**
1. Set Vercel's "Output Directory" to `dist/public` in project settings (for the static frontend)
2. OR restructure the build to output static files to `public/` at root
3. The Vercel Express detection may handle this automatically -- verify during first deployment
4. Ensure `client/public/` contents (images, video, favicon) are included in the Vite build output

**Phase:** Phase 1 (core migration). Verify during initial deployment configuration.

---

## Minor Pitfalls

### Pitfall 13: `@assets` Alias in Vite Config Has No tsconfig Mapping

**What goes wrong:** `vite.config.ts` defines an `@assets` alias pointing to `attached_assets/`, but `tsconfig.json` has no corresponding `paths` entry for `@assets`. TypeScript type checking will fail for any imports using `@assets`. Currently only `TrinityLR1SpecialPage.tsx` uses it.

**Prevention:** Either add `"@assets/*": ["./attached_assets/*"]` to tsconfig paths, or convert the one usage to a relative import.

**Phase:** Phase 1 cleanup.

---

### Pitfall 14: Massive Google Fonts Request Blocks Rendering

**What goes wrong:** `client/index.html` loads 25+ Google Font families in a single request (line 15). This is approximately 8KB of CSS just for font declarations, and triggers downloads of hundreds of font files. While not migration-specific, this significantly impacts First Contentful Paint on Vercel where there is no server-side rendering to mask the load time.

**Prevention:**
1. Audit which fonts are actually used (likely 2-3 max)
2. Remove unused font imports
3. Add `font-display: swap` (Google Fonts' `&display=swap` parameter is already included)
4. Consider self-hosting the few fonts actually used

**Phase:** Phase 2 or later. Not blocking migration but impacts performance.

---

### Pitfall 15: Root-Level `index.html` May Confuse Vercel Detection

**What goes wrong:** There is both a `client/index.html` (the actual SPA entry, used by Vite) and a root-level `index.html` (24KB, appears to be a Replit artifact). Vercel's auto-detection might pick up the root `index.html` as the static site entry point instead of the Vite build output.

**Prevention:**
1. Delete or `.vercelignore` the root-level `index.html`
2. Ensure Vercel's build command runs `vite build` with the correct `--root client` configuration
3. Verify the correct `index.html` is served after deployment

**Phase:** Phase 1 cleanup.

---

### Pitfall 16: Email Sends are Sequential, Doubling Latency in Serverless

**What goes wrong:** Each form submission makes 2 sequential `await` calls to Resend (customer email, then admin email). Each creates a new Resend client instance. In the current Replit connector setup, each also fetches credentials. Even with direct API key (post-migration), this is two sequential HTTP calls to Resend's API, adding ~200-400ms to every form submission response time.

**Why worse on Vercel:** Serverless functions are billed per execution time. Sequential email sends double the billed duration. If Resend is slow (500ms+ per send), the function may approach timeout limits.

**Prevention:**
1. Send both emails in parallel with `Promise.allSettled()`:
   ```typescript
   const [customerResult, adminResult] = await Promise.allSettled([
     resend.emails.send(customerEmail),
     resend.emails.send(adminEmail)
   ]);
   ```
2. Use `Promise.allSettled` (not `Promise.all`) so one failure does not block the other
3. This halves the email-related latency on every form submission

**Phase:** Phase 1 or Phase 2. Easy optimization, high impact on response time and cost.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Serverless entry point | Vite dev imports bloat bundle (Pitfall 9) | Create separate Vercel entry point, never import `./vite` |
| Static asset serving | `express.static()` silently fails (Pitfall 1) | Use Vercel `public/` directory + CDN, no Express static middleware |
| API routing | Rewrite order breaks API or SPA (Pitfall 11) | API rewrites before SPA catch-all in `vercel.json` |
| Email integration | Replit connector crashes (Pitfall 4) | Replace with direct `RESEND_API_KEY` before any email testing |
| Path aliases | `@shared` import fails at runtime (Pitfall 5) | Convert to relative imports or add esbuild alias config |
| Database connection | Wrong driver modified (Pitfall 6) | Delete dead `db.ts`, keep HTTP driver in `storage.ts` |
| Domain cutover | SPA routes 404 on refresh (Pitfall 3) | `vercel.json` rewrites must be verified before DNS change |
| Build configuration | Output directory mismatch (Pitfall 12) | Verify static assets served from CDN, not function |
| Performance | Sequential emails add latency (Pitfall 16) | Parallelize with `Promise.allSettled` |
| Cold starts | `seedDatabase()` adds startup latency (Pitfall 10) | Remove from function startup, run as one-time script |

---

## Sources

- [Express on Vercel - Official Docs](https://vercel.com/docs/frameworks/backend/express) -- HIGH confidence
- [Connecting to Neon from Vercel - Neon Docs](https://neon.com/docs/guides/vercel-connection-methods) -- HIGH confidence
- [Drizzle ORM - Neon Connection](https://orm.drizzle.team/docs/connect-neon) -- HIGH confidence
- [esbuild - __dirname issue #1874](https://github.com/evanw/esbuild/issues/1874) -- HIGH confidence
- [esbuild - tsconfig paths issue #394](https://github.com/evanw/esbuild/issues/394) -- HIGH confidence
- [Vercel SPA Fallback Discussion #5448](https://github.com/vercel/vercel/discussions/5448) -- MEDIUM confidence
- [Vercel express.static Discussion #7572](https://github.com/vercel/vercel/discussions/7572) -- MEDIUM confidence
- [Vercel How Can I Use Files in Functions](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions) -- HIGH confidence
- [TypeScript path aliases and esbuild](https://aschaaf.net/posts/esbuild-aliases-only-work-when-bundling/) -- MEDIUM confidence
- [Vercel Cold Start KB](https://vercel.com/kb/guide/how-can-i-improve-serverless-function-lambda-cold-start-performance-on-vercel) -- HIGH confidence

---

*Pitfalls audit: 2026-04-08*
