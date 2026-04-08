---
phase: 01-migrate-to-vercel
plan: 02
subsystem: api, infra
tags: [express, resend, vercel, serverless, email]

# Dependency graph
requires:
  - phase: 01-01
    provides: Clean codebase with Replit artifacts removed
provides:
  - Serverless-compatible Express app export (no listen, no IIFE)
  - Direct RESEND_API_KEY email connector (no Replit connector)
  - Local dev entry point (server/dev.ts)
  - Updated build scripts (vite-only build, no esbuild)
affects: [01-03-vercel-config]

# Tech tracking
tech-stack:
  added: []
  patterns: [serverless-compatible Express export, centralized email config]

key-files:
  created: [server/dev.ts]
  modified: [server/lib/resend.ts, server/routes.ts, server/index.ts, package.json, tsconfig.json]

key-decisions:
  - "Resend client cached at module level (API key stable, unlike Replit rotating tokens)"
  - "fromEmail centralized in getResendClient return value (single source of truth)"
  - "server/index.ts exports bare app — no listen, no seed, no video middleware"
  - "Video streaming middleware removed (Vercel CDN handles range requests)"

patterns-established:
  - "getResendClient() returns { client, fromEmail } — all email sends destructure both"
  - "server/index.ts is serverless-importable — server/dev.ts adds dev-only concerns"

requirements-completed: [MAIL-01, VRCL-07, DEV-01, DEV-02]

# Metrics
duration: 4min
completed: 2026-04-08
---

# Phase 1 Plan 2: Server Restructure & Email Rewrite Summary

**Resend connector rewritten for direct API key, Express app restructured as serverless-importable export with separate dev entry point**

## Performance

- **Duration:** 4 min (272s)
- **Started:** 2026-04-08T23:09:50Z
- **Completed:** 2026-04-08T23:14:22Z
- **Tasks:** 6
- **Files modified:** 5

## Accomplishments
- Replaced Replit Resend connector with direct RESEND_API_KEY usage, cached client, centralized fromEmail
- Restructured server/index.ts from async IIFE with listen/seed/video to clean serverless-compatible app export
- Created server/dev.ts as local development entry point with seed, Vite HMR, and error handling
- Updated package.json scripts: dev points to dev.ts, build is vite-only, removed dead start script, added seed script

## Task Commits

Each task was committed atomically:

1. **Task 2.1: Rewrite resend.ts for direct API key** - `c74c05e` (feat)
2. **Task 2.2a: Simplify routes.ts — remove createServer, make synchronous** - `4e56d6d` (feat)
3. **Task 2.2b: Rewrite server/index.ts — export app directly** - `83f0469` (feat)
4. **Task 2.2c: Create server/dev.ts** - `5d5021c` (feat)
5. **Task 2.3: Update package.json scripts** - `eaf1f01` (feat)
6. **Task 2.4: Update tsconfig.json include array** - `b515825` (feat)

## Files Created/Modified
- `server/lib/resend.ts` - Rewritten: direct RESEND_API_KEY usage, cached client, sync getResendClient()
- `server/routes.ts` - Updated: sync registerRoutes(), no createServer, uses getResendClient with fromEmail
- `server/index.ts` - Rewritten: bare Express app export, no IIFE/listen/seed/video
- `server/dev.ts` - Created: local dev entry point with seed + Vite HMR + listen + .catch()
- `package.json` - Updated: dev->dev.ts, build->vite-only, removed start, added seed
- `tsconfig.json` - Added api/**/* to include array

## Decisions Made
- Resend client cached at module level (API key is stable, unlike Replit rotating tokens)
- fromEmail centralized in getResendClient return value (was hardcoded 8 times across routes.ts)
- Video streaming middleware removed entirely (Vercel CDN handles range requests natively)
- registerRoutes made synchronous void (was async Promise<Server> — all awaits are inside callbacks)

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required for this plan.

## Next Phase Readiness
- Express app is serverless-importable via `import { app } from "./index"`
- Ready for Plan 03: Vercel configuration (vercel.json, api/index.ts serverless function)
- RESEND_API_KEY will need to be set as Vercel environment variable (documented in Phase 2)

## Self-Check: PASSED

All 6 created/modified files verified present. All 6 commit hashes verified in git log.

---
*Phase: 01-migrate-to-vercel*
*Completed: 2026-04-08*
