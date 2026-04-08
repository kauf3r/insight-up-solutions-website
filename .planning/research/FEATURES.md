# Feature Landscape: Vercel Deployment for Insight Up Solutions

**Domain:** Fullstack Express-to-Vercel Migration (E-commerce / Lead Generation Site)
**Researched:** 2026-04-07

## Table Stakes

Features that are mandatory -- without these, the deployment either fails or the site breaks in production.

| Feature | Why Required | Complexity | Notes |
|---------|-------------|------------|-------|
| **vercel.json routing config** | Without SPA fallback rewrites, all deep links (e.g. `/products/trinity-pro`) return 404 | Low | Must route `/api/*` to serverless function AND everything else to `/index.html` |
| **API serverless function** | Express routes must run server-side; Vercel has no long-running Node process | Medium | Single `api/index.ts` file wrapping Express app. Must export default handler, not `app.listen()` |
| **SPA catch-all rewrite** | Client-side Wouter routing requires all non-API, non-static requests serve `index.html` | Low | `"rewrites": [{"source": "/((?!api/).*)", "destination": "/index.html"}]` in vercel.json |
| **Environment variables** | `DATABASE_URL` and `RESEND_API_KEY` are secrets required at runtime; site is dead without them | Low | Set via Vercel dashboard Project Settings, scoped to Production environment |
| **Resend API key (direct)** | Current Replit Connector auth pattern won't work on Vercel; must use `RESEND_API_KEY` env var directly | Medium | Replace `getUncachableResendClient()` Replit connector logic with `new Resend(process.env.RESEND_API_KEY)` |
| **Remove Replit plugins** | Vite config references `@replit/vite-plugin-*` -- these will fail on Vercel build | Low | Remove from `vite.config.ts` and `client/index.html` script tags |
| **Vite build output** | Vercel must know where static assets live after build | Low | Vercel auto-detects Vite; output at `dist/` by default. Confirm `outputDirectory` in vercel.json if needed |
| **Path alias resolution** | `@shared/*` and `@/*` aliases must resolve in both Vite (client build) and esbuild (serverless function bundle) | Medium | Vite handles client aliases via `vite.config.ts`. Serverless function needs `tsconfig-paths` or esbuild alias config |
| **Custom domain (insightupsolutions.com)** | Site must be accessible at its real domain, not a `.vercel.app` URL | Low | Add domain in Vercel dashboard, configure DNS (A record for apex, CNAME for www). SSL auto-provisioned via Let's Encrypt |
| **Static asset serving (video + images)** | Hero video (~1.7MB) and product images must load; they're core to the product showcase | Low | Files in `dist/public/` are served via Vercel CDN automatically. No serverless function involvement |
| **Database connection (Neon)** | All product data and lead submissions live in Neon Postgres | Low | `@neondatabase/serverless` HTTP driver already used -- this is serverless-compatible out of the box. No connection pooling changes needed for HTTP mode |
| **Build command configuration** | Vercel needs to know how to build the project | Low | Set build command to `npm run build` (Vite frontend + esbuild backend). Framework detection should handle this |

## Differentiators

