# Technology Stack

**Analysis Date:** 2026-04-07

## Languages

**Primary:**
- TypeScript 5.6.3 - Full-stack application (client and server)

**Secondary:**
- JavaScript - Configuration files and build tools

## Runtime

**Environment:**
- Node.js 20 - Specified in `.replit` configuration
- PostgreSQL 16 - Database runtime

**Package Manager:**
- npm - Version management via `package-lock.json`
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**
- Express 4.21.2 - REST API server (`server/index.ts`, `server/routes.ts`)
- React 18.3.1 - Frontend UI framework
- Vite 5.4.19 - Frontend build tool and dev server
- Next.js - Not used; project uses Express + React instead

**Testing:**
- No test framework detected in dependencies

**Build/Dev:**
- Vite 5.4.19 - Frontend bundler and dev server
- esbuild 0.25.0 - Backend bundle compilation
- tsx 4.19.1 - TypeScript execution for Node.js
- Tailwind CSS 3.4.17 - Utility-first CSS styling

## Key Dependencies

**Critical:**
- `drizzle-orm` 0.39.1 - ORM for type-safe database queries (`server/db.ts`, `shared/schema.ts`)
- `@neondatabase/serverless` 0.10.4 - PostgreSQL driver (serverless Neon compatibility)
- `zod` 3.24.2 - Schema validation for API requests
- `drizzle-zod` 0.7.0 - Integration between Drizzle and Zod for schema inference

**State Management:**
- `@tanstack/react-query` 5.60.5 - Server state management for API interactions (`client/src/lib/queryClient.ts`)

**Forms:**
- `react-hook-form` 7.55.0 - Form state management
- `@hookform/resolvers` 3.10.0 - Integration with Zod validation

**Routing:**
- `wouter` 3.3.5 - Lightweight client-side router (`client/src/App.tsx`)

**UI Components:**
- `@radix-ui/*` 1.1+/1.2+ - Unstyled accessible component primitives (18+ individual packages)
  - Includes: accordion, alert-dialog, checkbox, dialog, dropdown-menu, popover, select, tabs, tooltip, etc.
- `class-variance-authority` 0.7.1 - CSS class composition utility
- `clsx` 2.1.1 - Conditional className utility
- `lucide-react` 0.453.0 - Icon library
- `react-icons` 5.4.0 - Additional icon library
- `embla-carousel-react` 8.6.0 - Carousel component

**Styling:**
- `tailwind-merge` 2.6.0 - Merge Tailwind CSS classes intelligently
- `tailwindcss-animate` 1.0.7 - Animation utilities for Tailwind
- `framer-motion` 11.13.1 - Animation library

**Charts:**
- `recharts` 2.15.2 - React charting library

**Date/Time:**
- `date-fns` 3.6.0 - Date utility library

**Email:**
- `resend` 6.4.2 - Email service SDK

**Payments:**
- `stripe` 18.5.0 - Payment processing SDK (Node.js)
- `@stripe/stripe-js` 7.9.0 - Stripe JavaScript SDK
- `@stripe/react-stripe-js` 4.0.2 - React wrapper for Stripe.js

**Authentication:**
- `passport` 0.7.0 - Authentication middleware (configured but may not be actively used)
- `passport-local` 1.0.0 - Local strategy for Passport
- `express-session` 1.18.1 - Session management
- `connect-pg-simple` 10.0.0 - PostgreSQL session store
- `memorystore` 1.6.7 - In-memory session store

**Utilities:**
- `ws` 8.18.0 - WebSocket library (for Neon serverless compatibility)
- `input-otp` 1.4.2 - OTP input component
- `vaul` 1.1.2 - Drawer/sheet component
- `next-themes` 0.4.6 - Theme management (currently set to dark mode via Tailwind)

**Infrastructure:**
- `@neondatabase/serverless` 0.10.4 - Serverless PostgreSQL client

## Configuration

**Environment:**
- `.env` file required (not versioned)
- Required variables:
  - `DATABASE_URL` - PostgreSQL connection string (enforced in `drizzle.config.ts` and `server/db.ts`)
  - `PORT` - Server port (default 5000 as per `.replit`)
  - `NODE_ENV` - Application environment (development/production)
  - `REPL_IDENTITY` or `WEB_REPL_RENEWAL` - Replit authentication token (for Resend connector)
  - `REPLIT_CONNECTORS_HOSTNAME` - Replit connectors API hostname

**Build:**
- `vite.config.ts` - Frontend bundler configuration
  - Root: `client/src`
  - Output: `dist/public`
  - Alias paths: `@` → `client/src`, `@shared` → `shared`, `@assets` → `attached_assets`
- `tsconfig.json` - TypeScript compiler options
  - Module: ESNext
  - Strict mode enabled
  - Path aliases configured
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration (minimal)
- `drizzle.config.ts` - ORM configuration
  - Dialect: PostgreSQL
  - Schema: `shared/schema.ts`
  - Migrations: `migrations/` directory
- `.replit` - Replit deployment configuration
  - Deployment target: autoscale
  - Build command: `npm run build`
  - Start command: `npm run start`
  - Port mappings: 5000 → 80 (API), 5001 → 3000, 5002 → 3001

## Platform Requirements

**Development:**
- Node.js 20+
- PostgreSQL 16 (local or remote via Neon)
- npm or yarn
- Replit environment (for email connector integration)

**Production:**
- Node.js 20 runtime
- PostgreSQL 16 database (Neon Serverless recommended)
- Replit deployment platform (required for Resend email connector)
- Port 5000 accessible (mapped to external port 80)

## Build & Run Commands

```bash
npm run dev      # Start development server (tsx + Vite)
npm run build    # Build frontend (Vite) + backend (esbuild)
npm run start    # Start production server
npm run check    # Type check with tsc
npm run db:push  # Push schema changes to database
```

---

*Stack analysis: 2026-04-07*
