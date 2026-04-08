# Project Research Summary

**Project:** Insight Up Solutions
**Domain:** Replit-to-Vercel migration — Express + Vite SPA (e-commerce / lead generation)
**Researched:** 2026-04-07
**Confidence:** HIGH

## Executive Summary

This is a platform migration, not a product build. The site already works on Replit: React SPA (Vite), Express API, Neon Postgres, Resend email, with product catalog and lead capture forms as core value. The task is to move it to Vercel without changing anything the business cares about. Research confirms this is a well-trodden pattern with official Vercel support — a single Express app wrapped as one serverless function, Vite static output served via CDN, and `vercel.json` rewrites handling API routing and SPA fallback. No Next.js rewrite. No route splitting. Minimal code changes.

The recommended approach is a two-deployment-target architecture: Vite builds the React SPA to `dist/public/` (served by Vercel's CDN), and a new `api/index.ts` file wraps the existing Express app as a single Vercel serverless function. The only non-trivial code changes are (1) creating `api/index.ts` with a default export instead of `app.listen()`, (2) replacing the Replit-specific Resend connector with a direct API key, and (3) fixing TypeScript path alias resolution for `@shared/schema` in the esbuild bundle. Everything else — the existing dependencies, schema, routes, storage layer, database driver — carries over unchanged.

The primary risks are concentrated and well-understood. Six critical pitfalls were identified: `express.static()` is silently ignored by Vercel; the Replit Resend connector crashes hard (breaking all lead notifications); `@shared` path aliases fail in esbuild without explicit alias config; SPA routes 404 without a `vercel.json` catch-all rewrite; the existing `server/index.ts` entry point structure is incompatible with Vercel's function export pattern; and there is dead database code (`server/db.ts`) that could cause confusion if a developer modifies the wrong file. All six are preventable with targeted changes in Phase 1.

## Key Findings

### Recommended Stack

The existing stack requires almost no changes. Vercel natively detects Express apps (zero-config since September 2025, Vercel CLI >= 47.0.5). The `@neondatabase/serverless` HTTP driver is already serverless-compatible. Vite 5 is auto-detected. drizzle-orm is runtime-agnostic. The `resend` SDK is a plain HTTP client and works with a direct API key.

Two packages must be removed: `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-runtime-error-modal` — they will break the Vite build on Vercel. One package must be added: `vercel` as a dev dependency for local `vercel dev` testing. Node.js 20.x is the safe choice (current project version; Vercel supports 20/22/24, defaulting to 24 since November 2025).

**Core technologies:**
- Express 4.21.2: API server — kept as-is, wrapped in single Vercel function via `api/index.ts` default export
- Vite 5.4.19 + React 18.3.1: frontend build — kept as-is, output directory set to `dist/public` in `vercel.json`
- `@neondatabase/serverless` (HTTP driver in `storage.ts`): database — zero changes, already serverless-compatible
- drizzle-orm 0.39.1: ORM — zero changes
- `resend` 6.4.2: email — SDK kept, connector wrapper replaced with `new Resend(process.env.RESEND_API_KEY)`
- esbuild 0.25.0: API bundling — existing build step adapted with `--alias:@shared=./shared` flag

### Expected Features

All table-stakes items map directly to code changes in Phase 1. Differentiators are quick wins that should ship alongside Phase 1 since they are configuration-level changes.

**Must have (table stakes):**
- `vercel.json` routing config with API rewrites + SPA catch-all — without this, deep links 404 and API is unreachable
- `api/index.ts` serverless wrapper (default export, no `app.listen()`) — the core structural change
- Resend direct API key replacement — without this, all form submissions succeed silently with zero emails sent
- Remove Replit Vite plugins + HTML script tag — without this, the Vite build fails on Vercel
- Environment variables set in Vercel dashboard (`DATABASE_URL`, `RESEND_API_KEY`) — site is dead without these
- Path alias resolution for `@shared` in esbuild bundle — without this, every API request returns 500
- Custom domain (insightupsolutions.com) connected with DNS + auto-SSL

**Should have (competitive / production quality):**
- Security headers in `vercel.json` (15 min of work: `X-Frame-Options`, `X-Content-Type-Options`, CSP report-only)
- www-to-apex redirect (5 min in Vercel dashboard)
- GitHub repo connected for git-based deploys + preview URLs
- Environment variable scoping (Production vs Preview) to avoid real Resend sends on preview deployments
- Parallel email sends with `Promise.allSettled()` to halve form submission response time
- Delete dead `server/db.ts` to prevent developer confusion

**Defer:**
- Stripe integration (dependencies present, no routes implemented — different milestone)
- Auth system activation (Passport.js dormant — leave it)
- Database schema changes (real lead data exists — do not touch during migration)
- Custom 404/500 error pages
- Structured logging / log drains
- Rate limiting on form endpoints (not needed for Hobby plan; revisit if spam emerges)

Hobby plan is sufficient for launch. Nothing in this migration requires Vercel Pro. Serverless timeout is 10s (form submissions complete in <5s), bandwidth 100GB/mo (1.7MB video is not a concern at this traffic level), and preview deployment protection is included.

### Architecture Approach

The target architecture splits a single long-running Node process into two independent Vercel deployment targets. The browser hits Vercel's edge network: static asset requests (SPA, images, video) are served from CDN with no function invocation; `/api/*` requests are rewritten to the Express serverless function. The key insight is that `express.static()` and custom video streaming middleware must be removed entirely from the serverless entry point — they are replaced by Vercel's CDN, which natively handles range requests. The Resend client can be a module-level singleton (unlike the Replit connector, the API key does not rotate).

**Major components:**
1. `api/index.ts` (new file) — Express app with default export; registers routes from `server/routes.ts`, seeds DB lazily on first request, exports app for Vercel
2. `vercel.json` (new file) — routes `/api/*` to the function, everything else to `index.html`; adds cache headers for video and image assets
3. `server/lib/resend.ts` (rewrite) — replace Replit connector with `new Resend(process.env.RESEND_API_KEY)`, cacheable singleton
4. `package.json` build scripts (update) — separate `build:client` (Vite) and `build:api` (esbuild with `--alias:@shared`) steps
5. Existing `server/index.ts` — untouched, remains the local dev entry point
6. Existing `server/routes.ts`, `server/storage.ts`, `server/seed.ts` — untouched, shared by both entry points

### Critical Pitfalls

1. **`express.static()` is silently ignored** — blank page in production because CSS/JS 404. Fix: remove from Vercel entry point, configure `outputDirectory` in `vercel.json`, let CDN serve all static assets.
2. **Replit Resend connector crashes on Vercel** — emails never send, leads go dark, no visible error to end user. Fix: replace `server/lib/resend.ts` before first deployment, obtain `RESEND_API_KEY` directly from Resend dashboard.
3. **`@shared` path aliases fail in esbuild** — every API request returns 500, backend fully down. Fix: add `--alias:@shared=./shared` to esbuild command, or replace with relative imports in server files.
4. **SPA routes 404 on direct access or refresh** — every deep link, bookmark, and browser refresh breaks. Fix: SPA catch-all rewrite in `vercel.json` must ship with initial deployment.
5. **Dual database driver confusion** — `server/db.ts` is dead code (WebSocket driver, never imported); `server/storage.ts` is the real connection (HTTP driver). Modifying the wrong file wastes debugging time. Fix: delete `server/db.ts` in Phase 1 cleanup.
6. **`vercel.json` rewrite order** — if SPA catch-all appears before API rewrite, all API calls return `index.html`. Fix: API rewrites must be listed first.

## Implications for Roadmap

### Phase 1: Rip Out Replit, Wire Up Vercel

**Rationale:** All critical pitfalls are blocking. Nothing else can be verified until the site builds cleanly and the API function starts without crashing. This phase IS the migration — a narrow, well-defined set of changes.

**Delivers:** A working Vercel deployment at a `.vercel.app` preview URL with full functionality (product pages, forms, emails, video, database).

**Addresses (table stakes from FEATURES.md):**
- Remove Replit Vite plugins and HTML script tag
- Create `api/index.ts` Express serverless wrapper with default export
- Replace Resend connector with direct API key
- Create `vercel.json` with rewrites and cache headers
- Fix `@shared` path alias in esbuild build (`--alias:@shared=./shared`)
- Set `DATABASE_URL` and `RESEND_API_KEY` in Vercel dashboard
- Delete dead `server/db.ts`
- Delete root-level `index.html` Replit artifact
- Fix `@assets` alias gap in tsconfig

**Avoids:** Pitfalls 1, 3, 4, 5, 6, 9, 11, 12, 15

### Phase 2: Ship to Production Domain

**Rationale:** Once the preview URL is verified end-to-end, the only remaining work is DNS cutover and production polish. Separated from Phase 1 because DNS propagation is asynchronous and outside our control.

**Delivers:** Site live at `insightupsolutions.com` with SSL, www redirect, and GitHub-based auto-deploys.

**Addresses:**
- Connect custom domain in Vercel dashboard
- Configure A record (apex) and CNAME (www) in DNS
- Set www-to-apex redirect
- Connect GitHub repo for git-based deployments and PR preview URLs
- Scope environment variables to Production (prevent Resend sends on preview builds)

**Avoids:** Pitfall 3 — verify rewrites working before DNS switch.

### Phase 3: Production Hardening

**Rationale:** These improvements do not block launch but matter for a professional site accepting real leads. All are fast wins (configuration-level or small code changes).

**Delivers:** Security posture, performance optimization, and operational correctness appropriate for a live customer-facing site.

**Addresses:**
- Security headers in `vercel.json` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, CSP report-only to start)
- Parallelize email sends with `Promise.allSettled()` — halves email latency per form submission (Pitfall 16)
- Remove seed from cold-start path — database already has real data; seeding is vestigial (Pitfall 10)
- Audit and trim Google Fonts request — 25+ font families loading on every page is unnecessary latency (Pitfall 14)
- Fix known bugs: `updateInquiryStatus` WHERE clause bug in `storage.ts`; XSS in email HTML templates (escape user input in `routes.ts`)
- Add `dev:vercel` script to `package.json` for testing serverless behavior locally

