# Technology Stack: Replit-to-Vercel Migration

**Project:** Insight Up Solutions
**Researched:** 2026-04-07
**Overall Confidence:** HIGH

## Migration Architecture Decision

**Decision: Two-deployment-target architecture** -- Vite builds the React SPA to static files served by Vercel's CDN, Express API runs as a single Vercel Serverless Function. No Next.js rewrite required.

**Why this works:** Vercel natively detects Express apps (zero-config, shipped Sept 2025) and auto-wraps them as serverless functions. The Vite static output deploys to Vercel's CDN. `vercel.json` rewrites route `/api/*` to the Express function and everything else to `index.html`.

## Recommended Stack

### Vercel Platform Configuration

| Technology | Version/Value | Purpose | Why | Confidence |
|------------|---------------|---------|-----|------------|
| Node.js | 20.x | Runtime for serverless functions | Current project uses Node 20; Vercel supports 20.x, 22.x, 24.x (24 is default since Nov 2025). Use 20 to minimize risk during migration, upgrade to 22 later. | HIGH |
| Vercel CLI | >= 47.0.5 | Local dev + deployment | Minimum required for zero-config Express detection per official docs | HIGH |
| `vercel.json` | v2 (implicit) | Routing configuration | Required for API rewrites + SPA fallback. Do NOT use legacy `builds` property. | HIGH |

### Express API Entry Point

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Express | 4.21.2 (keep) | API server | Already in use. Vercel zero-config detects Express at `server/index.ts` or `src/server.ts` (among other paths). Current `server/index.ts` path is NOT in the auto-detect list -- needs a thin wrapper at root. | HIGH |
| `@vercel/node` | (implicit) | Serverless runtime | Used automatically by Vercel when it detects Express. Do NOT add to package.json -- it's platform-provided. | HIGH |

### Frontend Build

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vite | 5.4.19 (keep) | Frontend bundler | Already in use. Vercel auto-detects Vite. Output goes to `dist/public` -- reconfigure to `dist` for Vercel convention. | HIGH |
| React | 18.3.1 (keep) | UI framework | No change needed. | HIGH |
| `@vitejs/plugin-react` | 4.3.2 (keep) | Vite React integration | No change needed. | HIGH |

### Database

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `@neondatabase/serverless` | 0.10.4 (keep) | Postgres driver | Already serverless-compatible. Works perfectly with Vercel serverless functions. Zero changes needed. | HIGH |
| `drizzle-orm` | 0.39.1 (keep) | ORM | Already in use, type-safe, works with Neon driver. Zero changes needed. | HIGH |

### Email

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `resend` | 6.4.2 (keep) | Email delivery | Already in use. The Replit connector wrapper (`server/lib/resend.ts`) must be replaced with direct `new Resend(process.env.RESEND_API_KEY)`. This is the single biggest code change in the migration. | HIGH |

### Dev Dependencies to Remove

| Package | Why Remove |
|---------|-----------|
| `@replit/vite-plugin-cartographer` | Replit-specific dev tooling. Breaks outside Replit. | 
| `@replit/vite-plugin-runtime-error-modal` | Replit-specific error overlay. Use Vite's built-in error overlay instead. |

### Dev Dependencies to Add

| Package | Version | Purpose | Why | Confidence |
|---------|---------|---------|-----|------------|
| `vercel` | latest (^41.x) | Vercel CLI for `vercel dev` local development | Required for testing serverless behavior locally. Use `npx vercel dev` or install globally. | HIGH |

## Critical Configuration: `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.ts" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Key points:**
- `framework: null` -- tells Vercel this isn't a recognized framework (not Next.js, not plain Vite). This gives us full control.
- `buildCommand` -- runs the existing `npm run build` which does Vite build + esbuild server bundle.
- `outputDirectory` -- points to where Vite outputs static files.
- Rewrites are ordered: API routes first, SPA fallback second. Order matters.
- Do NOT use `builds` property -- it's legacy and deprecated.

**Alternative approach (zero-config Express):** Vercel can auto-detect Express if the entry point is at a conventional location (e.g., `src/index.ts`, `index.ts`). However, this project has the entry at `server/index.ts` which is NOT in the auto-detect list. Two options:

1. **Option A (recommended): Create `api/index.ts` as a thin wrapper** that imports and exports the Express app. This is the most Vercel-idiomatic approach and separates concerns cleanly.
2. **Option B: Move/symlink `server/index.ts` to `src/index.ts`** to match Vercel's detection. More disruptive to current structure.