Features that improve production quality. Not required for launch, but elevate reliability and operations.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Security headers** | Prevent XSS, clickjacking, MIME sniffing. Professional security posture | Low | Add `headers` array in vercel.json: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` |
| **Content Security Policy** | Blocks unauthorized script injection; critical for a site with form inputs | Medium | Start with `Content-Security-Policy-Report-Only` to audit, then enforce. Must whitelist self, fonts, Resend, any CDN origins |
| **Preview deployments** | Every git push creates a preview URL; catch issues before production | Low | Enabled by default on Vercel. Connect GitHub repo and it just works |
| **Environment variable scoping** | Different `DATABASE_URL` for preview vs production prevents accidental data corruption | Low | Scope `DATABASE_URL` and `RESEND_API_KEY` to Production only. Use test values for Preview if desired |
| **Deployment protection (preview)** | Prevent public access to preview URLs that might expose WIP features | Low | Vercel Authentication enabled by default for preview deployments on all plans |
| **Error monitoring integration** | Console.log works but you won't know about errors until a customer complains | Medium | Vercel has built-in Runtime Logs (free tier, 1-hour retention). Sufficient for launch; add Sentry/Axiom later if needed |
| **Cache-Control headers for static assets** | Reduce bandwidth, improve load times for returning visitors | Low | Vercel CDN handles this well by default for static assets. Add explicit headers for API responses if needed (`Cache-Control: no-store` for form endpoints) |
| **www-to-apex redirect** | Users typing `www.insightupsolutions.com` should reach the site | Low | Configure both apex and www domain in Vercel; set one as redirect target |
| **Favicon and meta tags** | Professional appearance in browser tabs and social sharing | Low | Likely already exists. Verify `<link rel="icon">` and OG meta tags survive the build |
| **Rate limiting on form endpoints** | Prevent spam/abuse on demo booking, inquiry, and contact forms | Medium | Vercel WAF has rate limiting on Pro plan. For Hobby plan, implement simple in-memory rate limiting in the Express handler or use Vercel Edge Middleware |
| **Video streaming replacement** | Current Express-based range request handler (`*.mp4` route) won't exist on Vercel | Low | Not needed -- Vercel CDN natively supports range requests for static files. The custom Express video handler becomes unnecessary |
| **Git integration (GitHub)** | Auto-deploy on push, PR preview deployments, rollback capability | Low | Connect repo in Vercel dashboard. One-time setup |
| **Local development parity** | Developers must be able to run the app locally after migration | Medium | Need a new dev entry point that runs Express with Vite middleware (similar to current setup but without Replit deps). `vercel dev` CLI also available but less reliable |

## Anti-Features

Features to explicitly NOT build or configure during this migration. Doing these now adds complexity without value.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Splitting Express into individual serverless functions** | The codebase has a monolithic Express router; splitting would require rewriting every route. Single-function pattern is the documented approach for Express migrations | Keep single `api/index.ts` wrapping the full Express app. Revisit only if cold starts become a measurable problem |
| **Edge Functions / Edge Middleware** | No performance requirement justifies edge deployment. Express is Node.js-only and can't run on Edge runtime | Stay with standard Node.js serverless functions. Edge adds constraints (no Node APIs) for no benefit here |
| **Vercel Blob storage for video** | The hero video is ~1.7MB -- tiny by video standards. Public directory CDN serving is free and sufficient | Keep video in `dist/public/`. Only consider Blob if video library grows significantly |
| **Stripe integration** | Dependencies exist but no routes are implemented. Migration scope should not include new features | Leave Stripe packages in `package.json` but don't create endpoints. Address in a future milestone |
| **Authentication system activation** | Passport.js is configured but unused. Activating auth during migration adds risk | Leave auth code dormant. If admin panel is needed later, that's a separate feature |
| **Database migration/changes** | Neon DB has real lead data. Schema changes risk data loss during a platform migration | Keep existing schema and data untouched. `db:push` only if schema matches current state exactly |
| **Custom 404/500 error pages** | Nice but not required for launch. Default Vercel error pages are acceptable | Defer to post-migration polish. SPA catch-all handles most 404 cases client-side anyway |
| **CI/CD pipeline (GitHub Actions)** | Vercel's built-in git integration handles build/deploy. Adding GH Actions is redundant for this project's scale | Use Vercel's native git deployment. Add GH Actions only if you need pre-deploy checks (tests, linting) |
| **Structured logging / Log Drains** | Console.log with tagged prefixes already works. Log Drains require Pro plan and add cost | Keep current logging. Vercel Runtime Logs provide 1-hour visibility for free. Upgrade only if operational issues arise |
| **ISR / SSR / Server Components** | This is a Vite SPA with client-side rendering. Introducing server rendering would require a fundamental architecture change | Keep as static SPA + API. No Next.js migration needed |
| **CDN cache invalidation strategy** | Static assets get cache-busted via Vite's content hashing. API responses shouldn't be cached | Vite's default `[name].[hash].js` output handles this automatically |
| **Multi-region serverless** | Single-region is fine for a US-focused UAV equipment company | Deploy to default region (iad1 / US East). Neon DB is likely in the same region |

## Feature Dependencies

```
Remove Replit plugins ──┐
                        ├──→ Vite build succeeds ──→ Static assets on CDN
Path alias resolution ──┘

Environment variables set ──┐
                            ├──→ API serverless function works
