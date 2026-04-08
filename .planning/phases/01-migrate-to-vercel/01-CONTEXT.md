# Phase 1: Migrate to Vercel - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Strip all Replit-specific code, restructure the Express server for Vercel serverless deployment, fix critical bugs, and deploy to a working Vercel preview URL. Does NOT include production domain setup or end-to-end email verification (Phase 2).

</domain>

<decisions>
## Implementation Decisions

### Path Alias Resolution
- **D-01:** Rewrite `@shared/schema` imports to relative paths (`../shared/schema`) in all 3 server files (storage.ts, routes.ts, seed.ts). Do NOT use esbuild `--alias` — relative imports have zero build risk and the change is only 3 files.

### Server Architecture
- **D-02:** Split `server/index.ts` into two files:
  - `server/index.ts` — exports configured Express app + `appReady` promise. No `listen()`, no Vite middleware, no seed.
  - `server/dev.ts` — imports app, runs `seedDatabase()`, sets up Vite dev middleware, calls `listen()`. Used by `npm run dev`.
- **D-03:** `server/routes.ts` — change `registerRoutes` to return `void` instead of `Server`. Remove `createServer()` and `http` import. All route handler bodies stay unchanged.

### Database Seeding
- **D-04:** Remove `seedDatabase()` from server startup entirely. DB is already populated from Replit.
- **D-05:** Keep `seed.ts` as standalone script. Add `"seed": "tsx server/seed.ts"` to package.json for manual disaster recovery. No API endpoint.

### XSS Fix
- **D-06:** Create `server/lib/html.ts` with an `escapeHtml()` utility function. Use it in all 4 route handlers (demo-bookings, inquiries, contact, bundle-leads) to escape user input interpolated into email HTML templates.

### Resend Connector
- **D-07:** Rewrite `server/lib/resend.ts` to use `RESEND_API_KEY` env var directly. Cache the Resend client (API key doesn't rotate like Replit tokens). Keep same function signature so all callers in routes.ts remain unchanged.

### Vercel Entry Point
- **D-08:** Create `api/index.ts` as thin serverless wrapper: `await appReady; app(req, res)`. Express app handles all `/api/*` routing internally.
- **D-09:** `vercel.json` with: `buildCommand: "vite build"`, `outputDirectory: "dist/public"`, `framework: null`, rewrites for API catch-all and SPA fallback.

### Cleanup
- **D-10:** Delete: `.replit`, `replit.md`, `apps/` (stale Next.js artifact), `server/db.ts` (dead WebSocket driver), `index.html` (old prototype in root).
- **D-11:** Remove from vite.config.ts: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer` conditional block.
- **D-12:** Remove from client/index.html: Replit dev banner script (lines 20-21).
- **D-13:** Remove from package.json devDeps: `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-runtime-error-modal`. Add devDep: `@vercel/node`.
- **D-14:** Remove video streaming middleware from server (Vercel CDN handles range requests for static .mp4 files natively).

### Bug Fix
- **D-15:** Fix `server/storage.ts` line 148: change `where(eq(inquiries.id, status))` to `where(eq(inquiries.id, id))`.

### Build Scripts
- **D-16:** Update package.json scripts:
  - `build`: `vite build` (remove esbuild step — Vercel handles server bundling)
  - `dev`: `NODE_ENV=development tsx server/dev.ts`
  - Add: `seed`: `tsx server/seed.ts`

### Git Config
- **D-17:** Add `.vercel` to `.gitignore`.

### Claude's Discretion
- Error handling approach in the serverless entry point
- Exact structure of the `escapeHtml()` utility
- Whether to add `@vercel/node` types import or use inline types in api/index.ts
- tsconfig.json include array update (add `api/**/*`)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Server Files (modify)
- `server/index.ts` — Current Express setup, video middleware, seed call — refactor target
- `server/routes.ts` — API routes, email sending, createServer — simplify target
- `server/storage.ts` — Database operations, contains updateInquiryStatus bug at line 148
- `server/lib/resend.ts` — Replit connector to rewrite
- `server/vite.ts` — Dev/prod serving logic — parts move to dev.ts
- `server/seed.ts` — Idempotent seeder — keep as standalone script

### Client Files (modify)
- `client/index.html` — Contains Replit banner script to remove
- `vite.config.ts` — Contains Replit plugins to remove

### Config Files (modify)
- `package.json` — Dependencies and scripts to update
- `tsconfig.json` — Include array to update
- `.gitignore` — Add .vercel

### Schema (read-only reference)
- `shared/schema.ts` — Drizzle schema used by storage.ts and routes.ts

### New Files (create)
- `api/index.ts` — Vercel serverless entry point
- `server/dev.ts` — Local development entry point
- `server/lib/html.ts` — HTML escaping utility
- `vercel.json` — Vercel routing and build config

### Research
- `.planning/research/ARCHITECTURE.md` — Vercel Express migration patterns
- `.planning/research/PITFALLS.md` — Critical pitfalls to avoid
- `.planning/research/STACK.md` — Stack recommendations

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `server/storage.ts` DatabaseStorage class — already uses Neon HTTP driver, serverless-compatible, no changes needed except bug fix
- `server/routes.ts` route handlers — all work as-is, only the wrapping changes
- `shared/schema.ts` — unchanged, shared between client and server

### Established Patterns
- Express middleware chain: json parsing -> logging -> routes -> error handler -> static serving
- Resend integration: `getUncachableResendClient()` called per email send — keep same interface
- Drizzle ORM with Zod validation — no changes needed

### Integration Points
- `api/index.ts` imports from `server/index.ts` (the Express app export)
- `server/dev.ts` imports from `server/index.ts` + `server/vite.ts` + `server/seed.ts`
- `vercel.json` rewrites point `/api/*` to `api/index.ts` serverless function
- Vite build outputs to `dist/public/` — Vercel serves this as static CDN content

</code_context>

<specifics>
## Specific Ideas

No specific requirements — standard Vercel migration patterns apply per research findings.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-migrate-to-vercel*
*Context gathered: 2026-04-08*
