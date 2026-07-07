---
name: ship-to-prod
description: Ship a change to insightupsolutions.com — local gates (tsc + vite build, there is no CI), branch + PR, merge on Andy's go, then verify the Vercel auto-deploy actually happened and smoke-check production. Use when asked to ship, deploy, merge, or "get this live", or to diagnose a change that isn't showing on the live site.
---

# Ship to Production

Merging to `main` IS deploying: Vercel auto-deploys production from `main` on `kauf3r/insight-up-solutions-website` (git reconnect verified 2026-06-22 — see `docs/handoffs/2026-06-22-2027.md`). There is no staging and **no CI** — the only PR check is GitGuardian secret scanning.

## 1. Gate locally (nothing else will)

```sh
npm run check && npm run build
```
Show both outputs. If they fail inexplicably: `rm -rf node_modules && npm install` first, debug code second. npm, never pnpm.

## 2. Branch + PR

```sh
git fetch origin
git checkout -b <type>/<slug> origin/main   # off origin/main, not local main
# conventional commit; no test-pass claims in the message
git push -u origin <type>/<slug>
gh pr create --base main --title "<type>: <summary>" --body "..."
```
Never push to `main`. Never mix `docs/business/*-DRAFT.md` or `.planning/` into a code PR. Public copy or pricing in the diff → Andy approves the exact wording before merge.

## 3. Merge (Andy's call)

Squash-merge after Andy's go-ahead. Do NOT use `--auto` (no required checks exist — it merges instantly). Do not merge other open PRs "while you're at it".

## 4. Verify the deploy actually happened

Auto-deploy has silently failed before (production branch was misconfigured as `master`; `feb34ab` once had to be deployed by hand). Trust nothing until you see a git-sourced deployment:

```sh
vercel list insight-up-solutions   # newest deployment should be minutes old
vercel inspect <deployment-url>    # confirm source is git, target production, state READY
```
If no new deployment appears within ~3 minutes, check the Vercel dashboard Git settings (production branch must be `main`), and escalate to Andy before deploying manually with `vercel --prod`.

## 5. Smoke-check production (the v1.0 ship checklist)

- [ ] `https://insightupsolutions.com` loads over SSL; changed page renders
- [ ] Deep-link hard refresh works on a non-root route (e.g. `/products/trinity-pro`) — proves SPA rewrite intact
- [ ] `curl -sS https://insightupsolutions.com/api/products | head -c 200` returns JSON (proves serverless fn + DB)
- [ ] If forms/email were touched: run the `verify-lead-pipeline` skill (labeled test lead, cleanup by ID)
- [ ] Hero video still streams if you touched vercel.json or server/index.ts (range requests, HTTP 206)

Report: PR URL, merge SHA, deployment URL/ID, and the smoke-check table.
