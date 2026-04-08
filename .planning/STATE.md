# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-08)

**Core value:** Site must serve product pages and capture leads with email notifications
**Current focus:** Phase 1 — Migrate to Vercel

## Current Phase

**Phase:** 1 — Migrate to Vercel
**Status:** Not Started
**Goal:** Codebase freed from Replit, deployed to Vercel preview URL with working API, forms, and emails

## Progress

| Phase | Status | Requirements |
|-------|--------|--------------|
| 1 — Migrate to Vercel | Not Started | 18 reqs |
| 2 — Ship to Production | Not Started | 8 reqs |

## Context

- Database: Existing Neon Postgres (no migration needed)
- Domain: insightupsolutions.com (to be connected in Phase 2)
- Email: RESEND_API_KEY needs to be obtained from Resend dashboard
- Vercel account: Exists, ready to connect

## Decisions Log

| Date | Decision | Context |
|------|----------|---------|
| 2026-04-08 | 2 phases (not 3) | v2 hardening items already out of scope; bug fixes folded into Phase 1 |
| 2026-04-08 | Keep existing Neon DB | Real lead data exists, already serverless-compatible |
| 2026-04-08 | Single serverless function wrapping Express | Minimal code change, documented Vercel approach |

---
*Last updated: 2026-04-08 after initialization*
