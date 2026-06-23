# Insight Up Solutions — Vercel Migration

## What This Is

E-commerce and lead generation website for Insight Up Solutions, a professional UAV systems company. The site showcases drone platforms (Trinity Pro, payloads, GNSS equipment), captures demo bookings, quote requests, contact inquiries, and bundle leads via forms with email notifications. Deployed on Vercel, live at insightupsolutions.com (migrated off Replit in v1.0).

## Core Value

The site must serve product pages and capture leads (demo bookings, quotes, contact forms) with email notifications to both the customer and admin. If anything else breaks, these must work.

## Requirements

### Validated

<!-- Existing capabilities confirmed from codebase -->

- ✓ Product catalog with detail pages and category filtering — existing
- ✓ Demo booking form with confirmation + admin notification emails — existing
- ✓ Quote request form with confirmation + admin notification emails — existing
- ✓ Contact form with confirmation + admin notification emails — existing
- ✓ Bundle lead capture with confirmation + admin notification emails — existing
- ✓ Hero video on homepage — existing
- ✓ Solutions pages (surveying, agriculture, public safety, custom) — existing
- ✓ About and training pages — existing
- ✓ Product seeding (idempotent, 17 UAV products) — existing
- ✓ Mobile-responsive design — existing

<!-- Shipped in v1.0 Vercel Migration -->

- ✓ Migrated Express API to Vercel serverless (single function wrapping Express) — v1.0
- ✓ Replaced Replit Resend connector with direct API key — v1.0
- ✓ Removed Replit plugins from Vite config and client HTML — v1.0
- ✓ Configured Vercel routing (API rewrite + SPA fallback) — v1.0
- ✓ Connected insightupsolutions.com domain with SSL — v1.0
- ✓ Fixed `updateInquiryStatus` WHERE clause bug — v1.0
- ✓ Fixed XSS in email HTML templates (input escaped) — v1.0
- ✓ Set Vercel env vars (DATABASE_URL, RESEND_API_KEY) — v1.0
- ✓ Static assets (video range-streaming, images) verified via Vercel CDN — v1.0

### Active

<!-- v1.1 candidates discovered during v1.0 ship -->

- [ ] Retry-with-backoff on Resend 429/5xx so a burst can't silently drop a lead notification (currently logged-and-swallowed)
- [ ] Confirm/fix Vercel auto-deploy from `main` (v1.0 push did not auto-deploy; deployed manually)
- [ ] v2 backlog remains in scope candidates: security headers, www↔apex redirect, CSP, form rate limiting (see archived v1.0-REQUIREMENTS.md "v2 Requirements")

### Out of Scope

- Email template extraction/refactoring — tech debt, not blocking migration
- Structured logging — console.log works fine for now on Vercel
- Hardcoded admin email cleanup — works, just not ideal
- Stripe integration — dependencies exist but no routes, defer
- Authentication system — Passport.js is wired but not actively used
- Test framework setup — no tests exist currently, defer

## Context

- **Current State (v1.0 shipped 2026-06-22):** Live in production on Vercel at https://insightupsolutions.com (SSL). Prod deploy `dpl_D4CEvqZyM5cTqcUHei8oQQxCTqV7`, commit `feb34ab`. All 26 v1 requirements verified. Stack: Vite React SPA + Express-on-Vercel-serverless, Neon Postgres, Resend email (domain verified). No test framework; gates are `tsc` + `vite build` + live E2E.
- **Current deployment**: Vercel (static + serverless) — migrated off Replit
- **Prior deployment**: Replit (autoscale target) — retired
- **Database**: Neon Postgres (stays as-is, no migration needed)
- **Email**: Resend (need to get API key from dashboard, currently accessed via Replit connector)
- **Domain**: insightupsolutions.com (will point to Vercel)
- **Vercel account**: Already exists
- **Codebase map**: `.planning/codebase/` (7 documents)

Key architectural change: monolithic Express server → Vite static build + Express-wrapped Vercel serverless function. The Neon HTTP driver in `server/storage.ts` is already serverless-compatible.

## Constraints

- **Database**: Keep existing Neon DB — real lead data exists, no re-creation
- **Email**: RESEND_API_KEY must be obtained from Resend dashboard before email testing
- **Static assets**: Video file (~1.7MB) and product images must work via Vercel CDN
- **Path aliases**: `@shared` and `@` must resolve in both Vite build and Vercel's esbuild bundler
- **Local dev**: Must still work after migration (new dev entry point needed)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep existing Neon DB | Real data exists, Neon is already serverless-compatible | ✓ Good — 17 products + leads served in prod, no migration needed |
| Single serverless function wrapping Express | Minimal code change vs rewriting individual API functions | ✓ Good — all routes work in prod on one function |
| Migration + critical fixes scope | Fixes are cheap since we're touching those files anyway | ✓ Good — `updateInquiryStatus` + XSS fixed in-flight |
| Defer email template cleanup | Works as-is, not blocking migration | ⚠️ Revisit — inline templates fine, but swallow-without-retry sends can silently drop notifications (v1.1) |
| Deliver Phase 2 directly (no GSD plan rounds) | Ops/deploy/verify phase, no code changes | ✓ Good — verified 8/8 reqs live |
| Verify on prod `.vercel.app` before attaching domain | Verify-before-public-go-live | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-22 after v1.0 Vercel Migration milestone*
