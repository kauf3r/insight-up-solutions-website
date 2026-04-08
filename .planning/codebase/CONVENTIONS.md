# Coding Conventions

**Analysis Date:** 2026-04-08

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `ProductGrid.tsx`, `QuotePage.tsx`, `PartnershipsSection.tsx`)
- UI library components: lowercase with hyphens (e.g., `card.tsx`, `alert-dialog.tsx`, `input-otp.tsx`)
- Server files: camelCase (e.g., `index.ts`, `routes.ts`, `storage.ts`, `resend.ts`)
- Utility/lib files: camelCase (e.g., `queryClient.ts`, `utils.ts`)

**Functions:**
- camelCase (e.g., `formatPrice()`, `throwIfResNotOk()`, `getUncachableResendClient()`)
- React components are named with PascalCase: `default function ProductGrid()`, `export default function QuotePage()`
- Event handlers prefixed with "on" or descriptive verb: `onClick`, `onSuccess`, `onError`, `handleSubmit`

**Variables:**
- camelCase (e.g., `apiProducts`, `formattedKey`, `displayProducts`)
- Type/interface suffixes: `Props`, `FormData`, `Schema` (e.g., `ProductGridProps`, `QuoteFormData`)
- Constants in UPPER_SNAKE_CASE when truly constant across code (e.g., `DATABASE_URL`)
- State variables follow camelCase: `isLoading`, `error`, `submitted`

**Types:**
- Interfaces: PascalCase (e.g., `IStorage`, `Partner`, `ProductGridProps`)
- Type unions: Inferred from context (e.g., `UnauthorizedBehavior = "returnNull" | "throw"`)
- Database types imported with capitalized names: `Product`, `User`, `DemoBooking`, `Inquiry`, `BundleLead`

## Code Style

**Formatting:**
- No explicit formatter detected (no ESLint, Prettier, or Biome config)
- Indentation: 2 spaces (observed in all files)
- Line length: Files vary but generally keep lines under 100 characters
- Semicolons: Used consistently throughout
- Quote style: Double quotes for strings (observed in imports, JSX, and object literals)

**Linting:**
- Not detected in configuration files
- Code follows TypeScript strict mode: `"strict": true` in `tsconfig.json`
- Type safety is enforced: explicit type annotations on function parameters and returns

**Import Patterns:**
- Type imports use explicit `import type` syntax: `import type { Express } from "express"`
- Path aliases used: `@/` for client source, `@shared/` for shared modules, `@assets/` for assets
- Relative imports used for local server modules (e.g., `./routes`, `./storage`)

## Import Organization

**Order:**
1. External dependencies (React, libraries): `import React from "react"`, `import { useQuery } from "@tanstack/react-query"`
2. Type imports: `import type { Express } from "express"`
3. Internal shared modules: `import { insertProductSchema } from "@shared/schema"`
4. Local components/utilities: `import { Button } from "@/components/ui/button"`
5. Local services: `import { storage } from "./storage"`

**Path Aliases:**
- `@/*` → `./client/src/*` (client components, pages, utilities)
- `@shared/*` → `./shared/*` (shared schemas, types)
- `@assets/*` → `./attached_assets/*` (static assets)

**No barrel files detected** - imports are specific to individual files

## Error Handling

**Patterns:**
- Try-catch blocks for async operations: Seen in routes and API handlers
- Error propagation in fetch calls: `throwIfResNotOk()` function validates response status before processing
- Catch blocks often log errors before responding: `catch (error) { res.status(500).json({ error: "..." }) }`
- Promise rejections caught in mutation handlers: `onError: (error) => { console.error(...) }`
- Form validation errors handled via react-hook-form + zod: Schema validation before API submission

**Example patterns from codebase:**
```typescript
// fetch error handling
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// route error handling
try {
  const validatedData = insertProductSchema.parse(req.body);
  const product = await storage.createProduct(validatedData);
  res.status(201).json(product);
} catch (error) {
  res.status(400).json({ error: "Invalid product data" });
}

// mutation error handling
onError: (error) => {
  console.error("Quote submission failed:", error);
}
```

## Logging

**Framework:** console (console.log, console.error)

**Patterns:**
- Categorized log messages with prefixes: `[DEMO BOOKING]`, `[RESEND]`, `[RESEND ERROR]`, `[INQUIRY]`
- Used for tracking operations: `console.log(`[DEMO BOOKING] Created booking for ${booking.email}`)`
- Used for debugging email operations: Multiple logs track email send attempts and failures
- Error logs with structured context: `console.error("[RESEND ERROR] Failed to send...", error)`
- Client-side logging minimal: Only in error handlers and mutation callbacks

**Structure:**
```typescript
// Prefixed console logs in server routes
console.log(`[DEMO BOOKING] Created booking for ${booking.email}`);
console.log(`[RESEND] Sending demo booking confirmation to ${emailData.to}`);
console.error("[RESEND ERROR] Failed to send demo booking confirmation email");
console.error("[RESEND ERROR] Error details:", emailError);
```

## Comments

**When to Comment:**
- TODO comments for unfinished work: `// TODO: Replace with real partner data when available` (in `PartnershipsSection.tsx`)
- Inline comments for complex logic: Very minimal use observed
- Comments explaining business logic: Seen in routes explaining auto-population and email workflows
- Comments above code sections explaining purpose: `// Video streaming middleware with range request support`

**Documentation:**
- No JSDoc/TSDoc patterns detected in the codebase
- Types and interfaces defined inline with minimal documentation
- Component props documented via TypeScript interfaces

## Function Design

**Size:**
- Functions generally keep business logic focused
- Route handlers average 20-30 lines for simple CRUD, up to 80+ lines for complex operations with side effects
- Utility functions are small and single-purpose: `formatPrice()` is 5 lines, `cn()` is 3 lines

**Parameters:**
- Explicit typed parameters: `async function registerRoutes(app: Express): Promise<Server>`
- Destructuring common in React components: `{ title = "...", showViewAll = true, ... }`
- Default values provided in function signatures

**Return Values:**
- Explicit return types specified: `Promise<Product[]>`, `Promise<User | undefined>`
- Functions that modify state return the modified entity: `createProduct()` returns the created Product
- API handlers return JSON or redirect via `res.json()`, `res.status().json()`
- Query handlers use React Query's mutation pattern: return Promise that resolves to API response

## Module Design

**Exports:**
- Default exports for page components: `export default function QuotePage()`
- Named exports for utilities: `export async function apiRequest()`, `export const queryClient`
- Named exports for components: `export { storage }`
- Service classes instantiated and exported: `export const storage = new DatabaseStorage()`

**Interface Pattern:**
- Storage layer uses interface pattern: `interface IStorage` defines contract, `class DatabaseStorage implements IStorage`
- Enables abstraction and testability
- Clean separation between data access and business logic

**Server Structure:**
- `index.ts`: Express app setup, middleware, server listening
- `routes.ts`: API endpoints, request handling, validation
- `storage.ts`: Data access layer, database operations
- `lib/resend.ts`: External service client management

**Client Structure:**
- `App.tsx`: Router and top-level providers
- `pages/`: Page components (QuotePage, ProductsPage, etc.)
- `components/`: Reusable components (ProductGrid, PartnershipsSection, etc.)
- `components/ui/`: Shadcn UI primitive components
- `lib/`: Utilities (queryClient, utils, hooks)
- `hooks/`: Custom React hooks (use-toast)

---

*Convention analysis: 2026-04-08*