### Phase Ordering Rationale

- Phase 1 before Phase 2: Cannot cut DNS until the preview deployment is verified working end-to-end. Domain cutover is irreversible in user impact.
- Phase 2 before Phase 3: Security headers and performance tuning are meaningless before the site is live at its real domain.
- Stripe, auth activation, and schema changes are explicitly out of scope for this migration milestone. Research is unanimous: change the platform, not the product.
- Bug fixes (storage WHERE clause, XSS in email templates) are bundled into Phase 3 but could be moved to Phase 1 if the team wants a clean codebase before initial deploy.

### Research Flags

No additional phase research is needed. All three phases follow well-documented patterns with official Vercel docs as primary sources.

- **Phase 1:** Standard, documented pattern — HIGH confidence, no research-phase needed
- **Phase 2:** Trivial dashboard and DNS configuration — no research-phase needed
- **Phase 3:** Standard patterns (security headers, Promise.allSettled) — no research-phase needed

One implementation-time validation: confirm whether Vercel's zero-config Express detection fires automatically for `api/index.ts` or whether `vercel.json` needs an explicit `functions` config. Easy to verify on first deploy; fallback is documented.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations from official Vercel docs; version verification table complete; zero-config Express confirmed Sept 2025 |
| Features | HIGH | Critical path derived from codebase analysis + official docs; table stakes vs anti-features distinction is clear |
| Architecture | HIGH | Default export pattern is documented; rewrite ordering is verified; esbuild alias solution is documented |
| Pitfalls | HIGH | 16 pitfalls with reproduction conditions, warning signs, and prevention steps; most verified against official issue trackers |

