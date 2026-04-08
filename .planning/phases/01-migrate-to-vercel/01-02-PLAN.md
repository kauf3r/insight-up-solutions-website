---
phase: 1
plan: restructure
wave: 2
depends_on: [cleanup]
files_modified:
  - server/lib/resend.ts
  - server/routes.ts
  - server/index.ts
  - package.json
  - tsconfig.json
files_created:
  - server/dev.ts
autonomous: true
requirements_addressed: [MAIL-01, VRCL-07, DEV-01, DEV-02]
---

# Plan: Server Restructure & Email Rewrite

<objective>
Rewrite the Resend connector for direct API key usage, restructure server/index.ts into a serverless-compatible export, create a local dev entry point, and update build scripts. After this plan, the Express app is importable by the Vercel serverless function.
</objective>

## Tasks

<task id="2.1" name="Rewrite resend.ts for direct API key">
<read_first>
- server/lib/resend.ts (current Replit connector — full file)
- server/routes.ts (lines 9-10, line 77 — verify call pattern: `const { client } = await getUncachableResendClient()`)
</read_first>
<action>
Replace entire contents of `server/lib/resend.ts` with:

```typescript
import { Resend } from "resend";

let cachedClient: Resend | null = null;

function getClient(): Resend {
  if (!cachedClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is required");
    }
    cachedClient = new Resend(apiKey);
  }
  return cachedClient;
}

export function getResendClient() {
  return {
    client: getClient(),
    fromEmail: "Insight Up Solutions <info@insightupsolutions.com>",
  };
}
```

Then update all call sites in `server/routes.ts`:
- Find/replace `getUncachableResendClient` → `getResendClient` (4 call sites)
- Remove `await` from each call (function is no longer async): `const { client, fromEmail } = getResendClient();`
- Update the import line: `import { getResendClient } from "./lib/resend";`
- At each email send, use `fromEmail` for the `from:` field instead of hardcoded string

