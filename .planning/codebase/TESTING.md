# Testing Patterns

**Analysis Date:** 2026-04-08

## Test Framework

**Status:** No testing framework detected

**Findings:**
- `tsconfig.json` excludes test files: `"exclude": ["node_modules", "build", "dist", "**/*.test.ts"]`
- No test files found in codebase: Search for `*.test.ts`, `*.spec.ts`, `*.test.tsx`, `*.spec.tsx` returned no results
- No test configuration files: No `jest.config.*`, `vitest.config.*`, or test runner packages in `package.json`
- TypeScript strict mode enabled: `"strict": true` provides some type safety
- Schema validation via Zod provides runtime validation: Schemas in `shared/schema.ts` validate data shape

**Run Commands:**
```bash
# No test scripts defined in package.json
# Testing infrastructure not yet implemented
```

## Test File Organization

**Current State:** Not applicable - testing infrastructure not in place

**Recommended Pattern (based on project structure):**
- Location: Co-located with source files or parallel `__tests__` directory
- Naming convention would likely follow: `ComponentName.test.tsx` for components, `storage.test.ts` for services
- Test file location options:
  - Co-located: `client/src/components/ProductGrid.test.tsx`
  - Separate: `client/src/__tests__/components/ProductGrid.test.tsx`

## Test Structure

**Not Implemented**

**Recommended approach for this codebase:**

For React components:
```typescript
// Example structure (not currently used)
describe('ProductGrid', () => {
  it('should render products from API', () => {
    // test implementation
  });

  it('should handle loading state', () => {
    // test implementation
  });

  it('should filter products correctly', () => {
    // test implementation
  });
});
```

For server routes:
```typescript
describe('POST /api/demo-bookings', () => {
  it('should create a booking with valid data', () => {
    // test implementation
  });

  it('should validate required fields', () => {
    // test implementation
  });

  it('should send confirmation emails', () => {
    // test implementation
  });
});
```

For storage/database:
```typescript
describe('DatabaseStorage', () => {
  it('should retrieve product by slug', () => {
    // test implementation
  });

  it('should create inquiry with correct schema', () => {
    // test implementation
  });
});
```

## Mocking

**Framework:** Not determined - no testing framework in place

**Manual Validation Approach Currently Used:**
- Form validation via Zod schemas: `insertProductSchema.parse(req.body)` validates shape before processing
- Query string validation in routes: Example in `ProductGrid.tsx` - API is called and response validated
- No mocking library detected in dependencies

**What Would Be Mocked (when testing implemented):**
- API calls: `fetch()` responses in `queryClient.ts`
- React Query: Mock `useQuery` and `useMutation` hooks
- External services: Resend email client in `lib/resend.ts`
- Database: Storage layer would need mocking for unit tests
- File system: Video streaming logic in `index.ts` accesses filesystem

**Example Future Pattern:**
```typescript
// Potential mocking with vitest/jest
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock('./lib/resend', () => ({
  getUncachableResendClient: vi.fn(),
}));
```

## Fixtures and Factories

**Not Implemented**

**Data Currently Available:**
- `seed.ts`: Contains seed data for products and other entities
- Schema types in `shared/schema.ts`: Can be used to generate fixtures
- Hardcoded test data in components: `PartnershipsSection.tsx` has inline Partner data array

**Recommended Fixture Location (when testing added):**
- `client/src/__tests__/fixtures/`
- `server/__tests__/fixtures/`
- Or alongside test files: `*.fixtures.ts`

**Example from existing code:**
```typescript
// ProductGrid.tsx contains hardcoded image mappings
const imageMap: Record<string, string> = {
  "Quantum Systems Trinity Pro UAV Platform": productImage1,
  "Sony ILX-LR1 for Trinity Pro": productImage2,
  // ... more mappings
};

// PartnershipsSection.tsx has inline partner data
const partners: Partner[] = [
  {
    name: "Quantum Systems",
    description: "Multi-rotor drone...",
    specialties: ["Trinity Pro Platform", "VTOL Technology", "Long Range"],
  },
  // ... more partners
];
```

## Coverage

**Requirements:** Not enforced - no testing infrastructure in place

**Type Safety as Alternative:**
- TypeScript `strict: true` provides compile-time checking
- Zod schema validation provides runtime schema validation
- React Query types provide response type validation

**What Would Be Covered (when testing implemented):**

