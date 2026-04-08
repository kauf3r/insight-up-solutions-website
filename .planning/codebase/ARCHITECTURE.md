# Architecture

**Analysis Date:** 2026-04-07

## Pattern Overview

**Overall:** Full-stack monolithic SPA with isomorphic build (single Express server serving both API and client).

**Key Characteristics:**
- Single Node.js/Express process serves both `/api/*` routes and static HTML client
- Client is React SPA built with Vite, served through Express in dev/prod
- Shared TypeScript schema and types between client and server via `@shared` path alias
- Database access abstraction layer (`storage`) decouples routes from Drizzle ORM
- Client uses TanStack Query for server-state management and form-based mutations

## Layers

**Presentation (Client):**
- Purpose: Render interactive UI, collect form data, display product/solution information
- Location: `client/src/`
- Contains: React components, pages, hooks, utilities for rendering
- Depends on: TanStack Query (server-state), Wouter (routing), Radix UI (components), Zod (validation)
- Used by: End users via browser

**Page/Route Layer (Client):**
- Purpose: Route-specific page logic and composition
- Location: `client/src/pages/`
- Contains: Page components (HomePage, ProductDetailPage, SolutionsPage, DemoPage, etc.)
- Depends on: Components, hooks, shared schema
- Used by: App.tsx router (Wouter)

**Component Layer (Client):**
- Purpose: Reusable UI components and feature-specific components
- Location: `client/src/components/`
- Contains: UI primitives (`ui/`), feature components (DemoBookingForm, InquiryForm, ProductGrid, etc.)
- Depends on: Radix UI, React, Zod for validation
- Used by: Pages and other components

**API Route Layer (Server):**
- Purpose: HTTP endpoint definitions, request validation, response formatting
- Location: `server/routes.ts`
- Contains: Express route handlers for `/api/*` paths (products, demo-bookings, inquiries, contact, bundle-leads)
- Depends on: Storage layer, Resend (email), Zod validation schemas
- Used by: Express app, client via fetch

**Storage/Data Access Layer (Server):**
- Purpose: Abstracts all database operations from routes
- Location: `server/storage.ts`
- Contains: DatabaseStorage class implementing IStorage interface
- Depends on: Drizzle ORM, shared schema, Neon serverless database
- Used by: routes.ts

**Schema/Type Layer (Shared):**
- Purpose: Single source of truth for data structure definitions
- Location: `shared/schema.ts`
- Contains: Drizzle table definitions (users, products, demoBookings, inquiries, bundleLeads), Zod insert schemas, TypeScript type exports
- Depends on: Drizzle ORM, Zod
- Used by: Both client (validation, types) and server (validation, types, database)

**Server Infrastructure:**
- Purpose: Server setup, middleware, development vs production asset serving
- Location: `server/index.ts`, `server/vite.ts`
- Contains: Express app initialization, video streaming, request logging, Vite middleware setup, static file serving
- Depends on: Express, Vite (dev), database seeding
- Used by: Node.js runtime

## Data Flow

**Form Submission Flow (Demo Booking):**

1. User fills DemoBookingForm in browser (`client/src/components/DemoBookingForm.tsx`)
2. Form validates against insertDemoBookingSchema (Zod)
3. Client calls `apiRequest("POST", "/api/demo-bookings", data)` via TanStack Query mutation
4. Express route handler at `POST /api/demo-bookings` receives request
5. Route validates data again with insertDemoBookingSchema
6. Calls `storage.createDemoBooking(validatedData)`
7. DatabaseStorage executes Drizzle insert: `db.insert(demoBookings).values(booking).returning()`
8. Route sends confirmation email via Resend and admin notification
9. Returns 201 with created booking object
10. TanStack Query onSuccess invalidates cache, form resets, toast appears

**Product Display Flow:**

1. HomePage (or ProductDetailPage) component mounts
2. useQuery hook with queryKey ["/api/products"] or ["/api/products/:id"]
3. queryClient calls getQueryFn which issues fetch to endpoint
4. Express route `GET /api/products/:id` receives request
5. Route calls storage.getProduct(id) or storage.getProductBySlug(slug)
6. DatabaseStorage executes Drizzle select: `db.select().from(products).where(eq(products.id, id))`
7. Route returns 200 with product object
8. TanStack Query caches result
9. Component re-renders with product data
10. ProductGrid or ProductDetailPage renders fetched data

