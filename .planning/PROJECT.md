# Insight Up Solutions — Vercel Migration

## What This Is

E-commerce and lead generation website for Insight Up Solutions, a professional UAV systems company. The site showcases drone platforms (Trinity Pro, payloads, GNSS equipment), captures demo bookings, quote requests, contact inquiries, and bundle leads via forms with email notifications. Currently deployed on Replit — migrating to Vercel.

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

### Active

<!-- Migration scope: deploy to Vercel + critical fixes -->

- [ ] Migrate Express API to Vercel Serverless Functions
- [ ] Replace Replit-specific Resend connector with direct API key
- [ ] Remove Replit plugins from Vite config and client HTML
- [ ] Configure Vercel routing (API + SPA fallback)
- [ ] Connect insightupsolutions.com domain to Vercel
- [ ] Fix `updateInquiryStatus` bug (uses `status` instead of `id` in WHERE clause)
- [ ] Fix XSS vulnerability in email HTML templates (unescaped user input)
- [ ] Set up Vercel environment variables (DATABASE_URL, RESEND_API_KEY)
- [ ] Verify static asset serving (video, images) works via Vercel CDN

### Out of Scope

- Email template extraction/refactoring — tech debt, not blocking migration
- Structured logging — console.log works fine for now on Vercel
- Hardcoded admin email cleanup — works, just not ideal
- Stripe integration — dependencies exist but no routes, defer
- Authentication system — Passport.js is wired but not actively used
- Test framework setup — no tests exist currently, defer

## Context

- **Current deployment**: Replit (autoscale target)
- **Target deployment**: Vercel (static + serverless)
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
| Keep existing Neon DB | Real data exists, Neon is already serverless-compatible | — Pending |
| Single serverless function wrapping Express | Minimal code change vs rewriting individual API functions | — Pending |
| Migration + critical fixes scope | Fixes are cheap since we're touching those files anyway | — Pending |
| Defer email template cleanup | Works as-is, not blocking migration | — Pending |

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
*Last updated: 2026-04-08 after initialization*
