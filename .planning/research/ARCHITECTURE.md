# Architecture Patterns: Express+Vite Monolith to Vercel

**Domain:** Replit-to-Vercel migration of monolithic Express+Vite SPA
**Researched:** 2026-04-07
**Overall Confidence:** HIGH (official Vercel docs + codebase analysis)

## Current Architecture (What Exists)

Single Node.js process serves everything:

```
Browser --> Express (port 5000)
              |-- *.mp4 routes (video streaming with range requests)
              |-- /api/* routes (products, demo-bookings, inquiries, contact, bundle-leads)
              |-- Vite middleware (dev) OR express.static (prod)
              |-- Catch-all --> index.html (SPA fallback)
```

**Key coupling points:**
- `server/index.ts` boots Express, seeds DB, registers API routes, then attaches Vite/static serving
- `server/vite.ts` handles both dev (Vite HMR middleware) and prod (`express.static` + SPA catch-all)
- `server/routes.ts` imports from `@shared/schema` using path alias
- `server/storage.ts` imports from `@shared/schema` using path alias
- `server/seed.ts` imports from `@shared/schema` using path alias
- `server/db.ts` imports from `@shared/schema` using path alias
- `server/lib/resend.ts` uses Replit-specific connector API (must be replaced)
- Video streaming at `*.mp4` uses `fs.createReadStream` with HTTP 206 range requests

## Target Architecture (Vercel)

Split into two independent deployment targets served by Vercel's infrastructure:

```
Browser --> Vercel Edge/CDN
              |-- Static assets (Vite build output, images, video) --> CDN
              |-- /api/* --> Vercel Function (Express serverless)
              |-- /* (everything else) --> index.html (SPA fallback via rewrite)
```

### Component Boundaries

| Component | Responsibility | Location | Communicates With |
|-----------|---------------|----------|-------------------|
| **Vite Static Build** | React SPA, CSS, JS bundles, index.html | `dist/public/` --> Vercel CDN | Browser (serves assets) |
| **Static Assets** | Images, video, favicon | `public/` directory at project root | Browser via CDN |
| **API Function** | Express app as single Vercel Function | `api/index.ts` (new entry point) | Neon DB, Resend API, Browser |
| **Shared Schema** | Types, Zod schemas, Drizzle table defs | `shared/schema.ts` (bundled into API function) | API Function (compile-time) |
| **Neon Database** | PostgreSQL (serverless HTTP driver) | External service | API Function |
| **Resend API** | Email delivery | External service | API Function |

### Data Flow (Post-Migration)

**Form Submission (e.g., Demo Booking):**

1. Browser renders React SPA (served from CDN)
2. User fills form, client validates with Zod schema from `@shared/schema`
3. Client POSTs to `/api/demo-bookings`
4. Vercel rewrites `/api/(.*)` to `api/index.ts` serverless function
5. Express route handler validates with same Zod schema
6. `storage.createDemoBooking()` calls Neon via HTTP driver (stateless, no connection pool needed)
7. Resend API sends confirmation + admin notification emails
8. Returns 201 JSON response
9. TanStack Query updates cache, shows toast

**Page Load:**

1. Browser requests `/products/trinity-pro`
2. Vercel CDN serves `index.html` (SPA fallback rewrite)
3. React app boots, Wouter matches route
4. Component fires `useQuery` to `GET /api/products/trinity-pro`
5. Vercel routes to Express serverless function
6. Storage layer queries Neon
7. JSON response cached by TanStack Query

**Video Playback:**

1. Browser requests `/0925_Trinity_launch__1758826468109.mp4`
2. Vercel CDN serves file directly from `public/` directory
3. Vercel CDN handles range requests natively (HTTP 206)
4. No serverless function involved -- pure CDN delivery

## Recommended Architecture: Two Entry Points

### Approach: Vercel Auto-Detection with Express Default Export

Use Vercel's native Express framework detection (available since CLI 47.0.5). This is simpler and more maintainable than the older `api/` directory + `@vercel/node` builder pattern.

**Confidence: HIGH** -- documented at [vercel.com/docs/frameworks/backend/express](https://vercel.com/docs/frameworks/backend/express)

#### New File: `api/index.ts` (API Entry Point)

This is the **only new server file** needed. It creates an Express app, registers routes, and exports it as a default export:

```typescript
import express from "express";
import { registerRoutes } from "../server/routes";
import { seedDatabase } from "../server/seed";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging (simplified for serverless)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`);
    }
  });
  next();
});

// Seed on first invocation (idempotent -- checks for existing products)
let seeded = false;
app.use(async (_req, _res, next) => {
  if (!seeded) {
    await seedDatabase();
    seeded = true;
  }
  next();
});

// Register all API routes
await registerRoutes(app);

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

