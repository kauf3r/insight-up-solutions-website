<!-- GSD:project-start source:PROJECT.md -->
## Project

**Insight Up Solutions — Vercel Migration**

E-commerce and lead generation website for Insight Up Solutions, a professional UAV systems company. The site showcases drone platforms (Trinity Pro, payloads, GNSS equipment), captures demo bookings, quote requests, contact inquiries, and bundle leads via forms with email notifications. Currently deployed on Replit — migrating to Vercel.

**Core Value:** The site must serve product pages and capture leads (demo bookings, quotes, contact forms) with email notifications to both the customer and admin. If anything else breaks, these must work.

### Constraints

- **Database**: Keep existing Neon DB — real lead data exists, no re-creation
- **Email**: RESEND_API_KEY must be obtained from Resend dashboard before email testing
- **Static assets**: Video file (~1.7MB) and product images must work via Vercel CDN
- **Path aliases**: `@shared` and `@` must resolve in both Vite build and Vercel's esbuild bundler
- **Local dev**: Must still work after migration (new dev entry point needed)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.6.3 - Full-stack application (client and server)
- JavaScript - Configuration files and build tools
## Runtime
- Node.js 20 - Specified in `.replit` configuration
- PostgreSQL 16 - Database runtime
- npm - Version management via `package-lock.json`
- Lockfile: Present (`package-lock.json`)
## Frameworks
- Express 4.21.2 - REST API server (`server/index.ts`, `server/routes.ts`)
- React 18.3.1 - Frontend UI framework
- Vite 5.4.19 - Frontend build tool and dev server
- Next.js - Not used; project uses Express + React instead
- No test framework detected in dependencies
- Vite 5.4.19 - Frontend bundler and dev server
- esbuild 0.25.0 - Backend bundle compilation
- tsx 4.19.1 - TypeScript execution for Node.js
- Tailwind CSS 3.4.17 - Utility-first CSS styling
## Key Dependencies
- `drizzle-orm` 0.39.1 - ORM for type-safe database queries (`server/db.ts`, `shared/schema.ts`)
- `@neondatabase/serverless` 0.10.4 - PostgreSQL driver (serverless Neon compatibility)
- `zod` 3.24.2 - Schema validation for API requests
- `drizzle-zod` 0.7.0 - Integration between Drizzle and Zod for schema inference
- `@tanstack/react-query` 5.60.5 - Server state management for API interactions (`client/src/lib/queryClient.ts`)
- `react-hook-form` 7.55.0 - Form state management
- `@hookform/resolvers` 3.10.0 - Integration with Zod validation
- `wouter` 3.3.5 - Lightweight client-side router (`client/src/App.tsx`)
- `@radix-ui/*` 1.1+/1.2+ - Unstyled accessible component primitives (18+ individual packages)
- `class-variance-authority` 0.7.1 - CSS class composition utility
- `clsx` 2.1.1 - Conditional className utility
- `lucide-react` 0.453.0 - Icon library
- `react-icons` 5.4.0 - Additional icon library
- `embla-carousel-react` 8.6.0 - Carousel component
- `tailwind-merge` 2.6.0 - Merge Tailwind CSS classes intelligently
- `tailwindcss-animate` 1.0.7 - Animation utilities for Tailwind
- `framer-motion` 11.13.1 - Animation library
- `recharts` 2.15.2 - React charting library
- `date-fns` 3.6.0 - Date utility library
- `resend` 6.4.2 - Email service SDK
- `stripe` 18.5.0 - Payment processing SDK (Node.js)
- `@stripe/stripe-js` 7.9.0 - Stripe JavaScript SDK
- `@stripe/react-stripe-js` 4.0.2 - React wrapper for Stripe.js
- `passport` 0.7.0 - Authentication middleware (configured but may not be actively used)
- `passport-local` 1.0.0 - Local strategy for Passport
- `express-session` 1.18.1 - Session management
- `connect-pg-simple` 10.0.0 - PostgreSQL session store
- `memorystore` 1.6.7 - In-memory session store
- `ws` 8.18.0 - WebSocket library (for Neon serverless compatibility)
- `input-otp` 1.4.2 - OTP input component
- `vaul` 1.1.2 - Drawer/sheet component
- `next-themes` 0.4.6 - Theme management (currently set to dark mode via Tailwind)
- `@neondatabase/serverless` 0.10.4 - Serverless PostgreSQL client
## Configuration
- `.env` file required (not versioned)
- Required variables:
- `vite.config.ts` - Frontend bundler configuration
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration (minimal)
- `drizzle.config.ts` - ORM configuration
- `.replit` - Replit deployment configuration
## Platform Requirements
- Node.js 20+
- PostgreSQL 16 (local or remote via Neon)
- npm or yarn
- Replit environment (for email connector integration)
- Node.js 20 runtime
- PostgreSQL 16 database (Neon Serverless recommended)
- Replit deployment platform (required for Resend email connector)
- Port 5000 accessible (mapped to external port 80)
## Build & Run Commands
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- React components: PascalCase (e.g., `ProductGrid.tsx`, `QuotePage.tsx`, `PartnershipsSection.tsx`)
- UI library components: lowercase with hyphens (e.g., `card.tsx`, `alert-dialog.tsx`, `input-otp.tsx`)
- Server files: camelCase (e.g., `index.ts`, `routes.ts`, `storage.ts`, `resend.ts`)
- Utility/lib files: camelCase (e.g., `queryClient.ts`, `utils.ts`)
- camelCase (e.g., `formatPrice()`, `throwIfResNotOk()`, `getUncachableResendClient()`)
- React components are named with PascalCase: `default function ProductGrid()`, `export default function QuotePage()`
- Event handlers prefixed with "on" or descriptive verb: `onClick`, `onSuccess`, `onError`, `handleSubmit`
- camelCase (e.g., `apiProducts`, `formattedKey`, `displayProducts`)
- Type/interface suffixes: `Props`, `FormData`, `Schema` (e.g., `ProductGridProps`, `QuoteFormData`)
- Constants in UPPER_SNAKE_CASE when truly constant across code (e.g., `DATABASE_URL`)
- State variables follow camelCase: `isLoading`, `error`, `submitted`
- Interfaces: PascalCase (e.g., `IStorage`, `Partner`, `ProductGridProps`)
- Type unions: Inferred from context (e.g., `UnauthorizedBehavior = "returnNull" | "throw"`)
- Database types imported with capitalized names: `Product`, `User`, `DemoBooking`, `Inquiry`, `BundleLead`
## Code Style
- No explicit formatter detected (no ESLint, Prettier, or Biome config)
- Indentation: 2 spaces (observed in all files)
- Line length: Files vary but generally keep lines under 100 characters
- Semicolons: Used consistently throughout
- Quote style: Double quotes for strings (observed in imports, JSX, and object literals)
- Not detected in configuration files
- Code follows TypeScript strict mode: `"strict": true` in `tsconfig.json`
- Type safety is enforced: explicit type annotations on function parameters and returns
- Type imports use explicit `import type` syntax: `import type { Express } from "express"`
- Path aliases used: `@/` for client source, `@shared/` for shared modules, `@assets/` for assets
- Relative imports used for local server modules (e.g., `./routes`, `./storage`)
## Import Organization
- `@/*` → `./client/src/*` (client components, pages, utilities)
- `@shared/*` → `./shared/*` (shared schemas, types)
- `@assets/*` → `./attached_assets/*` (static assets)
## Error Handling
- Try-catch blocks for async operations: Seen in routes and API handlers
- Error propagation in fetch calls: `throwIfResNotOk()` function validates response status before processing
- Catch blocks often log errors before responding: `catch (error) { res.status(500).json({ error: "..." }) }`
- Promise rejections caught in mutation handlers: `onError: (error) => { console.error(...) }`
- Form validation errors handled via react-hook-form + zod: Schema validation before API submission
## Logging
- Categorized log messages with prefixes: `[DEMO BOOKING]`, `[RESEND]`, `[RESEND ERROR]`, `[INQUIRY]`
- Used for tracking operations: `console.log(`[DEMO BOOKING] Created booking for ${booking.email}`)`
- Used for debugging email operations: Multiple logs track email send attempts and failures
- Error logs with structured context: `console.error("[RESEND ERROR] Failed to send...", error)`
- Client-side logging minimal: Only in error handlers and mutation callbacks
## Comments
- TODO comments for unfinished work: `// TODO: Replace with real partner data when available` (in `PartnershipsSection.tsx`)
- Inline comments for complex logic: Very minimal use observed
- Comments explaining business logic: Seen in routes explaining auto-population and email workflows
- Comments above code sections explaining purpose: `// Video streaming middleware with range request support`
- No JSDoc/TSDoc patterns detected in the codebase
- Types and interfaces defined inline with minimal documentation
- Component props documented via TypeScript interfaces
## Function Design
- Functions generally keep business logic focused
- Route handlers average 20-30 lines for simple CRUD, up to 80+ lines for complex operations with side effects
- Utility functions are small and single-purpose: `formatPrice()` is 5 lines, `cn()` is 3 lines
- Explicit typed parameters: `async function registerRoutes(app: Express): Promise<Server>`
- Destructuring common in React components: `{ title = "...", showViewAll = true, ... }`
- Default values provided in function signatures
- Explicit return types specified: `Promise<Product[]>`, `Promise<User | undefined>`
- Functions that modify state return the modified entity: `createProduct()` returns the created Product
- API handlers return JSON or redirect via `res.json()`, `res.status().json()`
- Query handlers use React Query's mutation pattern: return Promise that resolves to API response
## Module Design
- Default exports for page components: `export default function QuotePage()`
- Named exports for utilities: `export async function apiRequest()`, `export const queryClient`
- Named exports for components: `export { storage }`
- Service classes instantiated and exported: `export const storage = new DatabaseStorage()`
- Storage layer uses interface pattern: `interface IStorage` defines contract, `class DatabaseStorage implements IStorage`
- Enables abstraction and testability
- Clean separation between data access and business logic
- `index.ts`: Express app setup, middleware, server listening
- `routes.ts`: API endpoints, request handling, validation
- `storage.ts`: Data access layer, database operations
- `lib/resend.ts`: External service client management
- `App.tsx`: Router and top-level providers
- `pages/`: Page components (QuotePage, ProductsPage, etc.)
- `components/`: Reusable components (ProductGrid, PartnershipsSection, etc.)
- `components/ui/`: Shadcn UI primitive components
- `lib/`: Utilities (queryClient, utils, hooks)
- `hooks/`: Custom React hooks (use-toast)
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Single Node.js/Express process serves both `/api/*` routes and static HTML client
- Client is React SPA built with Vite, served through Express in dev/prod
- Shared TypeScript schema and types between client and server via `@shared` path alias
- Database access abstraction layer (`storage`) decouples routes from Drizzle ORM
- Client uses TanStack Query for server-state management and form-based mutations
## Layers
- Purpose: Render interactive UI, collect form data, display product/solution information
- Location: `client/src/`
- Contains: React components, pages, hooks, utilities for rendering
- Depends on: TanStack Query (server-state), Wouter (routing), Radix UI (components), Zod (validation)
- Used by: End users via browser
- Purpose: Route-specific page logic and composition
- Location: `client/src/pages/`
- Contains: Page components (HomePage, ProductDetailPage, SolutionsPage, DemoPage, etc.)
- Depends on: Components, hooks, shared schema
- Used by: App.tsx router (Wouter)
- Purpose: Reusable UI components and feature-specific components
- Location: `client/src/components/`
- Contains: UI primitives (`ui/`), feature components (DemoBookingForm, InquiryForm, ProductGrid, etc.)
- Depends on: Radix UI, React, Zod for validation
- Used by: Pages and other components
- Purpose: HTTP endpoint definitions, request validation, response formatting
- Location: `server/routes.ts`
- Contains: Express route handlers for `/api/*` paths (products, demo-bookings, inquiries, contact, bundle-leads)
- Depends on: Storage layer, Resend (email), Zod validation schemas
- Used by: Express app, client via fetch
- Purpose: Abstracts all database operations from routes
- Location: `server/storage.ts`
- Contains: DatabaseStorage class implementing IStorage interface
- Depends on: Drizzle ORM, shared schema, Neon serverless database
- Used by: routes.ts
- Purpose: Single source of truth for data structure definitions
- Location: `shared/schema.ts`
- Contains: Drizzle table definitions (users, products, demoBookings, inquiries, bundleLeads), Zod insert schemas, TypeScript type exports
- Depends on: Drizzle ORM, Zod
- Used by: Both client (validation, types) and server (validation, types, database)
- Purpose: Server setup, middleware, development vs production asset serving
- Location: `server/index.ts`, `server/vite.ts`
- Contains: Express app initialization, video streaming, request logging, Vite middleware setup, static file serving
- Depends on: Express, Vite (dev), database seeding
- Used by: Node.js runtime
## Data Flow
- **Server State:** TanStack Query (queryClient with staleTime: Infinity, no refetch on window focus)
- **Client State:** React hooks (useState in components like DemoBookingForm)
- **Form State:** React Hook Form with Zod resolver for validation
- **UI State:** Component-level (toasts, modals, loading states)
- **Cache:** TanStack Query instance in `client/src/lib/queryClient.ts`
## Key Abstractions
- Purpose: Defines contract for data access operations
- Examples: `server/storage.ts` implements DatabaseStorage class
- Pattern: All database operations go through this interface; routes never call Drizzle directly
- Purpose: Share validation rules between client and server
- Examples: insertDemoBookingSchema, insertInquirySchema, insertProductSchema in `shared/schema.ts`
- Pattern: Zod schemas defined in shared, used with `zodResolver` in forms and route validation
- Purpose: Abstracts email sending with caching logic
- Examples: `server/lib/resend.ts` provides getUncachableResendClient()
- Pattern: Routes call this function when email confirmation needed; returns Resend client instance
- Purpose: Simplify imports across client and shared code
- Examples: `@/*` → `client/src/`, `@shared/*` → `shared/`
- Pattern: Defined in `tsconfig.json`, enables import { Product } from "@shared/schema"
## Entry Points
- Location: `server/index.ts`
- Triggers: `npm run dev` or `npm start` (via esbuild in production)
- Responsibilities: Initialize Express, seed database, register routes, set up Vite (dev) or static serving (prod), listen on PORT
- Location: `client/src/main.tsx`
- Triggers: Browser loads `index.html`
- Responsibilities: Mount React app to DOM root element
- Location: `client/src/App.tsx`
- Triggers: App component renders
- Responsibilities: Initialize QueryClientProvider, TooltipProvider, Toaster, define Wouter Switch with route definitions
## Error Handling
- Routes wrap database calls in try-catch, return 500 with error message on failure
- Client `apiRequest` function checks response status and throws if not ok
- Client mutations use onError handler to show destructive toast to user
- Server error middleware (in index.ts) catches unhandled errors and returns 500 JSON response
- Drizzle operations throw on constraint violations (e.g., duplicate slug); routes catch and return 400
## Cross-Cutting Concerns
- Server: console.log with `[CONTEXT]` prefix (e.g., `[DEMO BOOKING]`, `[RESEND]`, `[INQUIRY]`)
- Request logging middleware in `server/index.ts` logs all `/api` requests with method, path, status, duration, and response JSON
- Client: console.error for catch blocks in form submissions
- All user input validated twice: once on client (React Hook Form + Zod), once on server (routes + Zod)
- Zod schemas in `shared/schema.ts` are source of truth
- Insert schemas omit auto-generated fields (id, createdAt, status)
- No authentication currently implemented
- Routes are public; any client can POST to `/api/demo-bookings`, `/api/inquiries`, etc.
- Admin email notifications go to hardcoded address (`kaufman@airspaceintegration.com`)
- Neon serverless PostgreSQL via `@neondatabase/serverless` with WebSocket support
- Drizzle ORM for type-safe queries
- Migrations managed via drizzle-kit (`npm run db:push`)
- Schema defined once in `shared/schema.ts`, used by both Drizzle and Zod
- Special `*.mp4` route in `server/index.ts` handles range requests (HTTP 206)
- Supports pause/resume in HTML5 video players
- Respects dev/prod paths (client/public vs dist/public)
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
