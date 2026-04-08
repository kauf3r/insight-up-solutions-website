# Requirements: Insight Up Solutions — Vercel Migration

**Defined:** 2026-04-08
**Core Value:** Site must serve product pages and capture leads (demo bookings, quotes, contact forms) with email notifications to both customer and admin.

## v1 Requirements

### Replit Removal

- [ ] **REPL-01**: Replit Vite plugins removed from vite.config.ts (runtime-error-modal, cartographer)
- [ ] **REPL-02**: Replit dev banner script removed from client/index.html
- [ ] **REPL-03**: .replit and replit.md files deleted
- [ ] **REPL-04**: Replit devDependencies removed from package.json
- [ ] **REPL-05**: Dead code removed (server/db.ts — unused WebSocket driver, apps/ — stale Next.js artifact)

### Vercel Infrastructure

- [ ] **VRCL-01**: Serverless entry point created (api/index.ts) exporting Express app
- [ ] **VRCL-02**: vercel.json configured with API rewrite (/api/* -> serverless function)
- [ ] **VRCL-03**: vercel.json configured with SPA catch-all rewrite for client-side routing
- [ ] **VRCL-04**: Build command produces correct Vite output in dist/public/
- [ ] **VRCL-05**: Path alias @shared resolves in serverless function bundle (esbuild --alias or relative imports)
- [ ] **VRCL-06**: Environment variables set on Vercel (DATABASE_URL, RESEND_API_KEY)
- [ ] **VRCL-07**: Video streaming Express middleware removed (Vercel CDN handles range requests natively)

### Email Integration

- [ ] **MAIL-01**: Resend connector rewritten to use RESEND_API_KEY env var directly (no Replit connector)
- [ ] **MAIL-02**: Demo booking confirmation emails work on Vercel
- [ ] **MAIL-03**: Quote/inquiry confirmation emails work on Vercel
- [ ] **MAIL-04**: Admin notification emails delivered on Vercel

### Critical Bug Fixes

- [ ] **FIX-01**: updateInquiryStatus WHERE clause fixed (uses id instead of status)
- [ ] **FIX-02**: XSS vulnerability fixed — user input escaped in email HTML templates

### Local Development

- [ ] **DEV-01**: Local dev entry point created (server/dev.ts) that runs Express with Vite middleware
- [ ] **DEV-02**: npm run dev works after migration

### Production Deployment

- [ ] **PROD-01**: Site deployed to Vercel with working preview URL
- [ ] **PROD-02**: insightupsolutions.com domain connected to Vercel
- [ ] **PROD-03**: All product pages load with images
- [ ] **PROD-04**: Hero video plays on homepage
- [ ] **PROD-05**: All form submissions work (demo booking, quote, contact, bundle lead)
- [ ] **PROD-06**: SPA routing works on page refresh (deep links don't 404)

## v2 Requirements

### Production Hardening

- **HARD-01**: Security headers configured in vercel.json (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- **HARD-02**: www-to-apex redirect configured
- **HARD-03**: Content Security Policy added
- **HARD-04**: Rate limiting on form endpoints

### Code Quality

- **QUAL-01**: Email templates extracted from inline HTML into shared module
- **QUAL-02**: Hardcoded admin email moved to ADMIN_EMAIL env var
- **QUAL-03**: Structured logging replaces console.log
- **QUAL-04**: InquiryForm.tsx simulated API call replaced with real submission

## Out of Scope

| Feature | Reason |
|---------|--------|
| Split Express into individual serverless functions | Single-function wrapping is documented approach; splitting requires rewriting every route |
| Edge Functions / Edge Middleware | No performance requirement; Express is Node.js-only |
| Stripe integration | Dependencies exist but no routes; defer to future feature work |
| Authentication system activation | Passport.js configured but unused; adds risk during migration |
| Database schema changes | Real lead data exists; no schema changes during platform migration |
| SSR / ISR / Server Components | This is a Vite SPA; introducing server rendering is an architecture change |
| Test framework setup | No tests exist; defer to post-migration |
| CI/CD pipeline (GitHub Actions) | Vercel's native git deployment is sufficient |
| Custom 404/500 error pages | Default Vercel pages acceptable for launch |
| Vercel Blob storage for video | 1.7MB video works fine from public dir CDN |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| REPL-01 | — | Pending |
| REPL-02 | — | Pending |
| REPL-03 | — | Pending |
| REPL-04 | — | Pending |
| REPL-05 | — | Pending |
| VRCL-01 | — | Pending |
| VRCL-02 | — | Pending |
| VRCL-03 | — | Pending |
| VRCL-04 | — | Pending |
| VRCL-05 | — | Pending |
| VRCL-06 | — | Pending |
| VRCL-07 | — | Pending |
| MAIL-01 | — | Pending |
| MAIL-02 | — | Pending |
| MAIL-03 | — | Pending |
| MAIL-04 | — | Pending |
| FIX-01 | — | Pending |
| FIX-02 | — | Pending |
| DEV-01 | — | Pending |
| DEV-02 | — | Pending |
| PROD-01 | — | Pending |
| PROD-02 | — | Pending |
| PROD-03 | — | Pending |
| PROD-04 | — | Pending |
| PROD-05 | — | Pending |
| PROD-06 | — | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 0
- Unmapped: 26

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-08 after initial definition*
