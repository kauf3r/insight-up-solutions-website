# External Integrations

**Analysis Date:** 2026-04-07

## APIs & External Services

**Email:**
- Resend - Email delivery service
  - SDK/Client: `resend` 6.4.2
  - Auth: Via Replit Connectors (REPL_IDENTITY or WEB_REPL_RENEWAL + REPLIT_CONNECTORS_HOSTNAME)
  - Implementation: `server/lib/resend.ts` - `getUncachableResendClient()`
  - Usage: Automated confirmations for demo bookings, inquiries, and contact form submissions
  - From email: `info@insightupsolutions.com`
  - Admin notification: `kaufman@airspaceintegration.com`
  - Cache note: Client is NOT cached; new instance created per request due to token expiration

**Payments:**
- Stripe - Payment processing
  - SDK/Client: `stripe` 18.5.0, `@stripe/stripe-js` 7.9.0, `@stripe/react-stripe-js` 4.0.2
  - Auth: Environment variable (not documented in current routes)
  - Status: Integrated into dependencies but no active endpoints found in routes
  - Likely intended for future payment functionality

## Data Storage

**Databases:**
- PostgreSQL 16
  - Connection: `DATABASE_URL` environment variable
  - Client: Drizzle ORM with `@neondatabase/serverless` adapter
  - Provider: Neon (serverless PostgreSQL, inferred from connection string pattern)
  - WebSocket support: `ws` package configured for serverless connections
  - Schema location: `shared/schema.ts`
  - Session store: `connect-pg-simple` (PostgreSQL session persistence)

**File Storage:**
- Local filesystem only
  - Video streaming: Handled via Express middleware in `server/index.ts`
  - Video path: `client/public/` (development) or `dist/public/` (production)
  - Range request support: Implemented for HTTP video streaming

**Caching:**
- In-memory session store: `memorystore` 1.6.7 (development)
- Redis: Not detected
- Distributed caching: None detected (in-memory only)

## Authentication & Identity

**Auth Provider:**
- Custom local authentication
  - Implementation: Passport.js with local strategy (`passport` 0.7.0, `passport-local` 1.0.0)
  - Session management: `express-session` 1.18.1
  - Session store: `connect-pg-simple` for PostgreSQL or `memorystore` for development
  - Schema: `users` table in `shared/schema.ts` with username/password
  - Status: Configured but may not be actively used in current routes (no auth endpoints visible)

**No OAuth/SSO detected**

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service integrated

**Logs:**
- Console logging only
  - Request logging: API request method, path, status, duration in `server/index.ts`
  - Tagged logging: DEMO_BOOKING, INQUIRY, RESEND, CONTACT prefixes used in `server/routes.ts`
  - Sample: `[RESEND] Sending demo booking confirmation to email@example.com`
  - Timezone: America/Los_Angeles for timestamp formatting

## CI/CD & Deployment

**Hosting:**
- Replit (specified in `.replit` configuration)
  - Deployment target: autoscale
  - Build: `npm run build` (Vite frontend + esbuild backend)
  - Start: `npm run start` (Node.js server)
  - Modules: nodejs-20, web, postgresql-16
  - Packages: ffmpeg (available)

**CI Pipeline:**
- Not detected - No CI/CD service configured (GitHub Actions, GitLab CI, etc.)

**Deployment Configuration:**
```
Port mappings:
  5000 → 80 (main API/frontend)
  5001 → 3000
  5002 → 3001
  37193 → 3002

Environment: PORT=5000
```

## Environment Configuration

**Required env vars:**
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://user:pass@host/db`)
- `PORT` - Server port (default 5000)
- `NODE_ENV` - Environment (development/production)

**Replit-specific vars:**
- `REPL_IDENTITY` or `WEB_REPL_RENEWAL` - Authentication token for Replit Connectors
- `REPLIT_CONNECTORS_HOSTNAME` - API hostname for Replit integrations

**Secrets location:**
- Environment variables only (`.env` file not versioned)
- Replit Connectors: Secrets managed via Replit dashboard
  - Resend API key and from_email stored in connectors config
  - Fetched dynamically at runtime via `server/lib/resend.ts`

**Optional vars:**
- `STRIPE_API_KEY` - For payment processing (not currently used in routes)
- `REPLIT_ID` - For Replit dev environment detection

## Webhooks & Callbacks

**Incoming:**
- No webhooks detected

**Outgoing:**
- Email callbacks: Implicit via Resend email sends (request/response based, not webhook-based)
  - Routes: `/api/demo-bookings`, `/api/inquiries`, `/api/contact`
  - Trigger: POST request with form data
  - Response: Email sent to user and admin simultaneously

## API Endpoints

**Product Management:**
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID or slug
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (no auth detected)

**Demo Bookings:**
- `GET /api/demo-bookings` - List all demo bookings
- `POST /api/demo-bookings` - Create demo booking + send confirmation emails
- `PATCH /api/demo-bookings/:id/status` - Update booking status

**Inquiries:**
- `GET /api/inquiries` - List all inquiries
- `POST /api/inquiries` - Create inquiry + send confirmation emails
- `PATCH /api/inquiries/:id/status` - Update inquiry status

**Contact Form:**
- `POST /api/contact` - Create contact inquiry (alias for inquiries endpoint)

**Video Streaming:**
- `GET *.mp4` - Stream video files with HTTP range request support

## Third-Party SDKs

**Active:**
- `resend` 6.4.2 - Email service
- `drizzle-orm` 0.39.1 - Database ORM
- `@neondatabase/serverless` 0.10.4 - Serverless PostgreSQL
- `@tanstack/react-query` 5.60.5 - API state management
- `zod` 3.24.2 - Schema validation
- `react-hook-form` 7.55.0 - Form handling

**Integrated but unused:**
- `stripe` 18.5.0 - Payment processing
- `passport` 0.7.0 - Authentication
- `passport-local` 1.0.0 - Local auth strategy

---

*Integration audit: 2026-04-07*
