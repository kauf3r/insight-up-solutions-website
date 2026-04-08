---
phase: 1
plan: cleanup
subsystem: server, client, build
tags: [cleanup, security, bug-fix, replit-removal]
dependency_graph:
  requires: []
  provides: [clean-codebase, xss-protection, relative-server-imports]
  affects: [server/routes.ts, server/storage.ts, server/seed.ts, vite.config.ts, client/index.html, .gitignore, package.json]
tech_stack:
  added: []
  patterns: [escapeHtml utility for email templates]
key_files:
  created: [server/lib/html.ts]
  modified: [vite.config.ts, client/index.html, package.json, server/routes.ts, server/storage.ts, server/seed.ts, .gitignore]
  deleted: [.replit, replit.md, server/db.ts]
decisions:
  - Replit references in server/lib/resend.ts left intact (connector replacement is a separate plan)
  - Pre-existing TSC error in ProductCard.tsx not fixed (out of scope)
metrics:
  duration: 495s
  completed: 2026-04-08
  tasks: 9/9
---

# Phase 1 Plan 1: Cleanup & Bug Fixes Summary

Removed all Replit build artifacts, fixed WHERE clause bug in updateInquiryStatus, added XSS escaping to all email HTML templates via escapeHtml utility, rewrote server @shared imports to relative paths.

## Tasks Completed

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1.1 | Remove Replit Vite plugins | 9708d02 | Removed runtimeErrorOverlay and cartographer from vite.config.ts |
| 1.2 | Remove Replit dev banner | 3ab1336 | Deleted replit-dev-banner.js script tag from client/index.html |
| 1.3 | Delete Replit config files | 477e4d4 | Deleted .replit and replit.md |
| 1.4 | Remove Replit devDeps | 2a297e1 | Removed @replit/* from package.json devDependencies, ran npm install |
| 1.5 | Delete dead code | d80700e | Removed server/db.ts (unused), apps/ dir (untracked stale), root index.html (untracked stale) |
| 1.6 | Fix updateInquiryStatus WHERE clause | b81fed5 | Changed eq(inquiries.id, status) to eq(inquiries.id, id) |
| 1.7 | Fix XSS in email HTML templates | 0332171 | Created server/lib/html.ts, wrapped all user input in 8 email templates |
| 1.8 | Rewrite @shared imports | e85db0c | Changed @shared/schema to ../shared/schema in 3 server files |
| 1.9 | Add .vercel to .gitignore | 4160e9b | Added .vercel entry |

## Deviations from Plan

### Out-of-scope observations

**1. Replit references in server/lib/resend.ts**
- The Resend connector (`server/lib/resend.ts`) still uses `REPLIT_CONNECTORS_HOSTNAME` and `X_REPLIT_TOKEN`
- This is expected -- the connector will be replaced with direct Resend API key in a later plan
- Not in scope for this cleanup plan

**2. Pre-existing TSC error in ProductCard.tsx**
- `client/src/components/examples/ProductCard.tsx(8,8)`: Property 'slug' missing in ProductCardProps
- Pre-existing, unrelated to any changes in this plan
- Logged to deferred items

## Known Stubs

None -- no stubs introduced by this plan.

## Verification Results

- Zero Replit artifacts in build/config/devDeps (resend connector is separate scope)
- updateInquiryStatus uses `id` not `status` in WHERE clause
- All user input in email HTML templates escaped via escapeHtml()
- Server files use relative imports for shared schema
- .vercel added to .gitignore

## Self-Check: PASSED

All 6 file existence checks passed. All 9 commit hashes verified.