**Page Navigation Flow:**

1. User clicks link or navigates to URL
2. Wouter router matches route to page component
3. Page component renders (with nested component tree)
4. Components may trigger useQuery hooks for data
5. No server-side navigation — purely client-side SPA routing
6. Express serves `index.html` catch-all in production, or Vite HMR in development

**State Management:**

- **Server State:** TanStack Query (queryClient with staleTime: Infinity, no refetch on window focus)
- **Client State:** React hooks (useState in components like DemoBookingForm)
- **Form State:** React Hook Form with Zod resolver for validation
- **UI State:** Component-level (toasts, modals, loading states)
- **Cache:** TanStack Query instance in `client/src/lib/queryClient.ts`

## Key Abstractions

**IStorage Interface:**
- Purpose: Defines contract for data access operations
- Examples: `server/storage.ts` implements DatabaseStorage class
- Pattern: All database operations go through this interface; routes never call Drizzle directly

**API Schema Validation:**
- Purpose: Share validation rules between client and server
- Examples: insertDemoBookingSchema, insertInquirySchema, insertProductSchema in `shared/schema.ts`
- Pattern: Zod schemas defined in shared, used with `zodResolver` in forms and route validation

**Resend Email Integration:**
- Purpose: Abstracts email sending with caching logic
- Examples: `server/lib/resend.ts` provides getUncachableResendClient()
- Pattern: Routes call this function when email confirmation needed; returns Resend client instance

**Path Aliases:**
- Purpose: Simplify imports across client and shared code
- Examples: `@/*` → `client/src/`, `@shared/*` → `shared/`
- Pattern: Defined in `tsconfig.json`, enables import { Product } from "@shared/schema"

## Entry Points

**Server Entry Point:**
- Location: `server/index.ts`
- Triggers: `npm run dev` or `npm start` (via esbuild in production)
- Responsibilities: Initialize Express, seed database, register routes, set up Vite (dev) or static serving (prod), listen on PORT

**Client Entry Point:**
- Location: `client/src/main.tsx`
- Triggers: Browser loads `index.html`
- Responsibilities: Mount React app to DOM root element

**Routing Entry Point:**
- Location: `client/src/App.tsx`
- Triggers: App component renders
- Responsibilities: Initialize QueryClientProvider, TooltipProvider, Toaster, define Wouter Switch with route definitions

## Error Handling

**Strategy:** Centralized error middleware on server; client-side toast notifications for API failures.

**Patterns:**
- Routes wrap database calls in try-catch, return 500 with error message on failure
- Client `apiRequest` function checks response status and throws if not ok
- Client mutations use onError handler to show destructive toast to user
- Server error middleware (in index.ts) catches unhandled errors and returns 500 JSON response
- Drizzle operations throw on constraint violations (e.g., duplicate slug); routes catch and return 400

## Cross-Cutting Concerns

**Logging:**
- Server: console.log with `[CONTEXT]` prefix (e.g., `[DEMO BOOKING]`, `[RESEND]`, `[INQUIRY]`)
- Request logging middleware in `server/index.ts` logs all `/api` requests with method, path, status, duration, and response JSON
- Client: console.error for catch blocks in form submissions

**Validation:**
- All user input validated twice: once on client (React Hook Form + Zod), once on server (routes + Zod)
- Zod schemas in `shared/schema.ts` are source of truth
- Insert schemas omit auto-generated fields (id, createdAt, status)

**Authentication:**
- No authentication currently implemented
- Routes are public; any client can POST to `/api/demo-bookings`, `/api/inquiries`, etc.
- Admin email notifications go to hardcoded address (`kaufman@airspaceintegration.com`)

**Database:**
- Neon serverless PostgreSQL via `@neondatabase/serverless` with WebSocket support
- Drizzle ORM for type-safe queries
- Migrations managed via drizzle-kit (`npm run db:push`)
- Schema defined once in `shared/schema.ts`, used by both Drizzle and Zod

**Video Streaming:**
- Special `*.mp4` route in `server/index.ts` handles range requests (HTTP 206)
- Supports pause/resume in HTML5 video players
- Respects dev/prod paths (client/public vs dist/public)

---

*Architecture analysis: 2026-04-07*
