---
phase: 01-migrate-to-vercel
plan: 03
subsystem: infra
tags: [vercel, serverless, express, deployment, vercel-json]

# Dependency graph
requires:
  - phase: 01-migrate-to-vercel/01-02
    provides: clean server/index.ts exporting app, synchronous registerRoutes
provides:
  - Vercel serverless entry point (api/index.ts)
  - Vercel routing and build configuration (vercel.json)
affects: [deploy, production-domain]

# Tech tracking
tech-stack:
  added: []
  patterns: [express-as-serverless-handler, vercel-spa-routing]

key-files:
  created:
    - api/index.ts
    - vercel.json
  modified: []

key-decisions:
  - "Node.js builtins for handler types instead of @vercel/node"
  - "framework: null to prevent Next.js auto-detection"
  - "API rewrite before SPA catch-all in vercel.json"

patterns-established:
  - "Vercel serverless: synchronous default export wrapping Express app"
  - "Rewrite ordering: API routes first, SPA catch-all last"

requirements-completed: [VRCL-01, VRCL-02, VRCL-03]

# Metrics
duration: 1min
completed: 2026-04-08
---

# Phase 1 Plan 3: Vercel Infrastructure & Deploy Summary

**Vercel serverless entry point and routing config created; env vars and deploy require user action**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-08T23:39:27Z
- **Completed:** 2026-04-08T23:40:18Z
- **Tasks:** 2 of 4 (automated tasks complete; 2 require user action)
- **Files created:** 2

## Accomplishments
- Created `api/index.ts` serverless entry point — 4-line synchronous handler delegating to Express
- Created `vercel.json` with correct build command, output directory, framework override, and rewrite ordering
- Both files verified against acceptance criteria

## Task Commits

Each task was committed atomically:

1. **Task 3.1: Create api/index.ts serverless entry point** - `c932687` (feat)
2. **Task 3.2: Create vercel.json** - `ae809a5` (feat)
3. **Task 3.3: Set environment variables on Vercel** - PENDING (requires user action)
4. **Task 3.4: Deploy to Vercel preview URL** - PENDING (requires user action)

## Files Created/Modified
- `api/index.ts` - Vercel serverless function entry point wrapping Express app
- `vercel.json` - Vercel build/routing configuration

## Decisions Made
- Used `IncomingMessage`/`ServerResponse` from Node.js builtins instead of `@vercel/node` types — fewer assumptions, Express expects standard HTTP types
- Set `framework: null` to prevent Vercel from auto-detecting as Next.js
- API rewrite placed before SPA catch-all (critical ordering)

## Deviations from Plan

None - plan executed exactly as written for Tasks 3.1 and 3.2.

## Issues Encountered

None.

## Remaining Tasks (User Action Required)

### Task 3.3: Set environment variables on Vercel

The user must set two environment variables on Vercel via dashboard or CLI:

1. **DATABASE_URL** — Copy from Neon dashboard (existing connection string from `.env`)
2. **RESEND_API_KEY** — Obtain from Resend dashboard (Settings > API Keys)

Via CLI:
```bash
vercel env add DATABASE_URL production preview development
vercel env add RESEND_API_KEY production preview development
```

Verify: `vercel env ls` should show both variables for Production and Preview.

### Task 3.4: Deploy to Vercel preview URL

After env vars are set:

1. Run `vercel deploy` from project root
2. Verify the preview URL:
   - Homepage loads (HTTP 200)
   - `/api/products` returns JSON array
   - `/products` renders product catalog
   - `/demo` deep link works (SPA routing)
   - Demo booking form submits (201 response)
   - Contact form submits (201 response)
   - Page refresh on deep link still works
3. Verify locally: `npm run dev` starts on port 5000

## Next Phase Readiness
- Infrastructure files ready for deployment
- Blocked on: user setting env vars (Task 3.3) and running deploy (Task 3.4)
- After successful deploy, Phase 1 is complete and Phase 2 (Ship to Production) can begin

## Self-Check: PASSED

- FOUND: api/index.ts
- FOUND: vercel.json
- FOUND: 01-03-SUMMARY.md
- FOUND: c932687 (Task 3.1 commit)
- FOUND: ae809a5 (Task 3.2 commit)

---
*Phase: 01-migrate-to-vercel*
*Completed: 2026-04-08 (Tasks 3.1-3.2 only)*
