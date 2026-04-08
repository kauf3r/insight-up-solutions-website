# Requirements: Insight Up Solutions — Vercel Migration

**Defined:** 2026-04-08
**Core Value:** Site must serve product pages and capture leads (demo bookings, quotes, contact forms) with email notifications to both customer and admin.

## v1 Requirements

### Replit Removal

- [x] **REPL-01**: Replit Vite plugins removed from vite.config.ts (runtime-error-modal, cartographer)
- [x] **REPL-02**: Replit dev banner script removed from client/index.html
- [x] **REPL-03**: .replit and replit.md files deleted
- [x] **REPL-04**: Replit devDependencies removed from package.json
- [x] **REPL-05**: Dead code removed (server/db.ts — unused WebSocket driver, apps/ — stale Next.js artifact)

### Vercel Infrastructure

- [ ] **VRCL-01**: Serverless entry point created (api/index.ts) exporting Express app
- [ ] **VRCL-02**: vercel.json configured with API rewrite (/api/* -> serverless function)
- [ ] **VRCL-03**: vercel.json configured with SPA catch-all rewrite for client-side routing
- [ ] **VRCL-04**: Build command produces correct Vite output in dist/public/
- [x] **VRCL-05**: Path alias @shared resolves in serverless function bundle (esbuild --alias or relative imports)
- [ ] **VRCL-06**: Environment variables set on Vercel (DATABASE_URL, RESEND_API_KEY)
- [ ] **VRCL-07**: Video streaming Express middleware removed (Vercel CDN handles range requests natively)

### Email Integration

- [ ] **MAIL-01**: Resend connector rewritten to use RESEND_API_KEY env var directly (no Replit connector)
- [ ] **MAIL-02**: Demo booking confirmation emails work on Vercel
- [ ] **MAIL-03**: Quote/inquiry confirmation emails work on Vercel
- [ ] **MAIL-04**: Admin notification emails delivered on Vercel

### Critical Bug Fixes

- [x] **FIX-01**: updateInquiryStatus WHERE clause fixed (uses id instead of status)
- [x] **FIX-02**: XSS vulnerability fixed — user input escaped in email HTML templates

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
| REPL-01 | Phase 1 | Complete |
| REPL-02 | Phase 1 | Complete |
| REPL-03 | Phase 1 | Complete |
| REPL-04 | Phase 1 | Complete |
| REPL-05 | Phase 1 | Complete |
| VRCL-01 | Phase 1 | Pending |
| VRCL-02 | Phase 1 | Pending |
| VRCL-03 | Phase 1 | Pending |
| VRCL-04 | Phase 1 | Pending |
| VRCL-05 | Phase 1 | Complete |
| VRCL-06 | Phase 1 | Pending |
| VRCL-07 | Phase 1 | Pending |
| MAIL-01 | Phase 1 | Pending |
| MAIL-02 | Phase 2 | Pending |
| MAIL-03 | Phase 2 | Pending |
| MAIL-04 | Phase 2 | Pending |
| FIX-01 | Phase 1 | Complete |
| FIX-02 | Phase 1 | Complete |
| DEV-01 | Phase 1 | Pending |
| DEV-02 | Phase 1 | Pending |
| PROD-01 | Phase 1 | Pending |
| PROD-02 | Phase 2 | Pending |
| PROD-03 | Phase 2 | Pending |
| PROD-04 | Phase 2 | Pending |
| PROD-05 | Phase 2 | Pending |
| PROD-06 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-08 after roadmap creation*
