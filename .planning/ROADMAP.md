# Roadmap: Insight Up Solutions — Vercel Migration

**Version:** v1.0
**Phases:** 2
**Granularity:** Coarse
**Created:** 2026-04-08

## Overview

| # | Phase | Goal | Requirements | Plans |
|---|-------|------|--------------|-------|
| 1 | Migrate to Vercel | Codebase freed from Replit, deployed to Vercel preview URL with working API, forms, and emails | REPL-01..05, VRCL-01..07, MAIL-01, FIX-01, FIX-02, DEV-01, DEV-02, PROD-01 | — |
| 2 | Ship to Production | Site live at insightupsolutions.com with full functionality verified | MAIL-02..04, PROD-02..06 | — |

## Phase 1: Migrate to Vercel

**Goal:** Codebase freed from Replit dependencies, restructured for Vercel serverless, deployed to a working preview URL.

**Requirements:**
- REPL-01: Remove Replit Vite plugins from vite.config.ts
- REPL-02: Remove Replit dev banner from client/index.html
- REPL-03: Delete .replit and replit.md
- REPL-04: Remove Replit devDependencies from package.json
- REPL-05: Delete dead code (server/db.ts, apps/)
- VRCL-01: Create serverless entry point (api/index.ts)
- VRCL-02: Configure vercel.json API rewrite
- VRCL-03: Configure vercel.json SPA catch-all
- VRCL-04: Build command produces correct Vite output
- VRCL-05: Path alias @shared resolves in serverless bundle
- VRCL-06: Environment variables set on Vercel
- VRCL-07: Remove video streaming Express middleware
- MAIL-01: Rewrite Resend connector for direct API key
- FIX-01: Fix updateInquiryStatus WHERE clause bug
- FIX-02: Fix XSS in email HTML templates
- DEV-01: Create local dev entry point (server/dev.ts)
- DEV-02: npm run dev works after migration
- PROD-01: Site deployed to Vercel preview URL

**Success Criteria:**
1. `vercel deploy` produces a preview URL that loads the homepage with hero video
2. Product catalog pages render with images at the preview URL
3. Form submissions (demo booking, quote, contact) succeed and trigger confirmation + admin emails
4. `npm run dev` starts the app locally after migration changes
5. No Replit artifacts remain in the codebase

**UI hint:** no

**Key files:**
- `vite.config.ts` — remove Replit plugins
- `client/index.html` — remove Replit banner
- `server/lib/resend.ts` — rewrite for direct API key
- `server/index.ts` — refactor to export app (no listen)
- `server/routes.ts` — remove HTTP server creation, fix bugs
- `server/storage.ts` — fix updateInquiryStatus
- `api/index.ts` — NEW serverless entry point
- `server/dev.ts` — NEW local dev entry
- `vercel.json` — NEW routing + build config
- `package.json` — update deps + scripts

---

## Phase 2: Ship to Production

**Goal:** Site live at insightupsolutions.com with full functionality verified end-to-end on the production domain.

**Requirements:**
- MAIL-02: Demo booking confirmation emails work on Vercel
- MAIL-03: Quote/inquiry confirmation emails work on Vercel
- MAIL-04: Admin notification emails delivered on Vercel
- PROD-02: insightupsolutions.com domain connected
- PROD-03: All product pages load with images
- PROD-04: Hero video plays on homepage
- PROD-05: All form submissions work
- PROD-06: SPA routing works on page refresh

**Success Criteria:**
1. insightupsolutions.com resolves and loads with SSL
2. All product pages load with images on the production domain
3. Hero video plays on the homepage
4. All four form types submit successfully with both customer and admin email notifications
5. Deep links and page refreshes work (SPA routing on production)

**UI hint:** no

**Key tasks:**
- Connect insightupsolutions.com domain in Vercel dashboard
- Configure DNS (A record for apex, CNAME for www)
- Set RESEND_API_KEY in Vercel production environment
- End-to-end testing of all form flows
- Verify all pages accessible via direct URL

---

## Coverage

| Requirement | Phase |
|-------------|-------|
| REPL-01 | 1 |
| REPL-02 | 1 |
| REPL-03 | 1 |
| REPL-04 | 1 |
| REPL-05 | 1 |
| VRCL-01 | 1 |
| VRCL-02 | 1 |
| VRCL-03 | 1 |
| VRCL-04 | 1 |
| VRCL-05 | 1 |
| VRCL-06 | 1 |
| VRCL-07 | 1 |
| MAIL-01 | 1 |
| MAIL-02 | 2 |
| MAIL-03 | 2 |
| MAIL-04 | 2 |
| FIX-01 | 1 |
| FIX-02 | 1 |
| DEV-01 | 1 |
| DEV-02 | 1 |
| PROD-01 | 1 |
| PROD-02 | 2 |
| PROD-03 | 2 |
| PROD-04 | 2 |
| PROD-05 | 2 |
| PROD-06 | 2 |

**v1 requirements:** 26 total
**Mapped:** 26
**Unmapped:** 0

---
*Roadmap created: 2026-04-08*
