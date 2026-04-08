# Codebase Structure

**Analysis Date:** 2026-04-07

## Directory Layout

```
insight-up-solutions/
├── client/                     # React SPA (Vite-based)
│   ├── public/                 # Static assets (images, videos)
│   ├── src/
│   │   ├── components/         # React components (pages, features, UI primitives)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities (queryClient, api helpers)
│   │   ├── pages/              # Page components (routed)
│   │   ├── App.tsx             # Root app component with routing
│   │   ├── main.tsx            # Vite entry point
│   │   └── index.css           # Global styles (Tailwind)
│   └── index.html              # HTML template
├── server/                     # Express API server
│   ├── lib/                    # Server utilities (Resend email client)
│   ├── index.ts                # Server entry point
│   ├── routes.ts               # API route definitions
│   ├── storage.ts              # Database access layer
│   ├── db.ts                   # Drizzle ORM initialization
│   ├── seed.ts                 # Database seeding script
│   └── vite.ts                 # Vite middleware setup (dev mode)
├── shared/                     # Shared code (types, schemas)
│   └── schema.ts               # Drizzle tables, Zod schemas, TypeScript types
├── migrations/                 # Drizzle migration files
├── attached_assets/            # Static image/video files
├── .planning/                  # GSD planning documents
│   └── codebase/               # Architecture/structure analysis
├── vite.config.ts              # Vite build config
├── tsconfig.json               # TypeScript config (path aliases, compiler options)
├── drizzle.config.ts           # Drizzle ORM config
├── tailwind.config.ts          # Tailwind CSS config
├── postcss.config.js           # PostCSS config (Tailwind processor)
├── package.json                # Dependencies, build/dev scripts
├── package-lock.json           # Locked dependency versions
└── components.json             # Shadcn/ui component manifest
```

## Directory Purposes

**client/:**
- Purpose: Browser-facing React Single Page Application
- Contains: React components, pages, hooks, utilities, styles, static assets
- Key files: `App.tsx` (router), `main.tsx` (entry), `index.html` (template)

**client/src/components/:**
- Purpose: All React components except pages
- Contains: Reusable UI components, feature-specific components, Radix UI primitive wrappers
- Subdirectories:
  - `ui/`: Shadcn/ui components (Button, Card, Dialog, Form, Input, Textarea, Tabs, Toast, etc.)
  - `examples/`: Composed component examples (not currently used)
- Feature components: DemoBookingForm, InquiryForm, ProductGrid, ProductCard, Header, Footer, HeroSection, TrinityPlatformSection, SolutionsSection, PartnershipsSection, Q4BundleBanner, SEO, TrustSignals

**client/src/pages/:**
- Purpose: Route-specific page components (one per page)
- Contains: HomePage, ProductsPage, ProductDetailPage, SolutionsPage (and nested solutions: Surveying, Agriculture, PublicSafety, Custom), DemoPage, QuotePage, TrainingPage, AboutPage, ContactPage, TrinityLR1SpecialPage, not-found
- Naming: PascalCase with Page suffix (e.g., HomePage.tsx)
- Pattern: Pages import shared components, fetch data via useQuery, render page layout

**client/src/hooks/:**
- Purpose: Custom React hooks for component logic
- Contains: use-toast (toast notification hook), use-mobile (responsive breakpoint detection)

**client/src/lib/:**
- Purpose: Shared client utilities and configuration
- Contains: queryClient.ts (TanStack Query instance with apiRequest helper), utils.ts (cn() utility for Tailwind class merging)

**server/:**
- Purpose: Node.js/Express backend server
- Contains: Route definitions, database operations, email client setup, server bootstrapping

**server/routes.ts:**
- Purpose: All Express route handlers
- Contains: GET/POST/PATCH routes for products, demo-bookings, inquiries, contact form, bundle-leads
- Pattern: Each route validates input with Zod schema, calls storage layer, sends responses, handles email notifications
- API paths: `/api/products`, `/api/products/:id`, `/api/products/category/:category`, `/api/demo-bookings`, `/api/inquiries`, `/api/contact`, `/api/bundle-leads`

