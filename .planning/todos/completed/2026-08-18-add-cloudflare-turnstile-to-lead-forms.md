---
created: 2026-08-18T18:02:13.083Z
title: Add Cloudflare Turnstile to lead forms
area: api
files:
  - server/lib/spam.ts
  - client/src/lib/spam-guard.tsx
  - server/routes.ts
---

## Problem

A bot wave (started 2026-08-17) flooded all six lead forms with ~210 spam submissions. Each spam POST also fired two Resend emails (email-bomb vector, sender-reputation damage). PR #11 (merged 2026-08-18) shipped a honeypot + time-gate defense that stops the current wave, but it is client-side-observable — a bot author who inspects the form can adapt (fill honeypot correctly, fake `formStartedAt`). Cloudflare Turnstile is the durable layer: server-verified challenge tokens that bots cannot forge.

## Solution

1. **Andy gate (blocker):** create a Cloudflare account + Turnstile widget for insightupsolutions.com → site key (public) + secret key. Add secret to Vercel env (`TURNSTILE_SECRET_KEY`), site key to client build. Note: Turnstile was discussed Dec 2025 with Calfee Design for the ASI WordPress site but was never set up — no existing keys found in any local env or this project's Vercel env, so this starts from scratch.
2. Client: render the Turnstile widget (invisible/managed mode) in `useSpamGuard` so all six forms inherit it; include the token in the POST payload.
3. Server: verify the token against `https://challenges.cloudflare.com/turnstile/v0/siteverify` in `server/lib/spam.ts` before accepting; keep the existing honeypot + time-gate as layer 1 and the fake-201 drop behavior.
4. Keep graceful degradation: if Turnstile is unreachable, fall back to honeypot-only rather than blocking real leads.
