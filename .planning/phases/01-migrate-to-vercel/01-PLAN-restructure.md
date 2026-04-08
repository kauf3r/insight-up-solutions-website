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

export async function getUncachableResendClient() {
  return {
    client: getClient(),
    fromEmail: "Insight Up Solutions <info@insightupsolutions.com>",
  };
}
```

Design notes:
- Function name `getUncachableResendClient` and return shape `{ client, fromEmail }` preserved — zero changes needed in routes.ts
- Kept `async` to match existing callers that `await` it
- Client IS cached (unlike Replit's rotating tokens, API key doesn't expire)
- Throws clear error if env var missing
</action>
<acceptance_criteria>
- `grep 'REPLIT_CONNECTORS_HOSTNAME\|REPL_IDENTITY\|WEB_REPL_RENEWAL' server/lib/resend.ts` returns no results
- `grep 'RESEND_API_KEY' server/lib/resend.ts` returns a match
- `grep 'export async function getUncachableResendClient' server/lib/resend.ts` returns a match
- No changes in server/routes.ts email call sites (callers still do `const { client } = await getUncachableResendClient()`)
</acceptance_criteria>
</task>

<task id="2.2a" name="Simplify routes.ts — remove createServer">
<read_first>
- server/routes.ts (line 1: http import, line 11: function signature, lines 483-485: createServer + return)
</read_first>
<action>
1. Delete line 1: `import { createServer, type Server } from "http";`
2. Change line 11 signature from:
   `export async function registerRoutes(app: Express): Promise<Server>`
   to:
   `export async function registerRoutes(app: Express): Promise<void>`
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
- `grep 'Promise<void>' server/routes.ts` returns a match
- `grep 'Promise<Server>' server/routes.ts` returns no results
</acceptance_criteria>
</task>

<task id="2.2b" name="Rewrite server/index.ts — export app + appReady">
<read_first>
- server/index.ts (full file — current IIFE structure with seedDatabase, video middleware, setupVite, listen)
- server/routes.ts (verify registerRoutes now returns void from task 2.2a)
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

// Register routes and set up error handler
const appReady = (async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
})();

export { app, appReady };
```

What was removed:
- `import { setupVite, serveStatic, log } from "./vite"` (dev-only, moved to dev.ts)
- `import { seedDatabase } from "./seed"` (standalone script only)
- `import fs from "fs"` and `import path from "path"` (no longer needed)
- Video streaming middleware lines 12-50 (Vercel CDN handles range requests — VRCL-07)
- `seedDatabase()` call (D-04)
- `createServer` result handling (registerRoutes now returns void)
- Vite dev/prod middleware setup (moved to dev.ts)
- `server.listen()` call (moved to dev.ts)
- `throw err;` in error handler (would crash serverless function)
</action>
<acceptance_criteria>
- `grep 'export.*app.*appReady' server/index.ts` returns a match
- `grep 'listen\|setupVite\|serveStatic\|seedDatabase\|\.mp4\|video' server/index.ts` returns no results
- `grep 'throw err' server/index.ts` returns no results
- server/index.ts does NOT contain an IIFE that calls listen()
</acceptance_criteria>
</task>

<task id="2.2c" name="Create server/dev.ts">
<read_first>
- server/index.ts (the rewritten version — verify it exports app and appReady)
- server/vite.ts (verify setupVite signature: `setupVite(app: Express, server: Server)`)
- server/seed.ts (verify seedDatabase export)
</read_first>
<action>
Create new file `server/dev.ts`:

```typescript
import { app, appReady } from "./index";
import { setupVite, log } from "./vite";
import { seedDatabase } from "./seed";
import { createServer } from "http";

(async () => {
  await appReady;
  await seedDatabase();

  const server = createServer(app);
  await setupVite(app, server);

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`);
  });
})();
```

This is the local development entry point. It:
- Waits for routes to register
- Seeds the database if empty
- Creates an HTTP server (required by Vite HMR)
- Sets up Vite dev middleware with HMR
- Listens on PORT (default 5000)
</action>
<acceptance_criteria>
- `server/dev.ts` exists
- `grep 'import.*app.*appReady.*from.*./index' server/dev.ts` returns a match
- `grep 'setupVite' server/dev.ts` returns a match
- `grep 'seedDatabase' server/dev.ts` returns a match
- `grep 'server.listen' server/dev.ts` returns a match
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
  "start": "NODE_ENV=production node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push",
  "seed": "tsx server/seed.ts"
}
```

Changes from current:
- `dev`: `tsx server/index.ts` → `tsx server/dev.ts` (new entry point)
- `build`: `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` → `vite build` (Vercel handles server bundling)
- `seed`: NEW — standalone seeder for manual disaster recovery
- `start`, `check`, `db:push`: unchanged
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

# Server exports app + appReady (no listen)
grep 'export.*app' server/index.ts
grep -c 'listen' server/index.ts  # should be 0

# Dev entry point exists and works
test -f server/dev.ts && echo "OK"

# Scripts updated
grep '"dev".*dev.ts' package.json

# Type check passes
npx tsc --noEmit
```

## must_haves

- Resend connector uses RESEND_API_KEY env var directly (no Replit connector code)
- server/index.ts exports `app` and `appReady` — no listen(), no seed, no video middleware
- server/routes.ts registerRoutes returns void (no createServer)
- server/dev.ts exists as local development entry point with seedDatabase + setupVite + listen
- package.json dev script points to server/dev.ts
- package.json build script is just `vite build` (no esbuild step)