## Express Serverless Entry Point Pattern

The current `server/index.ts` uses `app.listen()` inside an IIFE with Vite dev server setup, static file serving, and `createServer()` wrapping. This does NOT work as-is for Vercel because:

1. `express.static()` is ignored by Vercel (static files must go in `public/`)
2. The Vite dev server setup (`setupVite`) is development-only
3. `createServer()` and `app.listen()` are redundant in serverless

**Required: Create a new `api/index.ts`:**

```typescript
import express from "express";
import { registerRoutes } from "../server/routes";
import { seedDatabase } from "../server/seed";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Seed on cold start (idempotent)
seedDatabase().catch(console.error);

// Register all API routes
registerRoutes(app);

// Export for Vercel serverless (default export pattern)
export default app;
```

**Keep existing `server/index.ts` for local dev** (`npm run dev` with tsx). The two entry points share `server/routes.ts`.

## Path Alias Resolution

**Problem:** Vercel's Node.js runtime explicitly does NOT support TypeScript `paths` mappings. The server code uses `@shared/schema` in 4 files (`routes.ts`, `db.ts`, `seed.ts`, `storage.ts`).

**Solution:** The existing esbuild build step (`--bundle`) already resolves path aliases at bundle time because esbuild reads tsconfig.json paths when bundling. However, for Vercel's serverless function compilation (which does its own bundling), path aliases will fail.

**Two approaches:**

1. **Option A (recommended): Pre-bundle the API with esbuild before deployment.** The current build script already does this: `esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`. Adapt this to also bundle `api/index.ts` and have Vercel serve the bundled JS output instead of raw TS. This resolves all path aliases at build time.

2. **Option B: Replace `@shared/schema` imports with relative paths** in server files (e.g., `../shared/schema`). Simple but loses the alias convenience.

**Recommendation: Option A.** Modify the build script to bundle the API entry point to `api/index.js` (compiled JS with aliases resolved), and configure Vercel to use the compiled output. This is what the project already does for production -- just needs to target the Vercel entry point.

**Updated build script:**

```bash
# Frontend
vite build

# Backend (Vercel serverless entry)  
esbuild api/index.ts --platform=node --packages=external --bundle --format=esm --outdir=api --outfile=api/index.js
```

## Environment Variables

### Required on Vercel Dashboard

| Variable | Source | Notes |
|----------|--------|-------|
| `DATABASE_URL` | Neon dashboard | Already exists. Copy from current Replit secrets. |
| `RESEND_API_KEY` | Resend dashboard | NEW. Currently accessed via Replit connector. Must obtain directly from resend.com dashboard. |
| `NODE_ENV` | Set to `production` | Vercel sets this automatically in production deployments. |

### Variables to Remove

| Variable | Why |
|----------|-----|
| `REPL_IDENTITY` | Replit-only authentication token |
| `WEB_REPL_RENEWAL` | Replit-only authentication token |
| `REPLIT_CONNECTORS_HOSTNAME` | Replit-only API endpoint |
| `PORT` | Vercel manages ports automatically |

## Static Asset Handling

**Critical change:** `express.static()` is explicitly ignored by Vercel. Static files must be in the `public/` directory at project root to be served via Vercel's CDN.

Current structure:
- Vite builds to `dist/public/` (contains `index.html`, JS/CSS bundles)
- Video file is in `client/public/` (dev) or `dist/public/` (prod)
- Product images are referenced in database as URLs

**Migration:**
- Vite build output (`dist/public/`) becomes the served directory -- configure `outputDirectory` in vercel.json
- Video files in `client/public/` get included in Vite build output automatically
- The custom video streaming middleware in `server/index.ts` (range request support) becomes unnecessary -- Vercel's CDN handles range requests natively

## Local Development Strategy

**Keep the existing dev setup working.** `npm run dev` runs `tsx server/index.ts` which starts Express with Vite middleware. This is better than `vercel dev` for day-to-day development because:
- Faster startup
- HMR works via Vite middleware
- No Vercel account/auth needed