**server/storage.ts:**
- Purpose: Database abstraction layer
- Contains: IStorage interface definition, DatabaseStorage class with all CRUD methods
- Methods: getUser, getUserByUsername, createUser, getAllProducts, getProduct, getProductBySlug, getProductsByCategory, createProduct, updateProduct, deleteProduct, getAllDemoBookings, getDemoBooking, createDemoBooking, updateDemoBookingStatus, getAllInquiries, getInquiry, createInquiry, updateInquiryStatus, getAllBundleLeads, getBundleLead, createBundleLead
- Pattern: Routes never call Drizzle directly; always go through storage methods

**server/db.ts:**
- Purpose: Drizzle ORM initialization and connection
- Contains: Neon Pool setup, Drizzle instance with schema imports
- Exports: pool, db (used by storage.ts)

**server/lib/:**
- Purpose: Server utilities
- Contains: resend.ts (Resend email client factory with caching/uncachable variations)

**shared/schema.ts:**
- Purpose: Single source of truth for data shapes
- Contains: 
  - Drizzle table definitions: users, products, demoBookings, inquiries, bundleLeads
  - Zod insert schemas (omit auto-generated fields): insertUserSchema, insertProductSchema, insertDemoBookingSchema, insertInquirySchema, insertBundleLeadSchema
  - TypeScript type exports: User, InsertUser, Product, InsertProduct, DemoBooking, InsertDemoBooking, Inquiry, InsertInquiry, BundleLead, InsertBundleLead
- Pattern: Defines tables with Drizzle, exports Zod schemas for validation, exports TypeScript types

**migrations/:**
- Purpose: Version-controlled database schema changes
- Contains: Auto-generated migration files created by drizzle-kit
- Generation: `npm run db:push` reads schema.ts and generates or pushes migrations

**attached_assets/:**
- Purpose: Large static images and media files
- Contains: Product images (Trinity_Pro_*.jpg, QS_Site_Cameras_*.jpg, etc.), Pix4D/SimActive/Emlid product shots, stock images (Autel Dragonfish)
- Pattern: Files referenced by ProductGrid.tsx via imageMap constant

## Key File Locations

**Entry Points:**
- `server/index.ts`: Server bootstrap, Express app initialization, port listener
- `client/src/main.tsx`: React app mount point
- `client/index.html`: HTML template with `<div id="root">` and script tag

**Configuration:**
- `vite.config.ts`: Build config, path aliases, Vite plugins
- `tsconfig.json`: TypeScript config, path aliases (@/, @shared/), compiler options
- `drizzle.config.ts`: Drizzle database URL and schema location
- `tailwind.config.ts`: Tailwind color scheme, typography, custom components
- `package.json`: Dependencies, build scripts, npm metadata

**Core Logic:**
- `server/routes.ts`: All API endpoint logic (products, forms, emails)
- `server/storage.ts`: All database CRUD operations
- `client/src/App.tsx`: Routing, provider setup
- `client/src/components/DemoBookingForm.tsx`: Demo booking form with mutation
- `client/src/components/InquiryForm.tsx`: General inquiry/quote form with mutation
- `client/src/components/ProductGrid.tsx`: Lists products with filtering and image mapping

**Testing:**
- No test files present in codebase (no *.test.ts, *.spec.ts)
- No testing framework configured

## Naming Conventions

**Files:**
- React components: PascalCase (e.g., DemoBookingForm.tsx, ProductGrid.tsx)
- Pages: PascalCase with Page suffix (e.g., HomePage.tsx, ProductDetailPage.tsx)
- Hooks: camelCase with use prefix (e.g., useToast.ts, useMobile.tsx)
- Utilities: camelCase (e.g., queryClient.ts, utils.ts)
- UI primitives: kebab-case.tsx (e.g., alert-dialog.tsx, card.tsx) — from Shadcn/ui convention
- Database tables: camelCase in code, snake_case in PostgreSQL (e.g., demoBookings table → demo_bookings in schema.ts)

