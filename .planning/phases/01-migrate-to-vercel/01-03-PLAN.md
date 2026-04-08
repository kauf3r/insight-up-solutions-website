---
phase: 1
plan: deploy
wave: 3
depends_on: [restructure]
files_created:
  - api/index.ts
  - vercel.json
autonomous: false
requirements_addressed: [VRCL-01, VRCL-02, VRCL-03, VRCL-04, VRCL-06, PROD-01]
---

# Plan: Vercel Infrastructure & Deploy

<objective>
Create the Vercel serverless entry point, configure routing/build in vercel.json, set environment variables, and deploy to a working preview URL. This completes Phase 1.
</objective>

## Tasks

<task id="3.1" name="Create api/index.ts serverless entry point">
<read_first>
- server/index.ts (verify it exports `app` directly — routes registered synchronously at import time)
</read_first>
<action>
1. Create `api/` directory at project root
2. Create `api/index.ts`:

```typescript
import type { IncomingMessage, ServerResponse } from "http";
import { app } from "../server/index";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  app(req, res);
}
```

Design notes:
- No `async`, no `await`, no `appReady` — routes are registered synchronously at import time
- Uses Node.js builtins (`IncomingMessage`/`ServerResponse`) instead of `@vercel/node` types — fewer assumptions about Vercel's type extensions, Express expects standard Node.js HTTP types
- `app(req, res)` delegates to Express — Express is a function that accepts (req, res)
- Default export is what Vercel expects for serverless functions
- 4 lines total
</action>
<acceptance_criteria>
- `api/index.ts` exists
- `grep 'export default function handler' api/index.ts` returns a match
- `grep 'app(req, res)' api/index.ts` returns a match
- `grep 'appReady\|async\|await' api/index.ts` returns no results
- `npx tsc --noEmit` passes
</acceptance_criteria>
</task>

<task id="3.2" name="Create vercel.json">
<read_first>
- vite.config.ts (confirm build.outDir is `dist/public`)
- package.json (confirm build script is `vite build`)
</read_first>
<action>
Create `vercel.json` at project root:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": null,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Critical: API rewrite MUST come before SPA catch-all. If reversed, all API calls return index.html.

- `buildCommand`: runs `npm run build` which is `vite build`
- `outputDirectory`: `dist/public` matches vite.config.ts `build.outDir`
- `framework: null`: prevents Vercel from auto-detecting as Next.js
- First rewrite: `/api/*` routes to `api/index.ts` serverless function
- Second rewrite: everything else serves `index.html` for SPA routing
</action>
<acceptance_criteria>
- `vercel.json` exists at project root
- `node -e "const v=require('./vercel.json'); console.log(v.rewrites[0].source)"` outputs `/api/(.*)`
- `node -e "const v=require('./vercel.json'); console.log(v.outputDirectory)"` outputs `dist/public`
- `node -e "const v=require('./vercel.json'); console.log(v.framework)"` outputs `null`
</acceptance_criteria>
</task>

<task id="3.3" name="Set environment variables on Vercel">
<read_first>
- (confirm DATABASE_URL exists in local .env or Neon dashboard)
- (confirm RESEND_API_KEY is obtainable from Resend dashboard)
</read_first>
<action>
Via Vercel dashboard or CLI:
```bash
vercel env add DATABASE_URL production preview development
vercel env add RESEND_API_KEY production preview development
```

Values:
- `DATABASE_URL`: Copy from Neon dashboard (the existing connection string)
- `RESEND_API_KEY`: Obtain from Resend dashboard (Settings > API Keys)

NOTE: This is a manual step — requires the user to provide the actual values.
</action>
<acceptance_criteria>
- `vercel env ls` shows both DATABASE_URL and RESEND_API_KEY
- Both are set for Production and Preview environments
</acceptance_criteria>
</task>

<task id="3.4" name="Deploy to Vercel preview URL">
<read_first>
- (all prior tasks complete)
- vercel.json (confirm exists)
- api/index.ts (confirm exists)
</read_first>
<action>
1. Run `vercel deploy` from project root
2. Note the preview URL
3. Verify against ROADMAP success criteria:
   - Homepage loads with hero video playing
   - Navigate to `/products` — product catalog renders with images
   - Navigate to `/products/trinity-pro` — product detail page loads
   - Submit a demo booking form — expect 201 response
   - Submit a contact form — expect 201 response
   - Check email delivery (confirmation to customer + admin notification)
   - Navigate directly to `/demo` (deep link) — page loads without 404
   - Refresh the page on a deep link — still works (SPA routing)
4. Verify locally: `npm run dev` — starts on port 5000, pages load
</action>
<acceptance_criteria>
- `vercel deploy` exits 0 and outputs a preview URL
- Preview URL homepage returns HTTP 200
- Preview URL `/api/products` returns JSON array
- `npm run dev` starts without errors on port 5000
- `grep -r '@replit\|REPLIT\|replit\.com' --include='*.ts' --include='*.html' --include='*.json' . --exclude-dir=node_modules` returns no results (excluding package-lock.json)
</acceptance_criteria>
</task>

## Verification

```bash
# Serverless entry point exists
test -f api/index.ts && echo "OK"

# vercel.json valid JSON with correct structure
node -e "const v=require('./vercel.json'); console.log('rewrites:', v.rewrites.length, 'output:', v.outputDirectory)"

# Full build succeeds
npm run build

# Type check passes
npx tsc --noEmit

# Deploy
vercel deploy
```

## must_haves

- api/index.ts exports synchronous default handler that delegates to Express app (no async, no appReady)
- vercel.json has API rewrite before SPA catch-all
- vercel.json buildCommand is `npm run build`, outputDirectory is `dist/public`
- DATABASE_URL and RESEND_API_KEY set on Vercel
- Preview URL loads homepage, serves API, handles SPA routing