Design notes:
- Renamed from `getUncachableResendClient` — old name was a lie (client IS cached now)
- Dropped `async` — function does no awaiting
- Callers now destructure `{ client, fromEmail }` — centralizes the from address
- Client cached at module level (API key doesn't rotate like Replit tokens)
</action>
<acceptance_criteria>
- `grep 'REPLIT_CONNECTORS_HOSTNAME\|REPL_IDENTITY\|WEB_REPL_RENEWAL' server/lib/resend.ts` returns no results
- `grep 'RESEND_API_KEY' server/lib/resend.ts` returns a match
- `grep 'export function getResendClient' server/lib/resend.ts` returns a match
- `grep 'getUncachableResendClient' server/routes.ts server/lib/resend.ts` returns no results
- `grep 'getResendClient' server/routes.ts` returns matches at all 4 call sites
</acceptance_criteria>
</task>

<task id="2.2a" name="Simplify routes.ts — remove createServer, make synchronous">
<read_first>
- server/routes.ts (line 1: http import, line 11: function signature, lines 483-485: createServer + return)
- server/routes.ts (verify no top-level awaits in function body — all `await` is inside route handler callbacks)
</read_first>
<action>
1. Delete line 1: `import { createServer, type Server } from "http";`
2. Change line 11 signature from:
   `export async function registerRoutes(app: Express): Promise<Server>`
   to:
   `export function registerRoutes(app: Express): void`
   (function has no top-level awaits — all `await` calls are inside route handler callbacks)
3. Delete lines 483-485:
   ```typescript
   const httpServer = createServer(app);

   return httpServer;
   ```
   (function now ends after the last route handler's closing brace)
</action>
<acceptance_criteria>
- `grep 'createServer' server/routes.ts` returns no results
- `grep 'import.*http' server/routes.ts` returns no results
- `grep 'export function registerRoutes' server/routes.ts` returns a match (no `async`)
- `grep 'Promise<Server>\|Promise<void>' server/routes.ts` returns no results
</acceptance_criteria>
</task>

<task id="2.2b" name="Rewrite server/index.ts — export app directly">
<read_first>
- server/index.ts (full file — current IIFE structure with seedDatabase, video middleware, setupVite, listen)
- server/routes.ts (verify registerRoutes is now synchronous `void` from task 2.2a)
</read_first>
<action>
Replace entire contents of `server/index.ts` with:

```typescript
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(logLine);
    }
  });

  next();
});

// Register routes synchronously — all route handlers use async callbacks
// but registerRoutes itself is synchronous (just app.get/app.post calls)
registerRoutes(app);

// Express error handler (4-arg signature required by Express)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export { app };
```

What was removed vs. current file:
- `import { setupVite, serveStatic, log } from "./vite"` (dev-only, moved to dev.ts)
- `import { seedDatabase } from "./seed"` (standalone script only)
- `import fs from "fs"` and `import path from "path"` (no longer needed)
- Video streaming middleware lines 12-50 (Vercel CDN handles range requests — VRCL-07)
- `seedDatabase()` call (D-04)
- `createServer` result handling (registerRoutes now returns void)
- Vite dev/prod middleware setup (moved to dev.ts)
- `server.listen()` call (moved to dev.ts)
- `throw err;` in error handler (would crash serverless function)
- `appReady` async IIFE pattern (registerRoutes is synchronous — no promise needed)
</action>
<acceptance_criteria>
- `grep 'export.*{ app }' server/index.ts` returns a match
- `grep 'appReady\|async\|Promise\|IIFE' server/index.ts` returns no results
- `grep 'listen\|setupVite\|serveStatic\|seedDatabase\|\.mp4\|video' server/index.ts` returns no results
- `grep 'throw err' server/index.ts` returns no results
- `grep 'registerRoutes(app)' server/index.ts` returns a match (synchronous call, no await)
</acceptance_criteria>
</task>

<task id="2.2c" name="Create server/dev.ts">
<read_first>
- server/index.ts (the rewritten version — verify it exports `app` directly, no appReady)
- server/vite.ts (verify setupVite signature: `setupVite(app: Express, server: Server)`)
- server/seed.ts (verify seedDatabase export)
</read_first>
<action>
Create new file `server/dev.ts`:

```typescript
import { app } from "./index";
import { setupVite, log } from "./vite";
import { seedDatabase } from "./seed";
import { createServer } from "http";

(async () => {
  await seedDatabase();

  const server = createServer(app);
  await setupVite(app, server);

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`);
  });
})().catch((err) => {
  console.error("Failed to start dev server:", err);
  process.exit(1);
});
```

This is the local development entry point. It:
- Imports the fully-configured Express app (routes already registered at import time)
- Seeds the database if empty
- Creates an HTTP server (required by Vite HMR)
- Sets up Vite dev middleware with HMR
- Listens on PORT (default 5000)
- `.catch()` provides clear error on startup failure instead of unhandled rejection
</action>
<acceptance_criteria>
- `server/dev.ts` exists
- `grep 'import.*{ app }.*from.*./index' server/dev.ts` returns a match
- `grep 'appReady' server/dev.ts` returns no results
- `grep 'setupVite' server/dev.ts` returns a match
- `grep 'seedDatabase' server/dev.ts` returns a match
- `grep 'server.listen' server/dev.ts` returns a match
- `grep '\.catch' server/dev.ts` returns a match
</acceptance_criteria>
</task>

<task id="2.3" name="Update package.json scripts">
<read_first>
- package.json (scripts section)
</read_first>
<action>
Update the scripts section to:
```json
"scripts": {
  "dev": "NODE_ENV=development tsx server/dev.ts",
  "build": "vite build",
  "check": "tsc",
  "db:push": "drizzle-kit push",
  "seed": "tsx server/seed.ts"
}
```

Changes from current:
- `dev`: `tsx server/index.ts` → `tsx server/dev.ts` (new entry point)
- `build`: `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` → `vite build` (Vercel handles server bundling)
- `start`: REMOVED — `node dist/index.js` no longer exists (esbuild step removed). Vercel handles production serving.
- `seed`: NEW — standalone seeder for manual disaster recovery
- `check`, `db:push`: unchanged
</action>
<acceptance_criteria>
- `grep 'server/dev.ts' package.json` returns a match (dev script)
- `grep 'esbuild' package.json` returns no results in scripts section
- `grep '"seed"' package.json` returns a match
- `grep '"build": "vite build"' package.json` returns a match
</acceptance_criteria>
</task>

<task id="2.4" name="Update tsconfig.json include array">
<read_first>
- tsconfig.json (include array)
</read_first>
<action>
Change the include array from:
```json
"include": ["client/src/**/*", "shared/**/*", "server/**/*"],
```
to:
```json
"include": ["client/src/**/*", "shared/**/*", "server/**/*", "api/**/*"],
```
</action>
<acceptance_criteria>
- `grep 'api/\*\*/\*' tsconfig.json` returns a match
</acceptance_criteria>
</task>

## Verification

```bash
# Resend connector uses API key, not Replit
grep 'RESEND_API_KEY' server/lib/resend.ts
grep 'getResendClient' server/lib/resend.ts  # renamed from getUncachableResendClient
grep 'getUncachableResendClient' server/routes.ts server/lib/resend.ts  # should return nothing

# Server exports app directly (no appReady, no listen)
grep 'export.*{ app }' server/index.ts
grep -c 'listen\|appReady\|async' server/index.ts  # should be 0

# Dev entry point exists with error handling
test -f server/dev.ts && echo "OK"
grep '\.catch' server/dev.ts  # has .catch() for startup errors

# Scripts updated, no dead start script
grep '"dev".*dev.ts' package.json
grep '"start"' package.json  # should return nothing

# Type check passes
npx tsc --noEmit
```

## must_haves

- Resend connector uses RESEND_API_KEY env var directly (no Replit connector code)
- Resend function renamed to `getResendClient` (not async, cached client)
- server/index.ts exports `app` directly — no appReady, no async, no listen(), no seed, no video middleware
- server/routes.ts registerRoutes is synchronous `void` (no async, no createServer)
- server/dev.ts exists with seedDatabase + setupVite + listen + .catch() error handler
- package.json dev script points to server/dev.ts
- package.json build script is just `vite build` (no esbuild step)
- package.json has no dead `start` script
