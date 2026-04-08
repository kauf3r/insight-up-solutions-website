# Phase 1: Migrate to Vercel - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 01-migrate-to-vercel
**Areas discussed:** Path alias strategy, Server refactor approach, Seed strategy, XSS fix approach

---

## Path Alias Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| esbuild --alias | Use esbuild alias flag to resolve @shared in serverless bundle | |
| Relative imports | Rewrite @shared/schema to ../shared/schema in 3 server files | yes |

**User's choice:** Relative imports (approved recommendation)
**Notes:** Only 3 files use @shared in server code. Relative imports have zero build risk.

---

## Server Refactor Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Separate files | index.ts exports app, dev.ts adds listen/Vite/seed | yes |
| Conditional behavior | Single file with if(NODE_ENV) blocks | |

**User's choice:** Separate files (approved recommendation)
**Notes:** Clean separation, no conditional spaghetti. Research strongly backed this.

---

## Seed Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Remove entirely | Delete seedDatabase() call, keep seed.ts as standalone | yes |
| API endpoint | Create POST /api/seed gated behind admin secret | |

**User's choice:** Remove from auto-run, keep as script (approved recommendation)
**Notes:** DB already populated. Manual script via `npm run seed` for disaster recovery.

---

## XSS Fix Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Shared utility | Create escapeHtml() in server/lib/html.ts | yes |
| Inline escaping | Add escaping directly in each route handler | |

**User's choice:** Shared utility (approved recommendation)
**Notes:** 4 route handlers use unescaped input. Utility prevents recurrence.

---

## Claude's Discretion

- Error handling in serverless entry point
- escapeHtml() implementation details
- @vercel/node types approach
- tsconfig.json include array update

## Deferred Ideas

None — discussion stayed within phase scope.