export default app;
```

#### Key Differences from Current `server/index.ts`

| Concern | Current (Replit) | Target (Vercel) |
|---------|-----------------|-----------------|
| Entry point | `server/index.ts` | `api/index.ts` (new) |
| Static files | `express.static()` + catch-all | Vercel CDN from `public/` (automatic) |
| Video streaming | Custom `*.mp4` handler with `fs.createReadStream` | Vercel CDN handles range requests natively |
| Vite dev server | `server/vite.ts` middleware | Not used in production; local dev uses separate script |
| Port binding | `app.listen(5000)` | `export default app` (Vercel manages port) |
| DB seeding | Runs on server boot | Runs on first request (lazy, idempotent) |
| Resend client | Replit connector API | Direct `new Resend(process.env.RESEND_API_KEY)` |

### `vercel.json` Configuration

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build:client",
  "outputDirectory": "dist/public",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*\\.mp4)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" },
        { "key": "Accept-Ranges", "value": "bytes" }
      ]
    },
    {
      "source": "/(.*\\.(jpg|jpeg|png|webp|gif|svg|ico))",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**Rewrite order matters:**
1. `/api/(.*)` routes go to the Express serverless function
2. Everything else falls through to `index.html` (SPA catch-all)

**Confidence: HIGH** -- this is the standard Vercel SPA+API pattern documented in [vercel.com/docs/rewrites](https://vercel.com/docs/rewrites) and [GitHub Discussion #5448](https://github.com/vercel/vercel/discussions/5448).

### Path Alias Resolution: `@shared`

**The Problem:** Server code (`routes.ts`, `storage.ts`, `seed.ts`, `db.ts`) all import from `@shared/schema`. Vercel's Express auto-detection uses esbuild internally, which does NOT automatically resolve TypeScript path aliases from `tsconfig.json`.

**The Solution:** Two options, use Option A.

**Option A -- Custom build step with esbuild (RECOMMENDED):**
Pre-bundle the API function using the project's existing esbuild setup. The current `package.json` already has an esbuild build step. Modify it to output the API entry point:

```json
{
  "scripts": {
    "build:client": "vite build",
    "build:api": "esbuild api/index.ts --platform=node --packages=external --bundle --format=esm --outdir=api --out-extension:.js=.mjs --alias:@shared=./shared",
    "build": "npm run build:client && npm run build:api"
  }
}
```

The `--alias:@shared=./shared` flag tells esbuild to resolve the `@shared` import prefix to the `shared/` directory. This bundles `shared/schema.ts` directly into the API function output, eliminating the runtime dependency on path aliases.

**Confidence: HIGH** -- esbuild's `--alias` flag is well-documented and the project already uses esbuild for server bundling.

**Option B -- Replace aliases with relative imports:**
Change all `@shared/schema` imports in server code to `../shared/schema`. This works but is less clean and creates divergence from the client code's import style.

### Static Asset Strategy

**Total public directory size:** ~14MB (well within Vercel limits)

| Asset Type | Size | Strategy | CDN Caching |
|-----------|------|----------|-------------|
| MP4 video | 1.7MB | Vercel CDN from `public/` | `max-age=31536000, immutable` |
| Product images (jpg/png/webp) | ~10MB | Vercel CDN from `public/` | `max-age=31536000, immutable` |
| Favicons | ~90KB | Vercel CDN from `public/` | `max-age=31536000, immutable` |
| JS/CSS bundles | Varies | Vite build to `dist/public/` | Content-hashed filenames |

**Video streaming specifics:**
- The current custom `*.mp4` Express handler with `fs.createReadStream` and HTTP 206 range requests is **not needed on Vercel**
- Vercel's CDN natively supports range requests for static files
- The 1.7MB video file is well under Vercel's static file limits (100MB Hobby / 1GB Pro)
- No need for external video hosting (Mux, Cloudinary, etc.) at this file size
- **Confidence: HIGH** -- Vercel CDN handles range requests automatically for files in `public/`

**Important:** `express.static()` does NOT work on Vercel. Files must be in the project's `public/` directory to be served by the CDN. This means the Vite build output (`dist/public/`) must be set as `outputDirectory` in `vercel.json`, AND the static assets from `client/public/` must be accessible. Vite already copies `client/public/` contents into `dist/public/` during build.

### Resend Client Replacement

Current `server/lib/resend.ts` uses Replit-specific connector API (`REPLIT_CONNECTORS_HOSTNAME`, `REPL_IDENTITY`). Replace with direct API key:

```typescript
import { Resend } from 'resend';

let client: Resend | null = null;

export function getResendClient() {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY environment variable is required');
    client = new Resend(apiKey);
  }
  return { client, fromEmail: 'info@insightupsolutions.com' };
}
```

**Key difference from current code:** The Resend client CAN be cached in serverless because the API key doesn't expire (unlike Replit's rotating tokens). This improves performance by avoiding re-instantiation on every email send.

### Local Development Strategy

The existing `server/index.ts` continues to work for local development unchanged. Add a dedicated dev script:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "dev:vercel": "vercel dev"
  }
}
```

Both approaches work. `npm run dev` uses the existing Vite HMR setup. `vercel dev` simulates the production Vercel environment locally.

## Build Order (Dependency Graph)

