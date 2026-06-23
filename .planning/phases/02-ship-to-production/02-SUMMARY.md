---
phase: 2
name: ship-to-production
status: complete
delivered: "2026-06-22"
mode: direct-delivery (ops/deploy phase — no code changes; verified live)
---

# Phase 2: Ship to Production — Delivery Summary

**Goal:** Site live at insightupsolutions.com with full functionality verified end-to-end on the production domain.

## Outcome

Complete. Site is live at https://insightupsolutions.com on Vercel with valid SSL. All 8 requirements verified — PROD-02/03/04/05/06 via live HTTP/E2E, MAIL-02/03/04 via the Resend API showing `delivered` for all 8 email paths.

This was an ops/deploy/verify phase, not a code phase — no source changes were required. The GSD code-delivery template (UI-SPEC, parallel coding waves, test suite, PRs) did not apply: roadmap "UI hint: no", repo has no test framework (`package.json` scripts: dev/build/check/db:push/seed), and the project auto-deploys from `main`. Gates used were `tsc` + `vite build` + live HTTP/E2E verification.

## What was done

1. Confirmed DNS (changed by Andy at GoDaddy 2026-06-22): apex → `216.150.16.1`/`216.150.1.1` (Vercel anycast), `www` → `cname.vercel-dns.com`.
2. Ran gates: `npm run check` (tsc clean), `npm run build` (success).
3. Deployed HEAD `feb34ab` to production (`vercel --prod`) — prior prod was one commit behind (`3272718`), so NARMA/Zing products were not yet live. New deploy: `dpl_D4CEvqZyM5cTqcUHei8oQQxCTqV7`.
4. Domain aliased to insightupsolutions.com on deploy (custom domain already attached to project).
5. Verified env: `RESEND_API_KEY` + `DATABASE_URL` present in Vercel Production (set 74d ago).
6. End-to-end verification on the live domain (below).
7. Submitted one labeled test (`ZZ_TEST_VercelVerify`) to each of the 4 forms, then deleted all 4 rows from the prod Neon DB (guarded by id + name marker; remaining-with-marker = 0). Pulled DB URL to scratchpad only, deleted after.

## Verification scorecard (live: https://insightupsolutions.com)

| Req | Check | Result |
|-----|-------|--------|
| PROD-02 | Domain connected + SSL | ✅ apex+www HTTP 200, SSL verify OK |
| PROD-03 | Product pages + images; 17 products incl. NARMA AF100, Zing Z-SCAN | ✅ `/api/products`=17; product JPEG 200 (4.2MB) |
| PROD-04 | Hero video plays | ✅ full 200 + range request 206 (1024B) on `/0925_Trinity_launch__1758826468109.mp4` |
| PROD-05 | Form submissions work | ✅ demo/inquiry(quote)/contact/bundle all HTTP 201 + persisted |
| PROD-06 | SPA routing on refresh | ✅ `/products` deep link → 200 |
| MAIL-02 | Demo booking emails | ✅ Resend `delivered` (customer + admin) |
| MAIL-03 | Quote/inquiry/contact emails | ✅ Resend `delivered` (customer + admin) |
| MAIL-04 | Admin notification emails | ✅ all 4 admin types `delivered` to kaufman@airspaceintegration.com |

Email verification (via Resend API, not just route 201): domain `insightupsolutions.com` is `verified`/sending-enabled. First test batch logged 7/8 sends `delivered`; the missing one ("New Contact Form Submission" admin) was dropped to a Resend rate-limit `429` because the test fired 8 sends in ~3s (Resend default ~2/s) and the route swallows email errors with no retry. An **isolated** contact resubmission delivered BOTH its emails (customer + the contact-admin), proving the path. All 8 distinct email paths confirmed delivered.

## Findings / follow-ups

- **Reliability gap (latent):** every route wraps Resend sends in try/catch that logs-and-swallows with no retry. Under burst/concurrent submissions this silently drops lead notifications (returns 201 regardless). Normal single submissions (2 sends) are within the rate limit, but a retry-with-backoff on 429/5xx would harden the core lead-capture value. Out of Phase 2 scope; candidate for a v1.1 hardening phase.
- **Auto-deploy gap:** push of `feb34ab` to `main` did not trigger a Vercel production deploy (deployed manually). Check GitHub→Vercel production-branch setting.