**Functions:**
- React components: PascalCase (export default function HomePage() {})
- Hooks: camelCase with use prefix (function useToast() {})
- Utilities: camelCase (export function apiRequest() {})
- API routes: kebab-case in path (POST /api/demo-bookings)

**Variables:**
- Component props: PascalCase for types (interface DemoBookingFormProps), camelCase for values
- Constants: camelCase or UPPER_SNAKE_CASE (const queryClient = new QueryClient())
- Private class members: no underscore prefix (JS convention, not TypeScript private keyword)

**Types:**
- Interfaces: PascalCase (interface IStorage, interface DemoBookingFormProps)
- Type aliases: PascalCase (type InsertDemoBooking = z.infer<typeof insertDemoBookingSchema>)
- Enum: PascalCase (not used in codebase)
- Zod schemas: camelCase (insertDemoBookingSchema)

## Where to Add New Code

**New Feature (e.g., Financing Calculator):**
- UI Component: `client/src/components/FinancingCalculator.tsx`
- New Routes: Add handlers to `server/routes.ts`
- Database Schema: Extend table definitions in `shared/schema.ts`, create Zod schemas
- Page (if route-level): `client/src/pages/FinancingPage.tsx`
- Styling: Use Tailwind classes, component styles in component files

**New Page:**
- Create `client/src/pages/NewPageName.tsx` exporting default function
- Add route to Wouter Switch in `client/src/App.tsx`
- Import layout components (Header, Footer) and feature components as needed
- Use useQuery hooks to fetch data from `/api/*` endpoints

**New Component (shared feature):**
- Create `client/src/components/ComponentName.tsx`
- Export named function matching file name
- Use Radix UI primitives from `client/src/components/ui/`
- Define PropTypes interface above component
- Use form components from `ui/form.tsx` for form inputs

**New Utility:**
- Client utilities: `client/src/lib/newUtility.ts`
- Server utilities: `server/lib/newUtility.ts`
- Shared utilities: Add to `shared/` directory

**New API Endpoint:**
- Add route handler to `server/routes.ts` (GET/POST/PATCH/DELETE)
- Add method to IStorage interface and DatabaseStorage class in `server/storage.ts`
- Add table definition and Zod schema to `shared/schema.ts` if new data type
- On client: use useQuery (GET) or useMutation (POST/PATCH/DELETE) with queryKey matching path
- Validate input with Zod on both sides

**New Database Table:**
- Add pgTable definition to `shared/schema.ts`
- Add Zod insert schema (omit auto-generated fields)
- Export TypeScript types
- Run `npm run db:push` to create migration and push to database
- Add storage methods to `server/storage.ts`
- Add API routes to `server/routes.ts`

## Special Directories

**client/public/:**
- Purpose: Static files served as-is in production
- Generated: No
- Committed: Yes
- Contents: Product images, icons, videos (referenced with leading / in HTML)

**dist/:**
- Purpose: Build output directory
- Generated: Yes (from `npm run build`)
- Committed: No (.gitignore)
- Contents: Built client (`dist/public/`), bundled server (`dist/index.js`)

**node_modules/:**
- Purpose: Installed dependencies
- Generated: Yes (from npm install)
- Committed: No (.gitignore)
- Contents: All npm packages and their dependencies

**migrations/:**
- Purpose: Drizzle database migrations
- Generated: Yes (from `npm run db:push`)
- Committed: Yes (version control for schema)
- Contents: SQL migration files auto-generated from schema.ts changes

**.next/ (if present):**
- Purpose: Next.js build cache (not used in this project, uses Vite)
- Generated: N/A
- Committed: No

**.planning/codebase/:**
- Purpose: GSD analysis documents (ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, etc.)
- Generated: Yes (by GSD mapping agent)
- Committed: Yes
- Contents: Documentation for future development phases

---

*Structure analysis: 2026-04-07*