```
Phase 1: Strip Replit dependencies (no architectural change)
  |-- Remove @replit/vite-plugin-runtime-error-modal from vite.config.ts
  |-- Remove @replit/vite-plugin-cartographer from vite.config.ts
  |-- Remove Replit dev banner script from client/index.html
  |-- Remove .replit file
  |
Phase 2: Replace Resend connector (isolated change)
  |-- Rewrite server/lib/resend.ts to use direct RESEND_API_KEY
  |-- Update function signature (getResendClient instead of getUncachableResendClient)
  |-- Update all callers in routes.ts (4 call sites)
  |
Phase 3: Create Vercel entry point + config (the core migration)
  |-- Create api/index.ts with Express default export
  |-- Create vercel.json with rewrites + headers
  |-- Update build scripts in package.json
  |-- Move/verify public/ assets accessible to Vercel CDN
  |-- Remove video streaming middleware from api/index.ts (CDN handles it)
  |
Phase 4: Fix known bugs (while we're in the code)
  |-- Fix updateInquiryStatus WHERE clause bug in storage.ts
  |-- Fix XSS in email HTML templates in routes.ts (escape user input)
  |
Phase 5: Deploy + verify
  |-- Set environment variables on Vercel (DATABASE_URL, RESEND_API_KEY)
  |-- Deploy to preview
  |-- Verify: static pages, API routes, form submissions, email delivery, video playback
  |-- Connect domain
```

**Critical path:** Phase 1 --> Phase 2 --> Phase 3 --> Phase 5
**Parallel work:** Phase 4 can happen alongside Phase 2 or Phase 3

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using the `api/` Directory with Individual Route Files
**What:** Splitting each API route into its own file in `api/products.ts`, `api/demo-bookings.ts`, etc.
**Why bad:** Creates multiple cold-start-prone functions, loses shared Express middleware (logging, error handling), requires duplicating storage/resend initialization in each file.
**Instead:** Single Express app as one Vercel Function. The Express router handles sub-routing internally.

### Anti-Pattern 2: Keeping `express.static()` or Custom Video Streaming
**What:** Trying to serve static files or stream video through the serverless function.
**Why bad:** `express.static()` is explicitly ignored by Vercel. Streaming via `fs.createReadStream` won't work because serverless functions don't have access to the static file directory at runtime.
**Instead:** Let Vercel CDN serve all static assets. Put files in `public/`.

### Anti-Pattern 3: Running Database Seeding as a Separate Build Step
**What:** Adding `seedDatabase()` to the build command.
**Why bad:** Build environment may not have DATABASE_URL or network access to Neon.
**Instead:** Lazy seed on first request (already idempotent via slug checking).

### Anti-Pattern 4: Using `import.meta.dirname` in Serverless Context
**What:** The current code uses `import.meta.dirname` for resolving file paths.
**Why bad:** In Vercel's serverless environment, the working directory and `__dirname` may not match expectations. The API function is bundled by esbuild, so relative paths to static files won't resolve correctly.
**Instead:** Static files are served by CDN, not by the function. Remove all `fs`-based file serving from the API entry point.

## Scalability Considerations

| Concern | Current (Replit) | On Vercel |
|---------|-----------------|-----------|
| Concurrent requests | Single process, limited | Auto-scales with Fluid compute |
| Cold starts | N/A (always-on) | Minimal -- Express is lightweight, Neon HTTP driver is stateless |
| DB connections | Single connection | HTTP driver (stateless) -- no connection pool needed |
| Static asset latency | Served from single origin | Global CDN edge cache |
| Video delivery | Range requests from origin | CDN with edge caching + native range support |
| Cost | Replit autoscale pricing | Hobby: free tier covers this traffic level |

## Environment Variables Required on Vercel

| Variable | Source | Required |
|----------|--------|----------|
| `DATABASE_URL` | Neon dashboard (existing) | Yes |
| `RESEND_API_KEY` | Resend dashboard (need to obtain) | Yes |
| `NODE_ENV` | Set automatically by Vercel | No (auto) |

## Sources

- [Express on Vercel (official docs)](https://vercel.com/docs/frameworks/backend/express) -- HIGH confidence
- [Vercel Rewrites](https://vercel.com/docs/rewrites) -- HIGH confidence
- [vercel.json Configuration](https://vercel.com/docs/project-configuration/vercel-json) -- HIGH confidence
- [Vercel Limits](https://vercel.com/docs/limits) -- HIGH confidence
- [Path Alias Discussion #10717](https://github.com/vercel/vercel/discussions/10717) -- MEDIUM confidence (community, not official resolution)
- [SPA Fallback Discussion #5448](https://github.com/vercel/vercel/discussions/5448) -- MEDIUM confidence
- [Video Hosting Best Practices](https://vercel.com/kb/guide/best-practices-for-hosting-videos-on-vercel-nextjs-mp4-gif) -- HIGH confidence
- [Using Express.js with Vercel KB](https://examples.vercel.com/kb/guide/using-express-with-vercel) -- HIGH confidence
- [Vercel/vercel DeepWiki - Node.js Serverless Functions](https://deepwiki.com/vercel/vercel/5.2-node.js-and-serverless-functions) -- MEDIUM confidence

---

*Architecture research: 2026-04-07*
