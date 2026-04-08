---
phase: 1
plan: cleanup
wave: 1
depends_on: []
files_modified:
  - vite.config.ts
  - client/index.html
  - package.json
  - server/storage.ts
  - server/routes.ts
  - server/lib/html.ts
  - server/seed.ts
  - .gitignore
files_deleted:
  - .replit
  - replit.md
  - server/db.ts
  - apps/
  - index.html
autonomous: true
requirements_addressed: [REPL-01, REPL-02, REPL-03, REPL-04, REPL-05, FIX-01, FIX-02, VRCL-05]
---

# Plan: Cleanup & Bug Fixes

<objective>
Remove all Replit-specific code, delete dead code, fix critical bugs (WHERE clause and XSS), and rewrite @shared imports to relative paths. Prepares codebase for server restructuring in Wave 2.
</objective>

## Tasks

<task id="1.1" name="Remove Replit Vite plugins">
<read_first>
- vite.config.ts
</read_first>
<action>
1. Delete the import on line 4: `import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";`
2. Delete `runtimeErrorOverlay(),` from the plugins array (line 9)
3. Delete the entire conditional cartographer block (lines 10-17):
```
...(process.env.NODE_ENV !== "production" &&
process.env.REPL_ID !== undefined
  ? [
      await import("@replit/vite-plugin-cartographer").then((m) =>
        m.cartographer(),
      ),
    ]
  : []),
```
4. Resulting plugins array should be: `plugins: [react()],`
</action>
<acceptance_criteria>
- vite.config.ts contains `plugins: [react()]` (or equivalent with only react plugin)
- `grep '@replit' vite.config.ts` returns no results
- `grep 'runtimeErrorOverlay\|cartographer' vite.config.ts` returns no results
</acceptance_criteria>
</task>

<task id="1.2" name="Remove Replit dev banner">
<read_first>
- client/index.html
</read_first>
<action>
Delete these two lines (around lines 20-21):
```html
<!-- This is a replit script which adds a banner on the top of the page when opened in development mode outside the replit environment -->
<script type="text/javascript" src="https://replit.com/public/js/replit-dev-banner.js"></script>
```
</action>
<acceptance_criteria>
- `grep 'replit' client/index.html` returns no results
- `grep 'src="/src/main.tsx"' client/index.html` returns a match (entry point preserved)
</acceptance_criteria>
</task>

<task id="1.3" name="Delete Replit config files">
<read_first>
- (confirm .replit and replit.md exist before deleting)
</read_first>
<action>
```bash
rm .replit replit.md
```
</action>
<acceptance_criteria>
- `.replit` does not exist
- `replit.md` does not exist
</acceptance_criteria>
</task>

<task id="1.4" name="Remove Replit devDeps">
<read_first>
- package.json (devDependencies section)
</read_first>
<action>
1. Remove from devDependencies:
   - `"@replit/vite-plugin-cartographer": "^0.4.1"`
   - `"@replit/vite-plugin-runtime-error-modal": "^0.0.3"`
2. Run `npm install`

Note: `@vercel/node` is NOT needed — api/index.ts uses Node.js builtins (`IncomingMessage`/`ServerResponse`).
</action>
<acceptance_criteria>
- `grep '@replit' package.json` returns no results
- `npm install` exits 0
</acceptance_criteria>
</task>

<task id="1.5" name="Delete dead code">
<read_first>
- (verify server/db.ts is never imported: `grep -r 'server/db\|from.*[./]db' server/`)
- (verify apps/ is stale)
- (verify root index.html is not the SPA entry — SPA is client/index.html)
</read_first>
<action>
```bash
rm server/db.ts
rm -rf apps/
rm index.html
```
</action>
<acceptance_criteria>
- `server/db.ts` does not exist
- `apps/` directory does not exist
- Root `index.html` does not exist
- `client/index.html` still exists
</acceptance_criteria>
</task>