Resend API key (direct) ────┤
                            ├──→ Form submissions + emails work
Database connection ────────┘

vercel.json routing ──┬──→ SPA catch-all works (client navigation)
                      └──→ API routes accessible (/api/*)

Vite build succeeds ──┬──→ Custom domain can serve the site
API function works ───┘

Custom domain ──→ DNS propagation ──→ SSL auto-provisioned ──→ Site live at insightupsolutions.com
```

## Critical Path (ordered)

These must happen in sequence. Each step unlocks the next:

1. **Remove Replit dependencies** (plugins, connector auth) -- unblocks clean build
2. **Replace Resend connector with direct API key** -- unblocks email functionality
3. **Create `api/index.ts` serverless wrapper** -- unblocks API on Vercel
4. **Configure `vercel.json`** (rewrites, routing) -- unblocks SPA navigation + API routing
5. **Set environment variables in Vercel dashboard** -- unblocks runtime secrets
6. **Deploy and verify** -- validates everything works together
7. **Connect custom domain** -- makes it live at insightupsolutions.com

## MVP Recommendation

**Must ship (table stakes):**
1. vercel.json with SPA rewrite + API routing
2. `api/index.ts` Express wrapper (serverless function)
3. Resend direct API key replacement
4. Replit plugin removal from Vite config
5. Environment variables configured in Vercel
6. Custom domain connected
7. Path alias resolution verified in serverless bundle

**Ship with MVP if time allows (differentiators):**
1. Security headers in vercel.json (15 minutes of work, significant security improvement)
2. www-to-apex redirect (5 minutes in Vercel dashboard)
3. Git integration with GitHub (one-time 5-minute setup)

**Defer everything else.** The anti-features list is long because migration scope must be narrow -- change the platform, not the product.

## Vercel Plan Considerations

| Feature | Hobby (Free) | Pro ($20/mo) | Notes |
|---------|-------------|-------------|-------|
| Serverless function timeout | 10s | 60s | Form submissions + email should complete in <5s. Hobby is sufficient |
| Bandwidth | 100 GB/mo | 1 TB/mo | ~1.7MB video + product images. Hobby is sufficient unless traffic is high |
| Builds | 6,000 min/mo | 24,000 min/mo | Single-page builds are fast. Hobby is sufficient |
| Deployment protection | Preview only | All deployments | Hobby covers the need |
| Custom domains | Unlimited | Unlimited | No difference |
| Serverless function size | 250 MB uncompressed | 250 MB uncompressed | Express app will be well under this |
| Runtime logs | 1 hour retention | 1 hour (14 days with Plus) | Hobby sufficient for launch |
| Payload size | 4.5 MB | 4.5 MB | Form data is tiny. Not a concern |

**Recommendation:** Start on Hobby plan. Nothing in this migration requires Pro. Upgrade later if traffic demands it or if WAF/rate limiting becomes necessary.

## Sources

- [Vercel Express.js Guide](https://vercel.com/docs/frameworks/backend/express) -- HIGH confidence
- [Vercel vercel.json Configuration](https://vercel.com/docs/project-configuration/vercel-json) -- HIGH confidence
- [Vercel Rewrites](https://vercel.com/docs/rewrites) -- HIGH confidence
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables) -- HIGH confidence
- [Vercel Custom Domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain) -- HIGH confidence
- [Vercel Function Limits](https://vercel.com/docs/functions/limitations) -- HIGH confidence
- [Vercel Production Checklist](https://vercel.com/docs/production-checklist) -- HIGH confidence
- [Vercel Security Headers](https://vercel.com/docs/edge-network/security-headers) -- HIGH confidence
- [Vercel Vite Framework Guide](https://vercel.com/docs/frameworks/frontend/vite) -- HIGH confidence
- [Resend + Vercel Functions](https://resend.com/docs/send-with-vercel-functions) -- HIGH confidence
- [Neon + Vercel Connection Methods](https://neon.com/docs/guides/vercel-connection-methods) -- HIGH confidence
- [Vercel SPA Fallback Discussion](https://github.com/vercel/vercel/discussions/5448) -- MEDIUM confidence
- [Vercel Limits](https://vercel.com/docs/limits) -- HIGH confidence
