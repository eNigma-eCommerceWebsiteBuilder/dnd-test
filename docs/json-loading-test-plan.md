# Test Plan: Loading AST Parser JSON into Puck Editor (dnd-test)

## Goal

Validate that `puck-homepage-default.json` can be loaded into dnd-test's Puck editor as a starting point — all 9 homepage sections visible, editable, and rendering.

## Strategy

The user copies the 9 section components + their sub-component dependencies from eNigma into dnd-test. We create **mock modules** for the heavy `lib/` dependencies (analytics, hooks, actions) that would otherwise require copying 50+ files and wiring 5+ context providers. We rewrite the Puck config with 9 adapter entries that map flat JSON props → nested component props + inject placeholder data for AST-stripped fields.

## What Already Exists in dnd-test (Reusable)

| Asset | Status |
|-------|--------|
| `@puckeditor/core` v0.22.0 | Installed |
| `app/editor/page.jsx` | Working — no changes needed |
| `app/api/pages/route.ts` | Working |
| `app/api/pages/[slug]/route.ts` | Working |
| `app/page/[slug]/page.tsx` (render route) | Working |
| `lib/page-data.ts` | Working — needs seed fallback added |
| `lib/utils/cn.ts` | Present |
| `lib/utils/formatters/` | Partial — missing `stock.ts` |
| `lib/utils/promotions/` | Partial — missing `format.ts`, some functions |
| `lib/api/types/` | Partial — missing `collections.ts` |
| `lib/content.ts` | Present (full copy from eNigma) |
| Tailwind theme in `globals.css` | Present |

---

## Step 1: User Copies Component Files from eNigma → dnd-test

Copy these specific files (not entire folders — copying whole folders brings in components with unresolvable dependencies like `@/lib/stores/`, `@/lib/api/services/`):

### `components/home/` (overwrite existing)
- `PromotionBanner.tsx`
- `HeroSection.tsx` (overwrite existing copy)
- `CategoryHighlights.tsx`
- `FeaturedProductsGrid.tsx`
- `CuratedCollectionSection.tsx`
- `InspirationSection.tsx`
- `TrustBadges.tsx`
- `NewsletterSignup.tsx`

### `components/ui/` (new folder — create it)
- `CountdownTimer.tsx`
- `ProductCard.tsx`
- `ProductCardDetails.tsx`
- `ProductCardMedia.tsx`
- `productCardUtils.ts`

### `components/promotions/` (add to existing)
- `UrgencyBadge.tsx`

### `components/collections/` (new folder — create it)
- `ProductHotspot.tsx` **only** (self-contained: imports only Link, useState, cn)

### `components/testimonials/` (overwrite existing)
- `TestimonialsSection.tsx`
- `TestimonialGrid.tsx`
- `TestimonialStats.tsx`
- `RatingDistribution.tsx`
- `TestimonialCard.tsx` (overwrite existing copy)

---

## Step 2: User Copies Lib Files from eNigma → dnd-test

### `lib/api/types/` (add to existing)
- `collections.ts` — type definitions for `CuratedCollection`, `InspirationCollection` (pure types, no runtime deps)

### `lib/utils/promotions/` (overwrite entire directory)
Overwrite dnd-test's `lib/utils/promotions/` with eNigma's version. eNigma's is a superset:
- `index.ts` — exports all functions + types
- `format.ts` — `formatTimeRemaining`, `getPromotionUrgency` (missing in dnd-test)
- `timing.ts` — `calculateTimeRemaining`, `getPromotionProgress`, `isPromotionActive`, `isPromotionExpiringSoon` (dnd-test only has first two)
- `types.ts` — `TimeRemaining`, `PromotionUrgency`, `TimeRemainingFormat`, `TimeRemainingFormatValue`

Needed by: `PromotionBanner` → `UrgencyBadge`, `CountdownTimer`

### `lib/utils/formatters/stock.ts` (add to existing)
Copy this single file. Contains `formatStockStatus` function and `StockStatusResult`, `ProductWithStock` types.

Needed by: `ProductCard` (calls `formatStockStatus`), `ProductCardDetails` (imports `StockStatusResult` type)

---

## Step 3: We Create Mock Modules