<task id="1.6" name="Fix updateInquiryStatus WHERE clause">
<read_first>
- server/storage.ts (lines 125-148, compare updateDemoBookingStatus with updateInquiryStatus)
</read_first>
<action>
On line 146 of server/storage.ts, change:
```typescript
const result = await db.update(inquiries).set({ status }).where(eq(inquiries.id, status)).returning();
```
to:
```typescript
const result = await db.update(inquiries).set({ status }).where(eq(inquiries.id, id)).returning();
```
The bug: `status` (e.g. "approved") was being used as the ID filter instead of the `id` parameter.
</action>
<acceptance_criteria>
- `grep 'eq(inquiries.id, id)' server/storage.ts` returns a match
- `grep 'eq(inquiries.id, status)' server/storage.ts` returns no results
</acceptance_criteria>
</task>

<task id="1.7" name="Fix XSS in email HTML templates">
<read_first>
- server/routes.ts (all email template blocks — search for `html:` in email send calls)
</read_first>
<action>
1. Create `server/lib/html.ts`:
```typescript
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

2. In `server/routes.ts`, add import at top:
```typescript
import { escapeHtml } from "./lib/html";
```

3. In every email HTML template string in routes.ts, wrap user-input interpolations with `escapeHtml()`:
   - All `${booking.name}`, `${booking.email}`, `${booking.company}`, `${booking.phone}`, `${booking.preferredDate}`, `${booking.message}`
   - All `${inquiry.name}`, `${inquiry.email}`, `${inquiry.company}`, `${inquiry.phone}`, `${inquiry.industry}`, `${inquiry.subject}`, `${inquiry.inquiryType}`, `${inquiry.productId}`, `${inquiry.message}`
   - All `${lead.name}`, `${lead.email}`, `${lead.company}`, `${lead.phone}`, `${lead.interestArea}`
   - For fallback expressions: `${escapeHtml(booking.company || 'Not provided')}`

   Do NOT escape:
   - Console.log messages (not HTML context)
   - `submittedTime` (Date formatting, not user input)
   - Subject lines in email send calls (text context, not HTML)
</action>
<acceptance_criteria>
- `server/lib/html.ts` exists and exports `escapeHtml`
- `grep 'import.*escapeHtml.*from.*html' server/routes.ts` returns a match
- Every `${booking.` inside an html template string in routes.ts is wrapped with `escapeHtml(`
- Every `${inquiry.` inside an html template string in routes.ts is wrapped with `escapeHtml(`
- Every `${lead.` inside an html template string in routes.ts is wrapped with `escapeHtml(`
</acceptance_criteria>
</task>

<task id="1.8" name="Rewrite @shared imports to relative paths">
<read_first>
- server/routes.ts (line 8, the @shared import)
- server/storage.ts (find the @shared import)
- server/seed.ts (find the @shared import)
</read_first>
<action>
In all 3 files, change `from "@shared/schema"` to `from "../shared/schema"`:
1. `server/routes.ts` line 8
2. `server/storage.ts` (near top imports)
3. `server/seed.ts` (near top imports)

The `@shared` alias in tsconfig.json and vite.config.ts stays unchanged — it's still used by client code.
</action>
<acceptance_criteria>
- `grep '@shared' server/routes.ts server/storage.ts server/seed.ts` returns no results
- `grep '../shared/schema' server/routes.ts server/storage.ts server/seed.ts` returns 3 matches
- `grep '@shared' vite.config.ts` still returns a match (client alias preserved)
</acceptance_criteria>
</task>

<task id="1.9" name="Add .vercel to .gitignore">
<read_first>
- .gitignore
</read_first>
<action>
Add `.vercel` on a new line at the end of `.gitignore`.
</action>
<acceptance_criteria>
- `grep '\.vercel' .gitignore` returns a match
</acceptance_criteria>
</task>

## Verification

```bash
# All Replit references gone
grep -r '@replit\|REPLIT\|replit\.com' --include='*.ts' --include='*.html' --include='*.json' . --exclude-dir=node_modules | grep -v 'package-lock'

# Bug fix in place
grep 'eq(inquiries.id, id)' server/storage.ts

# XSS utility exists
test -f server/lib/html.ts && echo "OK"

# Relative imports in server files
grep -c '../shared/schema' server/routes.ts server/storage.ts server/seed.ts

# Type check
npx tsc --noEmit
```

## must_haves

- Zero Replit artifacts in codebase (plugins, banner, config files, devDeps, dead code)
- updateInquiryStatus uses `id` not `status` in WHERE clause
- All user input in email HTML templates escaped via escapeHtml()
- Server files use relative imports for shared schema (no @shared in server/)
