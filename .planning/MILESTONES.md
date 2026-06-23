# Milestones

## v1.0 Vercel Migration (Shipped: 2026-06-22)

**Scope:** Phases 1–2 · 4 plans · all 26 v1 requirements complete
**Live:** https://insightupsolutions.com (Vercel prod, SSL)

**Key accomplishments:**

- Migrated the Express API + Vite React SPA off Replit to Vercel (single serverless function wrapping Express + static build; Replit plugins/banner/configs removed).
- Rewrote the Resend email integration to use `RESEND_API_KEY` directly (no Replit connector) and added a dedicated local dev entry point (`server/dev.ts`).
- Fixed two critical bugs while in-flight: `updateInquiryStatus` WHERE clause (was filtering on `status` instead of `id`) and an XSS hole in email HTML templates (unescaped user input).
- Configured Vercel routing (`/api/*` rewrite + SPA catch-all) and production env (`DATABASE_URL`, `RESEND_API_KEY`); connected the `insightupsolutions.com` domain with SSL.
- Shipped to production and verified all 8 Phase-2 requirements end-to-end on the live domain: 17 products + images, hero video (HTTP range/206), all 4 lead forms, SPA deep-link refresh, and all customer + admin email flows confirmed `delivered` via the Resend API.

**Known follow-ups (not blocking):**

- Resend sends in `server/routes.ts` are logged-and-swallowed with no retry → a burst can silently drop a lead notification (observed once under an 8-sends-in-3s test). Candidate v1.1 hardening: retry-with-backoff on 429/5xx.
- Push to `main` did not auto-deploy (deployed manually via `vercel --prod`); check the Vercel Git production-branch setting.

---