**Overall confidence: HIGH**

### Gaps to Address

- **Vercel zero-config Express detection for `api/index.ts`:** Documented to work; confirm during first `vercel deploy`. Fallback is explicit `functions` config in `vercel.json`.
- **`RESEND_API_KEY` retrieval:** Key currently lives in Replit's connector. Confirm it is accessible from the Resend dashboard before migration day.
- **esbuild `--alias` vs relative imports:** Both work. Decide before Phase 1 begins — esbuild flag keeps `@shared` alias consistent across codebase; relative imports are simpler but change import style in server files.
- **Root `index.html` purpose:** Identified as likely a Replit artifact. Confirm it is not serving a purpose before deleting.
- **Neon database region:** Research assumes iad1 (US East). Verify in Neon dashboard to confirm no cross-region latency concern with Vercel's default deployment region.

## Sources

### Primary (HIGH confidence)
- [Express on Vercel](https://vercel.com/docs/frameworks/backend/express) — zero-config Express detection, default export pattern
- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite) — auto-detection, output directory
- [vercel.json Configuration Reference](https://vercel.com/docs/project-configuration/vercel-json) — rewrites, headers, buildCommand, outputDirectory
- [Using the Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js) — path alias limitation confirmed
- [Supported Node.js Versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) — 20/22/24 support confirmed
- [Zero-Configuration Express Backends Changelog](https://vercel.com/changelog/zero-configuration-express-backends) — Sept 2025 release
- [Vercel Rewrites](https://vercel.com/docs/rewrites) — SPA fallback and API routing
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables) — scoping to environments
- [Vercel Custom Domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain) — DNS setup, SSL
- [Vercel Function Limits](https://vercel.com/docs/functions/limitations) — timeout, size, payload
- [Vercel Security Headers](https://vercel.com/docs/edge-network/security-headers) — headers config in vercel.json
- [Resend + Vercel Functions](https://resend.com/docs/send-with-vercel-functions) — direct API key pattern
- [Neon + Vercel Connection Methods](https://neon.com/docs/guides/vercel-connection-methods) — HTTP driver confirmed serverless-compatible
- [Path Alias Discussion #10717](https://github.com/vercel/vercel/discussions/10717) — path aliases unsupported in serverless runtime
- [esbuild `__dirname` issue #1874](https://github.com/evanw/esbuild/issues/1874) — `import.meta.dirname` behavior after bundling
- [esbuild tsconfig paths issue #394](https://github.com/evanw/esbuild/issues/394) — aliases not read from tsconfig without explicit config
- [Video Hosting Best Practices on Vercel](https://vercel.com/kb/guide/best-practices-for-hosting-videos-on-vercel-nextjs-mp4-gif) — CDN range request handling confirmed

### Secondary (MEDIUM confidence)
- [Vercel SPA Fallback Discussion #5448](https://github.com/vercel/vercel/discussions/5448) — community-confirmed SPA rewrite pattern
- [MERN Monorepo on Vercel Guide](https://dev.to/bcncodeschool/deploying-a-mern-full-stack-web-application-on-vercelcom-with-express-and-vite-as-a-monorepo-49jc) — community guide, validated against official docs
- [TypeScript path aliases and esbuild](https://aschaaf.net/posts/esbuild-aliases-only-work-when-bundling/) — community article on esbuild alias behavior

---
*Research completed: 2026-04-07*
*Ready for roadmap: yes*
