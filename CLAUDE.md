# insight-up-solutions — Operating Manual

Business website for Insight Up Solutions (Andy Kaufman's consulting company): a UAV-systems lead-gen and product-showcase site (Quantum Systems Trinity Pro, payloads, GNSS gear) plus an emerging **AI Workflow Audit** consulting offer (`/ai-workflow-audit`, $1,500 fixed / 1-week — PR #2). Stack: Express 4 + React 18 SPA (Vite 5, wouter, TanStack Query, react-hook-form + zod, Radix/shadcn-style UI, Tailwind 3), Drizzle ORM + Neon Postgres, Resend for email, TypeScript strict, **npm** (package-lock.json). NOT Next.js. Live at **insightupsolutions.com** on Vercel (project `insight-up-solutions`, production branch `main`, auto-deploy via Git — verified reconnected 2026-06-22). GitHub: `kauf3r/insight-up-solutions-website`.

This file is the operating manual. When it conflicts with your defaults, this file wins.

## The Gates (non-negotiable)

1. **After every change:** `npm run check` (tsc over the whole repo) and `npm run build` (vite). Both verified green on main as of 2026-07-07. These are the ONLY automated gates.
2. **There are no tests and no CI workflows.** No test framework in dependencies, no `.github/workflows/`. The only check on PRs is GitGuardian secret scanning. A "green" PR means *no leaked secrets*, nothing more. You and the local gates are the entire safety net.
3. **Never push to `main` directly.** Branch off `origin/main`, PR via `gh pr create`, merge only after Andy's go-ahead. Merging to `main` triggers a production deploy (auto-deploy is live).
4. **The business-content rules below are gates, not suggestions.** Naming a client, publishing pricing, or inventing an impact number is a production incident even if tsc is green.
5. **Real lead data lives in the Neon DB.** Never `npm run db:push` or delete rows without showing Andy the target and getting explicit approval. Test leads must be labeled and deleted by ID afterward (zero residue — precedent: 2026-06-22 handoff).

## Business-Content Rules (highest stakes in this repo)

- **ASI is never named publicly.** AirSpace Integration (the UAS test range client) is anonymized as *"an FAA-designated UAS test range on the California coast"* in all site copy and case-study material until ASI explicitly approves being named. See the gate block at the top of `docs/business/case-study-uas-test-range-DRAFT.md`.
- **Case-study drafts in `docs/business/` never ship with pages.** They carry `DRAFT — DO NOT SEND` gates (Gate 1: Andy approves copy; Gate 2: client approves attribution). Do not import, link, or copy their content into `client/` until both gates clear.
- **Never estimate impact figures.** Numbers marked `[ask Andy]` stay unfilled or get cut. No invented "hours saved" or ROI claims anywhere on the site.
- **Lead-gen CTAs use the contact form.** No calendar/Calendly link exists. Offer pages CTA into a form that POSTs `/api/contact` with a distinguishing `inquiryType` (precedent: `AIWorkflowAuditPage` uses `inquiryType: "ai-workflow-audit"`).
- **Pricing and public-facing copy changes → stop and ask Andy** (see Escalation).

## Architecture Map

| Layer | Where | Notes |
|---|---|---|
| SPA routes | `client/src/App.tsx` | wouter `<Switch>`; 15 routes incl. `/quote`, `/demo`, `/contact`, `/trinity-lr1-special`, `/ai-workflow-audit` (PR #2); fallback → `not-found` |
| Pages | `client/src/pages/` | PascalCase `*Page.tsx`; offer/landing precedents: `TrinityLR1SpecialPage`, `AIWorkflowAuditPage` |
| Nav | `client/src/components/Header.tsx` | nav items array — new pages need an entry here too |
| SEO | `client/src/components/SEO.tsx` | client-side `useEffect` sets title/meta/OG per page — every page renders `<SEO/>` |
| Forms | `client/src/components/{DemoBookingForm,InquiryForm}.tsx` + page-local forms | react-hook-form + `zodResolver`, mutations via `apiRequest` from `client/src/lib/queryClient.ts` |
| Express app | `server/index.ts` | exports `app` (no `.listen`); JSON body parsing, `/api` request logging, 4-arg error handler |
| Local dev entry | `server/dev.ts` | `npm run dev` → tsx, port 5000; **calls `seedDatabase()` on startup** then mounts Vite middleware |
| Vercel entry | `api/index.ts` | thin wrapper: default export delegates to `app`; no seeding in prod |
| API routes | `server/routes.ts` | all endpoints; validation via shared zod insert schemas |
| Storage layer | `server/storage.ts` | `IStorage` interface + `DatabaseStorage` (Drizzle + `@neondatabase/serverless`); routes never call Drizzle directly; reads `DATABASE_URL` |
| Email | `server/lib/resend.ts` | `getResendClient()` (from: `info@insightupsolutions.com`) + `sendEmailWithRetry()` — backoff+jitter on 429/5xx, max 4 attempts, **never throws**, returns boolean |
| XSS escape | `server/lib/html.ts` | `escapeHtml()` — mandatory for every interpolation into email HTML |
| DB schema | `shared/schema.ts` | Drizzle tables (`users`, `products`, `demoBookings`, `inquiries`, `bundleLeads`) + zod insert schemas + types — single source of truth for client AND server |
| Seed data | `server/seed.ts` | 17 products; idempotent by slug (skips existing) but inserts into whatever `DATABASE_URL` points at |
| Deploy config | `vercel.json` | `@vercel/node` build for `api/index.ts` + static build to `dist/public`; rewrites: `/api/(.*)` → serverless fn FIRST, then `/(.*)`→`index.html` (SPA deep links) |
| Path aliases | `tsconfig.json` / `vite.config.ts` | `@/*`→`client/src/`, `@shared/*`→`shared/`, `@assets/*`→`attached_assets/` |
| Design system | `design_guidelines.md` | light-mode, Inter, deep technical blue primary, minimal animation — "clean technical", no marketing hype |

### API surface (verified from `server/routes.ts`)

- `GET/POST /api/products`, `GET /api/products/:id` (tries slug, then UUID), `GET /api/products/category/:category`
- `GET/POST /api/demo-bookings`, `PATCH /api/demo-bookings/:id/status`
- `GET/POST /api/inquiries` (auto-populates `subject` for `inquiryType: 'quote'`), `PATCH /api/inquiries/:id/status`
- `POST /api/contact` — alias for inquiries (same `insertInquirySchema` → `createInquiry`), different email copy
- `POST/GET /api/bundle-leads` (Trinity Pro + LR1 bundle landing page)

Every lead-capture POST sends **two emails** (customer confirmation + admin notification to the hardcoded `kaufman@airspaceintegration.com`), each in its **own try/catch** via `sendEmailWithRetry` — an email failure must never turn the 201 into a 500. Lead capture is the core value of this site; if anything else breaks, forms + emails must still work.

**No auth exists.** All routes are public, including the GET list endpoints that return lead data — a known gap, not a pattern to extend. Do not add new endpoints that expose lead/PII data.

## Mistakes a Weaker Model Will Make Here

1. **Naming the client.** Writes "AirSpace Integration" into site copy or the case study. → Rule: ASI is anonymized as "an FAA-designated UAS test range on the California coast" everywhere public until ASI approves. Both gates in the case-study draft header must clear first.
2. **The invented booking link.** Adds a "Book a call" Calendly/calendar CTA. None exists. → Rule: CTAs submit the contact form (`POST /api/contact`) with a distinguishing `inquiryType`, mirroring `AIWorkflowAuditPage`.
3. **The green-check trust fall.** Sees PR checks pass and assumes tests/build ran. Only GitGuardian runs on PRs. → Rule: run `npm run check && npm run build` locally before every push, no exceptions.
4. **The half-registered page.** Creates `pages/NewPage.tsx` and calls it done. → Rule: a page ships as route in `App.tsx` (wouter, not react-router) + nav entry in `Header.tsx` + `<SEO/>` with real title/description, all in one PR. Verify the deep link survives a hard refresh (the `vercel.json` SPA rewrite handles it — don't reorder the rewrites; `/api` must stay first).
5. **The unescaped email.** Interpolates user input into email HTML directly. This was a real XSS, fixed in `0332171`. → Rule: every `${...}` inside email HTML goes through `escapeHtml()` from `server/lib/html.ts`.
6. **The throwing email path.** Lets a Resend failure propagate and fail the API response, or calls `client.emails.send` bare. → Rule: emails go through `sendEmailWithRetry` inside their own try/catch; the lead is already in the DB — always return 201.
7. **The inquiryType enum assumption.** Treats `inquiryType` as a checked enum. It's a plain `text` column; values in the wild: `general`, `quote`, `demo`, `product`, `custom`, `ai-workflow-audit`. → Rule: grep `client/src` for existing `inquiryType:` values before adding one; pick a distinct slug so admin-email triage works.
8. **The casual db:push.** Runs `npm run db:push` (drizzle-kit push, no migration files exist) against prod Neon, where real lead data lives. → Rule: show Andy the target `DATABASE_URL` host and get approval first. Same for any row deletion.
9. **The dev-server seed surprise.** Runs `npm run dev` with prod credentials in `.env` — `server/dev.ts` calls `seedDatabase()` on startup. It's idempotent by slug, but it will insert any missing seed products into that DB. → Rule: know which DB `.env` points at before starting dev.
10. **The Next.js reflex.** Reaches for `app/` routing, server components, `next/image`, API route files. → Rule: this is an Express + Vite SPA. Server code lives in `server/`, one serverless entry at `api/index.ts`, client routing is wouter.
11. **The fabricated metric.** Fills a `[ask Andy]` placeholder with a plausible number to make copy flow. → Rule: real data from Andy or cut the line. Never estimate impact figures.
12. **The single-spot admin-email fix.** Changes the admin notification address in one route. It's hardcoded in 4 handlers in `server/routes.ts`. → Rule: when changing any repeated value (admin email, phone `+1 (831) 888-7172`, `info@insightupsolutions.com`), grep the whole repo and fix every instance.
13. **The attached_assets excavation.** Treats `attached_assets/` (screenshots, pasted PRDs, promo PDFs) as authoritative docs. It's a Replit-era junk drawer that images are served from via `@assets`. → Rule: business truth lives in `docs/business/` and Andy; don't cite or "clean up" `attached_assets` without asking.
14. **The npm/pnpm mixup.** Runs `pnpm install` (Andy's other repos use pnpm). This repo is npm with `package-lock.json`. → Rule: npm only; don't introduce a second lockfile.

## Quality Bar Per Deliverable

**Any code change:**
- [ ] `npm run check` and `npm run build` output shown, both clean
- [ ] No new `any` or `@ts-expect-error` without a one-line justification
- [ ] Matches the nearest neighbor's idiom (read a sibling page/route first)

**New or changed page:**
- [ ] Route in `App.tsx` + nav in `Header.tsx` + `<SEO/>` with unique title/description
- [ ] Uses existing UI primitives (`client/src/components/ui/`), Tailwind spacing units 2/4/6/8/12/16, light-mode palette per `design_guidelines.md`
- [ ] Any form posts to an existing endpoint with a distinct `inquiryType`; success/error toasts wired via the mutation pattern (copy `ContactPage`)
- [ ] Business-content rules checked: no client names, no invented numbers, no calendar links, CTA → contact form

**Copy change (public-facing):**
- [ ] Andy approved the exact wording before merge (pricing, claims, client references — always; minor typo fixes — use judgment, say what changed)
- [ ] ASI anonymization intact; no `[ask Andy]` placeholder shipped

**API/email change:**
- [ ] Zod validation via shared schema; 400 invalid input, 404 not-found, 500 generic — match neighbors
- [ ] All email HTML interpolations escaped; sends via `sendEmailWithRetry` in isolated try/catch; 201 returned even if email fails
- [ ] Both email paths (customer + admin) updated together; exercised at least once with output shown (labeled test lead, then deleted by ID)

**Schema change:**
- [ ] `shared/schema.ts` updated (tables + insert schema + types together); every consumer grepped (`routes.ts`, `storage.ts`, forms)
- [ ] `db:push` target shown to Andy before running; existing lead data preserved

**PR:**
- [ ] Branch cut from `origin/main`; conventional commit messages
- [ ] `docs/business/` drafts and `.planning/` never mixed into code PRs
- [ ] Merge = production deploy; after merge, confirm a `src=git` deployment appears (`vercel list`) and spot-check the live page

## When Uncertain — Escalation Rules

**Resolve yourself, in order:**
1. Nearest precedent in the repo — grep for the most recently shipped similar thing (`AIWorkflowAuditPage` for offer pages, `ContactPage` for forms, `routes.ts` handlers for endpoints) and copy its shape
2. `docs/handoffs/` (most recent first) — session decisions and verified deploy/DB facts live here
3. `.planning/STATE.md` + `docs/business/` for milestone context and business framing
4. `design_guidelines.md` for visual decisions

**Stop and ask Andy (one concise question with your recommended default):**
- Any public-facing copy or pricing change — the site IS the business
- Naming any client, publishing a case study, or filling an impact figure
- Anything touching production DB rows (`db:push`, deletes, backfills)
- Merging to `main` (it deploys), and anything about PR #2 (`feat/ai-workflow-audit-offer`) — that branch is Andy's to merge
- Adding auth, rate limiting, or security headers (known v2 backlog — don't freelance it)

**Failure protocol:** if `check`/`build` fail inexplicably, `rm -rf node_modules && npm install` before debugging code. If still red after 2 focused attempts, stop and report the exact output — never ship around a red gate.

## Environment Notes

- Required env: `DATABASE_URL` (Neon, throws at `drizzle.config.ts`/`storage.ts` without it), `RESEND_API_KEY` (email sends fail without it — API still returns 201). `.env` is not versioned; `.env.local` holds Vercel OIDC only.
- Local dev: `npm run dev` → port 5000 (seeds DB on start — see Mistake 9). Prod deploys build `dist/public` + one serverless function.
- Resend domain `insightupsolutions.com` is verified/sending-enabled. Known limit: ~2 req/s — burst form submissions can rate-limit; `sendEmailWithRetry` exists precisely because a swallowed 429 once dropped an admin notification.
- Admin notifications go to `kaufman@airspaceintegration.com` (Andy's ASI work address, hardcoded ×4 in `routes.ts`).
- Repo lives at `~/Desktop/Projects/insight-up-solutions` (iCloud root — slated to migrate to `~/dev`).

## Knowledge (AndyOS KB)

Andy's cross-business knowledge base (~4,800 pages: land investing, UAS/ASI, AI tooling, clients, content, personal ops) lives at `~/dev/claude-life-os/LLM-context/` and is queryable from this repo via the `claude-life-os-kb` MCP server (registered in `.mcp.json`).

- Before work touching Andy's businesses, clients, positioning, or past decisions, check the KB: `kb_search` (free keyword search), `kb_lookup` (free page fetch), `kb_query` (paid synthesized answer with `[[source:...]]` citations), `kb_status` (index health).
- Ground business-context claims in KB pages; keep the citations. Public-facing copy still goes through Andy (see escalation rules) — the KB informs drafts, it doesn't approve them.
- The KB is read-only from this repo — never write into `claude-life-os/LLM-context/`. New knowledge enters through the claude-life-os ingest pipeline.