**Use `vercel dev` only for testing Vercel-specific behavior** (rewrites, serverless function cold starts, etc.) before deploying.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| API architecture | Express wrapped in single function | Individual `/api/*.ts` route files | Would require rewriting all routes. Express wrapper is minimal change. |
| API architecture | Express wrapped | Migrate to Hono | Unnecessary rewrite for a simple API. Hono is faster but Express works fine for this traffic level. |
| Frontend framework | Keep Vite+React SPA | Migrate to Next.js | Massive rewrite with zero business value. The site is a SPA, not SSR. |
| Build tool | esbuild (already in use) | Vercel's native TS compilation | Vercel's native compilation doesn't support path aliases. esbuild pre-bundling solves this. |
| Serverless approach | Zero-config Express detection | Legacy `builds` + `@vercel/node` | `builds` is deprecated. Zero-config is the current standard. |
| Email | Direct Resend SDK | Vercel Email integration | Direct SDK is simpler, already a dependency, no vendor lock-in beyond Resend itself. |

## Do NOT Use

| Technology | Why Not |
|------------|---------|
| `@vercel/node` as explicit dependency | Platform-provided. Adding it to package.json causes version conflicts. |
| `builds` property in vercel.json | Deprecated legacy config. Cannot be used with `functions` property. |
| `express.static()` in production | Silently ignored by Vercel. Files must be in `public/` directory for CDN serving. |
| `@replit/vite-plugin-cartographer` | Replit-only. Will error on Vercel. |
| `@replit/vite-plugin-runtime-error-modal` | Replit-only. Vite has its own error overlay. |
| Nitro/Vinxi | Overkill. These are for SSR Vite apps. This is a SPA with a separate API. |
| WebSocket connections in serverless | Vercel functions are request/response only. The `ws` package is only used by Neon driver (which handles its own lifecycle). |

## Installation Changes

```bash
# Remove Replit plugins
npm uninstall @replit/vite-plugin-cartographer @replit/vite-plugin-runtime-error-modal

# Install Vercel CLI (dev only, or use npx)
npm install -D vercel
```

No other dependency changes needed. The entire existing dependency tree is serverless-compatible.

## Version Verification

| Package | Current | Needed | Status | Source |
|---------|---------|--------|--------|--------|
| Express | 4.21.2 | 4.x | OK | Official Vercel docs confirm Express 4 support |
| Vite | 5.4.19 | 5.x | OK | Vercel auto-detects Vite 5 |
| Node.js | 20 | 20.x/22.x/24.x | OK | Vercel docs (updated Feb 2026) |
| `@neondatabase/serverless` | 0.10.4 | Any | OK | Already serverless-compatible by design |
| `drizzle-orm` | 0.39.1 | Any | OK | ORM is runtime-agnostic |
| `resend` | 6.4.2 | Any | OK | SDK is a simple HTTP client, serverless-compatible |
| TypeScript | 5.6.3 | 5.x | OK | Vercel handles TS compilation |
| esbuild | 0.25.0 | 0.x | OK | Used in build step, not runtime |

## Sources

- [Express on Vercel - Official Docs](https://vercel.com/docs/frameworks/backend/express) -- HIGH confidence, primary source
- [Vite on Vercel - Official Docs](https://vercel.com/docs/frameworks/frontend/vite) -- HIGH confidence
- [vercel.json Configuration Reference](https://vercel.com/docs/project-configuration/vercel-json) -- HIGH confidence
- [Using the Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js) -- HIGH confidence, confirms path alias limitation
- [Supported Node.js Versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) -- HIGH confidence
- [Zero-Configuration Express Backends Changelog](https://vercel.com/changelog/zero-configuration-express-backends) -- HIGH confidence, Sept 2025 release
- [Zero-Config Backends Blog Post](https://vercel.com/blog/zero-config-backends-on-vercel-ai-cloud) -- MEDIUM confidence, marketing-level detail
- [MERN Monorepo on Vercel Guide](https://dev.to/bcncodeschool/deploying-a-mern-full-stack-web-application-on-vercelcom-with-express-and-vite-as-a-monorepo-49jc) -- MEDIUM confidence, community guide
- [Vite+Express+Vercel Starter Template](https://github.com/internetdrew/vite-express-vercel) -- MEDIUM confidence, uses legacy `builds` pattern
- [Path Alias Discussion #10717](https://github.com/vercel/vercel/discussions/10717) -- HIGH confidence, confirms path aliases unsupported in serverless
- [esbuild Path Alias Behavior](https://github.com/evanw/esbuild/issues/394) -- HIGH confidence, confirms --bundle resolves aliases