These modules have deep dependency chains (Zustand stores, server actions, API endpoints, context providers). Mocking is far simpler than copying 50+ files.

### 3.1: `lib/analytics/index.ts` — Mock

Replaces the entire `lib/analytics/` directory. Exports everything the copied components import:

```ts
'use client';
import { ReactNode, createContext, useContext } from 'react';

// No-op analytics context
const AnalyticsContext = createContext({
  trackEvent: async () => {},
  trackEvents: async () => {},
  clearSession: () => {},
});

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  return <AnalyticsContext.Provider value={AnalyticsContext._currentValue}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}

// Simple pass-through — renders children, no tracking
export function ProductImpressionTracker({ children }: { children: ReactNode; listName?: string }) {
  return <>{children}</>;
}

// No-op components
export function PageViewTracker() { return null; }
export function LiveVisitorTracker() { return null; }

// Hooks
export function useProductView() {}
export function useSearchTracking() {}

// Constants
export const DEFAULT_LIVE_VISITOR_INTERVAL_MS = 30000;
export const DEFAULT_PRODUCT_IMPRESSION_ROOT_MARGIN = '200px';
export const DEFAULT_PRODUCT_IMPRESSION_THRESHOLD = 0.1;

// Enum stub
export const AnalyticsInteraction = {
  PRODUCT_IMPRESSION: 'product_impression',
  PRODUCT_CLICK: 'product_click',
  PAGE_VIEW: 'page_view',
} as const;
```

