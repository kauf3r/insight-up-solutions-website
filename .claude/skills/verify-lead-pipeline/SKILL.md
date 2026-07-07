---
name: verify-lead-pipeline
description: End-to-end verification of the lead-capture pipeline — form/API POST → Neon DB row → Resend confirmation + admin emails — with labeled test leads and zero-residue cleanup. Use after touching forms, routes.ts, resend.ts, shared/schema.ts, or after a deploy, or when Andy reports "I didn't get the email".
---

# Verify the Lead Pipeline

Lead capture is this site's core value (4 form paths, 8 email sends). This is the verification routine used to ship v1.0 (see `docs/handoffs/2026-06-22.md`).

## The four paths

| Form | Endpoint | inquiryType / table | Emails |
|---|---|---|---|
| Contact (`/contact`) | `POST /api/contact` | `general` → `inquiries` | customer + admin |
| Quote (`/quote`) | `POST /api/inquiries` | `quote` → `inquiries` (subject auto-filled) | customer + admin |
| Demo (`/demo`) | `POST /api/demo-bookings` | `demo_bookings` table | customer + admin |
| Bundle (`/trinity-lr1-special`) | `POST /api/bundle-leads` | `bundle_leads` table | customer + admin |

(Offer pages like `/ai-workflow-audit` reuse `POST /api/contact` with their own `inquiryType`.)

Admin emails go to `kaufman@airspaceintegration.com`; customer emails from `info@insightupsolutions.com`.

## Procedure

1. **Label the test lead** so it is findable and deletable — name `TEST DELETE <date>`, email an address Andy controls. NEVER use a fabricated third-party email.

2. **POST each path** (prod example; use `http://localhost:5000` for local):
   ```sh
   curl -sS -X POST https://insightupsolutions.com/api/contact \
     -H 'Content-Type: application/json' \
     -d '{"name":"TEST DELETE 2026-07-07","email":"<andys-address>","subject":"pipeline test","message":"pipeline test","inquiryType":"general"}'
   ```
   Expect `201` with the created row (including `id` — **capture it for cleanup**). A `400` means zod validation failed — check required fields against `shared/schema.ts` insert schemas.

3. **Pace the submissions.** Resend rate-limits at ~2 req/s; each POST fires 2 emails. Burst-testing all 4 paths at once historically dropped an admin email (root cause of the "only 3 admin emails" incident). Wait ~5s between POSTs. `sendEmailWithRetry` (server/lib/resend.ts) now retries 429/5xx, but don't lean on it during verification.

4. **Verify delivery** — email failures are swallowed by design (API returns 201 regardless), so a 201 proves DB write only:
   - Check Vercel function logs for `[RESEND]` (sent) vs `[RESEND ERROR]` lines.
   - Or query the Resend API for `last_event: delivered` on both messages per POST.
   - Confirm with Andy that admin notifications arrived.

5. **Clean up — zero residue.** Delete each test row from prod Neon **by captured ID only** (never by name pattern). There is no delete endpoint; use SQL against the `DATABASE_URL` DB (`inquiries`, `demo_bookings`, `bundle_leads`). Show Andy the exact DELETE + row count before running. Verify with a SELECT afterward.

## Report

Pass/fail table: path × (201, DB row, customer email, admin email, cleaned up). Any swallowed email failure is a FAIL even though the API returned 201.