**High Priority:**
- Database storage operations: `DatabaseStorage` class methods
- API route validation: Zod schema parsing in routes
- Form submission flows: Quote, demo booking, inquiry forms
- Email generation: Demo booking and inquiry email templates
- Product filtering logic: `ProductGrid` component's filter functions

**Medium Priority:**
- Component rendering: ProductCard, ProductGrid with various props
- Error handling: Failed API calls, validation errors
- React Query operations: useQuery and useMutation flows
- Navigation: Routes in `App.tsx`

**Lower Priority:**
- UI library components: Shadcn primitives have their own tests
- Styling: Tailwind classes and CSS

## Test Types

**Not Currently Implemented**

**Recommended Approach:**

**Unit Tests:**
- Scope: Individual functions and component logic in isolation
- Approach: Test pure functions (formatPrice, etc.), storage methods, utilities
- Example candidates: `formatPrice()` function in `ProductGrid.tsx`, storage query methods

**Integration Tests:**
- Scope: API routes with database and validation
- Approach: Test full flow from request → validation → database → response
- Example candidates: POST `/api/demo-bookings`, POST `/api/inquiries` with email side effects

**E2E Tests:**
- Framework: Not currently used
- Recommended: Playwright or Cypress for full user workflows
- Example scenarios: Submit quote form → receive email → check admin notification

## Common Patterns

**Async Testing:**

Current async handling without tests:
```typescript
// From routes.ts - async route handlers
app.post("/api/demo-bookings", async (req, res) => {
  try {
    const validatedData = insertDemoBookingSchema.parse(req.body);
    const booking = await storage.createDemoBooking(validatedData);
    // ... send emails
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Invalid demo booking data" });
  }
});

// From QuotePage.tsx - mutation with async handler
const submitQuoteMutation = useMutation({
  mutationFn: async (data: QuoteFormData) => {
    return await apiRequest("POST", "/api/inquiries", payload);
  },
  onSuccess: () => {
    setSubmitted(true);
    form.reset();
  },
});
```

**When testing is added, recommended patterns:**
```typescript
// Vitest async test with timeout
it('should create demo booking and send emails', async () => {
  const result = await storage.createDemoBooking(testData);
  expect(result.id).toBeDefined();
  expect(mockEmailClient.send).toHaveBeenCalled();
}, { timeout: 5000 });

// React Testing Library with async utilities
it('should submit quote form', async () => {
  const { getByRole } = render(<QuotePage />);
  await userEvent.type(getByRole('textbox', { name: /name/i }), 'John');
  await userEvent.click(getByRole('button', { name: /submit/i }));
  await waitFor(() => {
    expect(screen.getByText(/received/i)).toBeInTheDocument();
  });
});
```

**Error Testing:**

Current error handling patterns:
```typescript
// Schema validation catches invalid data
try {
  const validatedData = insertProductSchema.parse(req.body);
} catch (error) {
  res.status(400).json({ error: "Invalid product data" });
}

// Try-catch in async operations
try {
  const result = await client.emails.send(emailData);
  console.log("[RESEND] ... sent successfully:", result);
} catch (emailError: any) {
  console.error("[RESEND ERROR] Failed to send...");
  console.error("[RESEND ERROR] Error details:", emailError);
}
```

**Recommended testing approach:**
```typescript
// Test validation errors
it('should reject invalid product data', async () => {
  const invalidData = { name: '' }; // missing required fields
  const response = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(invalidData),
  });
  expect(response.status).toBe(400);
  const error = await response.json();
  expect(error.error).toBe('Invalid product data');
});

// Test external service failures
it('should handle email service failure gracefully', async () => {
  vi.mocked(getUncachableResendClient).mockRejectedValueOnce(
    new Error('Service unavailable')
  );
  const response = await fetch('/api/demo-bookings', {
    method: 'POST',
    body: JSON.stringify(validBookingData),
  });
  // Booking still created even if email fails
  expect(response.status).toBe(201);
});
```

## Testing Priorities for Implementation

**Immediate (Critical Path):**
1. Database operations in `server/storage.ts` - all CRUD methods
2. API route validation - schema parsing for demo bookings, inquiries, products
3. Form submission flows - QuotePage, DemoPage, ContactPage

**High Priority:**
4. Email generation and sending - demo booking and inquiry emails
5. Product filtering logic - ProductGrid component filters and sorting
6. Auth/authentication flows - if implemented in future

**Medium Priority:**
7. Component rendering - ProductCard, sections with various states
8. React Query integration - mock API responses in tests
9. Navigation - Route matching and redirects

---

*Testing analysis: 2026-04-08*
