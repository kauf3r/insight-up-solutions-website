---
name: add-offer-page
description: Add a new offer/landing page to insightupsolutions.com — page component, wouter route, Header nav, SEO, and a lead form wired to /api/contact with a distinct inquiryType. Use when Andy wants a new service offer, product special, or campaign landing page. Encodes the business-content gates (client anonymization, no invented metrics, contact-form CTAs).
---

# Add an Offer / Landing Page

The repo's proven pattern for pages that sell something and capture leads. Precedents: `client/src/pages/AIWorkflowAuditPage.tsx` (consulting offer, form → `/api/contact`) and `client/src/pages/TrinityLR1SpecialPage.tsx` (product bundle, form → `/api/bundle-leads`).

## Before writing anything

1. Read the closest precedent page in full — copy its shape, not your instincts.
2. Get from Andy (or the task): offer name, price (if public), the URL slug, and the CTA promise ("we'll respond within 24 hours" is the house standard).
3. **Business-content gates (blocking):**
   - Client names: ASI/AirSpace Integration is NEVER named — anonymize as "an FAA-designated UAS test range on the California coast". Same discipline for any future client.
   - No invented metrics. If a number isn't from Andy, it doesn't ship.
   - No calendar/booking links — none exist. CTA is the on-page form.
   - Pricing shown publicly → Andy approves the exact copy before merge.
4. Content from `docs/business/*-DRAFT.md` is gated (Andy + client approval headers) — do not lift copy from drafts into the page.

## The registration choreography (all in one PR)

1. **Page:** `client/src/pages/<Name>Page.tsx` — default export, PascalCase. Render `<SEO title="..." description="..."/>` (from `@/components/SEO`) at the top with a unique title/description. Use `Header`/`Footer`, existing `@/components/ui/*` primitives, Tailwind spacing 2/4/6/8/12/16, light-mode palette per `design_guidelines.md` (deep technical blue primary, no marketing hype, minimal animation).
2. **Route:** `client/src/App.tsx` — import + `<Route path="/<slug>" component={<Name>Page} />` above the 404 fallback. Router is **wouter**, not react-router.
3. **Nav:** `client/src/components/Header.tsx` — add to the nav items array (short label, e.g. `{ label: "AI Audit", href: "/ai-workflow-audit" }`).
4. **Lead form:** react-hook-form + `zodResolver`, mutation via `apiRequest` from `@/lib/queryClient`:
   ```tsx
   return await apiRequest("POST", "/api/contact", {
     ...values,
     subject: "<Offer name> inquiry",
     inquiryType: "<distinct-slug>",   // grep client/src for existing values first:
   });                                  // general, quote, demo, product, custom, ai-workflow-audit
   ```
   `inquiryType` is a free-text column, not an enum — a distinct slug is how Andy triages the admin email. Required fields per `insertInquirySchema` (shared/schema.ts): `name`, `email`, `subject`, `message`, `inquiryType`.
   Success/error toasts: copy the mutation `onSuccess`/`onError` pattern from `client/src/pages/ContactPage.tsx`.
5. **No server changes needed** for a standard offer page — `/api/contact` already stores the inquiry and sends both emails. Only touch `server/routes.ts` if the offer needs its own table (then see the schema-change bar in CLAUDE.md).

## Verify

```sh
npm run check && npm run build
```
Both must be clean. Then confirm:
- [ ] Route renders and deep-link works (SPA rewrite in `vercel.json` handles refresh — do not reorder rewrites)
- [ ] Form submit path exercised once (labeled test lead, e.g. name "TEST — delete me"), then the row deleted by ID — zero residue in prod Neon
- [ ] Business-content gates re-checked against the final copy
- [ ] PR from a branch off `origin/main`; Andy approves public copy/pricing before merge (merge = production deploy)