**Why mock:** Real analytics requires `lib/analytics/core/dispatcher.ts` → `lib/actions/content-tracking/tracking-actions` → server actions that call API endpoints. The dispatcher has try/catch (won't crash), but the import chain alone requires 15+ files. Mock eliminates all of that.

**Needed by:** `FeaturedProductsGrid` (imports `ProductImpressionTracker`)

### 3.2: `lib/hooks/index.ts` — Mock

Replaces the entire `lib/hooks/` directory. Exports no-op versions of every hook the copied components use:

```ts
'use client';
import { ReactNode } from 'react';

// Toast
export type ToastType = 'success' | 'error' | 'info';
export interface Toast { id: string; type: ToastType; message: string; }
export interface ToastOptions { type?: ToastType; duration?: number; }
export interface ToastContextValue {
  success: (msg: string, opts?: ToastOptions) => void;
  error: (msg: string, opts?: ToastOptions) => void;
  info: (msg: string, opts?: ToastOptions) => void;
  removeToast: (id: string) => void;
}
export function ToastProvider({ children }: { children: ReactNode }) { return <>{children}</>; }
export function ToastContainer() { return null; }
export function useToast(): ToastContextValue {
  return { success: () => {}, error: () => {}, info: () => {}, removeToast: () => {} };
}

// Auth
export interface User { id: string; email?: string; name?: string; }
export interface AuthUser extends User {}
export interface UseAuthReturn {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}
export function AuthProvider({ children }: { children: ReactNode }) { return <>{children}</>; }
export function useAuth(): UseAuthReturn {
  return { user: null, status: 'unauthenticated' };
}
export function useAuthContext() { return useAuth(); }
export function useRequireAuth() { return useAuth(); }
export function useUserProfile() { return { profile: null, loading: false }; }
export function useUpdateProfile() { return { update: async () => {}, loading: false }; }
export function useUserAddresses() { return { addresses: [], loading: false }; }

// Cart
export interface CartItem { _id: string; quantity: number; }
export interface Cart { items: CartItem[]; total: number; }
export interface UseCartReturn {
  cart: Cart | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  isPending: boolean;
  error: string | null;
  addItem: async (id: string, qty?: number) => void;
  updateItem: async (id: string, qty: number) => void;
  removeItem: async (id: string) => void;
  clearCart: async () => void;
  getItemQuantity: (id: string) => number;
  isInCart: (id: string) => boolean;
}
export function useCart(_autoLoad?: boolean): UseCartReturn {
  return {
    cart: null, items: [], totalItems: 0, totalPrice: 0,
    loading: false, isPending: false, error: null,
    addItem: async () => {}, updateItem: async () => {},
    removeItem: async () => {}, clearCart: async () => {},
    getItemQuantity: () => 0, isInCart: () => false,
  };
}
export function useCartCount() { return { count: 0, loading: false }; }

// Wishlist
export interface UseWishlistReturn {
  items: string[];
  addItem: async (id: string) => void;
  removeItem: async (id: string) => void;
  isInWishlist: (id: string) => boolean;
}
export function useWishlist(): UseWishlistReturn {
  return { items: [], addItem: async () => {}, removeItem: async () => {}, isInWishlist: () => false };
}
export function useWishlistItem() { return { inWishlist: false, toggle: async () => {} }; }
export function useWishlistBulk() { return { addBulk: async () => {} }; }
export function useWishlistShare() { return { share: async () => '' }; }
export function useWishlistNotifications() { return { settings: null, update: async () => {} }; }
```

**Why mock:** Real `useCart` uses `@/lib/stores/cart-store` (Zustand). Real `useWishlist` uses `@/lib/stores/wishlist-store`. Real `useToast` needs `ToastProvider` context with state management. Real `AuthProvider` calls `next-auth`. Copying all of this would require 30+ files and wrapping the layout in 4+ providers.

**Needed by:** `ProductCard` (imports `useCart`, `useToast`, `useWishlist`)

### 3.3: `lib/actions/newsletter-actions.ts` — Mock

```ts
'use server';

export interface ActionState { success?: boolean; error?: string; message?: string; }

export async function subscribeToNewsletter(
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  return { success: true, message: 'Subscribed successfully (mock).' };
}
```

**Why mock:** Real action imports from `@/lib/actions/newsletter/actions` → `@/lib/actions/internal/unsupported` → `@/lib/actions/types`. The real action returns an "unsupported" message anyway.

**Needed by:** `NewsletterSignup` (imports `subscribeToNewsletter`)

### 3.4: `lib/utils/ecommerce/index.ts` — Mock

Simple pure functions — implement directly rather than copying the real files (which pull in 10+ type dependencies):

```ts
import type { Testimonial } from '@/lib/api/types/testimonials';

export function groupTestimonialsByRating(
  testimonials: Testimonial[],
): Record<number, Testimonial[]> {
  return testimonials.reduce((acc, t) => {
    if (!acc[t.rating]) acc[t.rating] = [];
    acc[t.rating].push(t);
    return acc;
  }, {} as Record<number, Testimonial[]>);
}

export function getTestimonialRatingPercentage(
  testimonials: Testimonial[],
  rating: number,
): number {
  if (testimonials.length === 0) return 0;
  const count = testimonials.filter((t) => t.rating === rating).length;
  return Math.round((count / testimonials.length) * 100);
}

export function getTestimonialsByPlatform(
  testimonials: Testimonial[],
  _platform: string,
): Testimonial[] {
  return testimonials;
}

// Type re-exports that CuratedProductDisplay imports (not used, but needed for typecheck)
export type { CuratedCollection as CuratedCollectionUtil } from '@/lib/api/types/collections';
```

**Needed by:** `TestimonialsSection` (`groupTestimonialsByRating`), `RatingDistribution` (`getTestimonialRatingPercentage`)

### 3.5: `lib/utils/index.ts` — Barrel (new file)

dnd-test has no `lib/utils/index.ts`. Two copied files import from `@/lib/utils`:
- `ProductCardDetails`: `import type { FormattedPrice, StockStatusResult } from '@/lib/utils'`
- `productCardUtils`: `import type { FormattedPrice } from '@/lib/utils'`

```ts
export { cn, clsx, twMerge } from './cn';
export * from './formatters';
export * from './promotions';
export * from './ecommerce';
```

This re-exports everything from the sub-modules. The `formatters` barrel will provide `FormattedPrice` and `StockStatusResult`.

---

## Step 4: We Update Existing Files

### 4.1: `lib/api/types/index.ts` — Add collections export

Add `export * from './collections';` to the existing barrel.

### 4.2: `lib/utils/formatters/index.ts` — Add stock exports

Add these lines:
```ts
export { formatStockStatus } from './stock';
export type { ProductWithStock, StockStatusResult } from './stock';
```

### 4.3: `next.config.ts` — Add image domain

Add `lh3.googleusercontent.com` to `remotePatterns` (used by HeroSection and InspirationSection background images via CSS, and potentially by next/image in placeholder data):

```ts
{
  protocol: 'https',
  hostname: 'lh3.googleusercontent.com',
},
```

### 4.4: `app/layout.tsx` — Add AnalyticsProvider

Import the mock `AnalyticsProvider` and wrap children:

```tsx
import { AnalyticsProvider } from "@/lib/analytics";

// In the body:
<body className="min-h-full flex flex-col">
  <AnalyticsProvider>{children}</AnalyticsProvider>
</body>
```

No `<Suspense>` needed — our mock AnalyticsProvider doesn't use `useSearchParams()`.

### 4.5: `lib/puck-components.jsx` — Complete Rewrite (9 entries)

This is the core work. Each entry maps flat JSON props → nested component props + injects placeholder data.

**Entry 1: PromotionBanner** — JSON has `{ id }` only (all props stripped)
- Fields: `title`, `subtitle`, `ctaText`, `ctaLink` (basic editable fields)
- Render: Hardcode a fake active `Promotion` object (dates set to always-active range)

**Entry 2: HeroSection** — JSON has `{ title, subtitle, ctaPrimary, ctaSecondary, backgroundImage, imageAlt }`
- Fields: 6 text fields matching JSON prop names
- Render: Build `HeroContent` from flat props + fake `HeroProduct` (name from a new `productName` field, images from `backgroundImage`)

**Entry 3: CategoryHighlights** — JSON has `{ header, subheader, ctaLabel }` (categories array stripped)
- Fields: 3 text fields
- Render: Build `CategoryHighlightsContent` + 3 placeholder `Category` objects with unsplash images

**Entry 4: FeaturedProductsGrid** — JSON has `{ header, subheader }` (products array stripped)
- Fields: 2 text fields
- Render: Build `FeaturedProductsContent` + 4 placeholder `Product` objects (with all required Product fields: `_id`, `name`, `slug`, `price`, `images`, `inStock`, `stock`, `isActive`, `createdAt`, `updatedAt`)

**Entry 5: CuratedCollectionSection** — JSON has `{ collection: "featuredCollection", eyebrow, ctaText }` (identifier leak + collection stripped)
- Fields: `eyebrow`, `ctaText` (ignore the `collection` string)
- Render: Build `CuratedCollectionContent` + fake `CuratedCollection` (with `mainProduct` and `relatedProducts`)

**Entry 6: InspirationSection** — JSON has `{ header, subheader, description, ctaText, image, alt, hotspots: [...] }`
- Fields: 6 text fields + `hotspots` array field
- Render: Build `InspirationContent` from flat props + fake `InspirationCollection` (products synced to hotspot titles/prices)

**Entry 7: TestimonialsSection** — JSON has `{ title, subtitle }` (testimonials array stripped)
- Fields: `title`, `subtitle`
- Render: Pass title/subtitle directly + 3 placeholder `Testimonial` objects

**Entry 8: NewsletterSignup** — JSON has `{ title, description, disclaimer }`
- Fields: `title` (text), `description` (textarea), `disclaimer` (textarea)
- Render: Build `NewsletterContent` from flat props

**Entry 9: TrustBadges** — JSON has `{ badges: [...] }`
- Fields: `badges` array field (with `arrayFields`: icon, title, subtitle)
- Render: Direct pass-through (`badges` prop shape matches component exactly)

### 4.6: `lib/page-data.ts` — Add seed fallback

Add a seed file fallback to `getPageBySlug`:

```ts
const seedDir = path.join(process.cwd(), "data", "seeds");

export async function getPageBySlug(slug: string): Promise<PageEntry | undefined> {
  const pages = await getAllPages();
  const saved = pages.find((p) => p.slug === slug);
  if (saved) return saved;

  // Fallback to seed file
  try {
    const seedContent = await fs.readFile(path.join(seedDir, `${slug}.json`), "utf-8");
    return { slug, data: JSON.parse(seedContent) };
  } catch {
    return undefined;
  }
}
```

### 4.7: `data/seeds/home.json` — Create

Copy `eNigma-TemplateFrontend/puck-homepage-default.json` to `dnd-test/data/seeds/home.json`.

### 4.8: `data/pages.json` — Clear

Replace contents with `[]` to remove old test data (HeroSection + PriceDisplay + TestimonialCard).

---

## Step 5: Test

```bash
cd dnd-test
npm run dev
```

### Verification Checklist

1. **Dev server starts** — no compilation errors, no unresolvable imports
2. **Open `http://localhost:3000/editor?slug=home`** — editor loads
3. **9 sections appear in the canvas** in order:
   - PromotionBanner (hardcoded promo, always active)
   - HeroSection (title/subtitle/CTAs from JSON, placeholder product)
   - CategoryHighlights (header/subheader from JSON, 3 placeholder categories)
   - FeaturedProductsGrid (header/subheader from JSON, 4 placeholder products)
   - CuratedCollectionSection (eyebrow/ctaText from JSON, placeholder collection)
   - InspirationSection (all content from JSON, placeholder collection synced to hotspots)
   - TestimonialsSection (title/subtitle from JSON, 3 placeholder testimonials)
   - NewsletterSignup (title/description/disclaimer from JSON)
   - TrustBadges (badges array from JSON — direct match)
4. **Click a section** — right panel shows editable fields matching JSON prop names
5. **Edit a field** — canvas updates live
6. **Click Publish** — `data/pages.json` is written
7. **Open `http://localhost:3000/page/home`** — all 9 sections render
8. **Refresh editor** — saved data loads from `data/pages.json` (not seed)
9. **Delete `data/pages.json`, refresh** — seed data loads from `data/seeds/home.json`

---

## Dependency Chain Summary

```
PromotionBanner
  ├── UrgencyBadge → @/lib/utils/promotions (getPromotionUrgency, isPromotionExpiringSoon)
  └── CountdownTimer → @/lib/utils/promotions (calculateTimeRemaining, formatTimeRemaining)

HeroSection → @/lib/api/types (HeroProduct), @/lib/content (HeroContent)

CategoryHighlights → @/lib/api/types (Category), @/lib/content (CategoryHighlightsContent)

FeaturedProductsGrid
  ├── ProductCard → @/lib/hooks (useCart, useToast, useWishlist) [MOCK]
  │   ├── ProductCardDetails → @/lib/utils (FormattedPrice, StockStatusResult) [NEW BARREL]
  │   ├── ProductCardMedia → next/image
  │   └── productCardUtils → @/lib/utils (FormattedPrice) [NEW BARREL]
  └── ProductImpressionTracker → @/lib/analytics [MOCK]

CuratedCollectionSection
  ├── @/lib/api/types (CuratedCollection) [NEW FILE: collections.ts]
  ├── @/lib/content (CuratedCollectionContent)
  └── ProductCard → (same chain as above)

InspirationSection
  ├── ProductHotspot → next/link, useState, cn (self-contained)
  ├── @/lib/api/types (InspirationCollection) [NEW FILE: collections.ts]
  ├── @/lib/content (InspirationContent)
  └── @/lib/utils/formatters (formatPrice) [EXISTS]

TestimonialsSection
  ├── TestimonialStats → @/lib/utils/formatters (formatRating) [EXISTS]
  ├── RatingDistribution → @/lib/utils/ecommerce (getTestimonialRatingPercentage) [MOCK]
  ├── TestimonialGrid → TestimonialCard → @/lib/utils/formatters (formatRating, formatRelativeTime) [EXISTS]
  └── @/lib/utils/ecommerce (groupTestimonialsByRating) [MOCK]

NewsletterSignup → @/lib/actions/newsletter-actions (subscribeToNewsletter) [MOCK]

TrustBadges → @/lib/content (TrustBadgeContent) [EXISTS]
```

## Known Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| `ProductCard` crashes with placeholder data | Medium | Use complete Product objects with all required fields |
| Missing formatters (formatStockStatus) | Fixed | Copy `stock.ts` in Step 2 |
| Missing promotion utils | Fixed | Overwrite `promotions/` in Step 2 |
| Mock hooks return wrong shape | Low | Match interface signatures from real hooks |
| `next/image` rejects `lh3.googleusercontent.com` URLs | Medium | Add domain to next.config OR use unsplash URLs for placeholders |
| Typecheck errors from copied files | Medium | Only copy files listed above; don't copy entire folders |
| Editor wrapped in dnd-test's simple layout (no header/footer) | None | Not a problem — dnd-test layout is minimal by design |
