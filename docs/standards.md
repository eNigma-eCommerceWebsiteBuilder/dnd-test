# Component Standard for Puck Integration

## Purpose

This document defines a binding contract between display components and the Puck config generation script. Components that follow this standard can be automatically processed into Puck editor configs with **zero manual adapter code** and **zero human judgment**.

**Yes — any component that conforms to this standard will be automatically picked up by the script and have its Puck config generated. No manual intervention required.**

---

## Scope

### In scope (~40-50 components)

Components whose primary purpose is to **display content visually** — sections, cards, banners, grids, galleries, badges, text blocks, hero units, testimonials, newsletters.

### Out of scope (~285 components)

| Type | Examples | Why excluded |
|------|----------|-------------|
| Interactive forms | AddressForm, PaymentMethodSelector, PromoCodeInput | Stateful user input, not visual content |
| Buttons tied to stores | AddToCartButton, WishlistButton, RemoveButton | Runtime state dependencies |
| Modals/drawers | AddAddressModal, MiniCartDrawer, CancelModal | Overlay UI, not page content |
| Skeletons | CartSkeleton, ProductGridSkeleton, CheckoutSkeleton | Loading states |
| Client orchestrators | CheckoutPageClient, CartPageClient, SubscriptionListClient | Page-level flow controllers |
| Filters/sorting | ProductFilters, SortDropdown, PriceRangeSlider | Interactive controls |
| Utility files (.ts) | addressFormUtils, productCardUtils | Not components |

A component is in scope if and only if it satisfies **all three** tests:

1. **Render test** — it produces visible page content from props alone
2. **Data test** — it does not require runtime data fetching, store reads, or API calls
3. **Interaction test** — it does not contain form state, event handlers that mutate external state, or client-only hooks

---

## The Container / View Split

Components that contain business logic (date checks, null gating, data mapping) must be split into two files. Components that are already pure presentation skip this step.

### When the split is required

A component needs splitting if it does **any** of the following:

- Returns `null` based on a prop being falsy or a business rule (e.g., `isPromotionActive(promotion)`)
- Receives a nested domain object (e.g., `Promotion`, `Product`, `Testimonial`) and extracts fields from it internally
- Calls utility functions to transform data before rendering (e.g., `formatProductPrice()`, `formatRating()`)
- Contains conditional logic that depends on infrastructure state

### When the split is NOT required

A component skips the split if it already:

- Accepts flat scalar props (string, number, boolean)
- Renders directly from those props with no transformation
- Has no null-gating based on business rules

`PriceDisplay` is an example — it already takes flat props (`price`, `salePrice`, `isOnSale`, `size`). It only needed Puck metadata added.

### The split pattern

```
components/
  promotions/
    PromotionBar.tsx          ← Container (unchanged interface for routes)
    PromotionBarView.tsx      ← View (flat props + Puck metadata, for editor)
```

**Container** — keeps the original name, original props, and original business logic. Routes continue to import and use this file unchanged. It delegates rendering to the View after performing its logic and data mapping.

**View** — the new file. Accepts only flat scalar props. Contains the JSX. Exports Puck metadata. This is what the script reads and what Puck renders.

---

## View Component Requirements

A View file must export exactly **five named exports** plus the component itself, with one optional export:

### Required exports

| Export | Type | Purpose |
|--------|------|---------|
| `puckComponentName` | `string` | The config key that links AST parser JSON `type` to this Puck config entry. Must match the JSX tag name used in `page.tsx` (e.g., `"HeroSection"`, `"PromotionBanner"`) |
| `puckLabel` | `string` | Human-readable name shown in Puck's component drawer |
| `puckCategory` | `string` | Drawer grouping (e.g., `"Home"`, `"Products"`, `"Marketing"`) |
| `puckFields` | `Record<string, FieldDef>` | Puck field definitions, one per editable prop |
| `puckDefaults` | `Record<string, value>` | Default prop values when component is dragged onto canvas |

### Optional exports

| Export | Type | Purpose |
|--------|------|---------|
| `puckSeedData` | `Record<string, value>` | Placeholder data for props that the AST parser strips (data-derived props like arrays of products, categories, testimonials). Keys must NOT overlap with `puckFields` keys — seed data fills gaps that aren't editable. The seed post-processor merges this into the generated seed JSON where the parser left gaps. In production, `puckDataFetcher` overrides these with real data. |
| `puckDataFetcher` | `async (props, context?) => Promise<Partial<Props>>` | Async function that fetches real API data on the server. Called only by the server config's render function in the published page render route. If it throws, the component falls back to seed/default props. Must return a partial props object whose keys merge with (and override) the component's existing props. The `context` parameter receives `{ searchParams?: Record<string, string> }` from the current URL. |

### Component export

The View component itself can be a named export or default export. The script checks for a default export first, then falls back to a named export matching the filename (without the `View` suffix).

### Props interface

The View component must accept **only flat scalar props** that correspond exactly to the keys in `puckFields`. No nested objects, no domain types, no arrays of domain objects.

Allowed prop types:
- `string`
- `number`
- `boolean`
- `string` representing a URL, path, or image source
- `string` representing an enum value (paired with a `select` field)

No-gating rule: The View component must **not** return `null` based on business logic. If a visibility toggle is needed, expose it as an explicit `visible` prop of type `select` with `true`/`false` options, and gate on that. The View may still return `null` if `visible === "false"`.

### `'use client'` rule — View files must be Server Components

**View files must NEVER have a `'use client'` directive.** The Puck render route uses `<Render>` from `@puckeditor/core/rsc` (a Server Component). When a View has `'use client'`, React's RSC protocol tries to pass Puck's internal props (which include functions like `renderDropZone`, `dragRef`, `isEditing`) to that Client Component. Functions cannot be serialized across the server-to-client boundary, causing a runtime error:

```
Functions cannot be passed directly to Client Components unless you explicitly
expose it by marking it with "use server".
```

If a View needs interactivity (e.g., `useState` for tab switching, image selection, clipboard copy):

1. **Extract the interactive logic into a separate `*Client.tsx` child component** with `'use client'`
2. **The View file stays as a Server Component** — it receives flat props from Puck and passes them down to the client child
3. **Name the child `{ComponentName}Client.tsx`** (e.g., `ProductTabsClient.tsx`, `ProductGalleryClient.tsx`, `CopyButton.tsx`)

```tsx
// ❌ WRONG — causes RSC serialization error
'use client';  // <-- this breaks the render route
export function ProductTabsView({ tabs, defaultTab }: Props) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  // ...
}

// ✅ CORRECT — View is Server Component, delegates to client child
export function ProductTabsView({ tabs, defaultTab, className }: Props) {
  return (
    <ProductTabsClient
      tabs={tabs}
      defaultTab={defaultTab}
      className={className}
    />
  );
}
```

---

## Field Type Specification

Each entry in `puckFields` maps one prop to a Puck editor field. The `type` value determines what control Puck renders.

### Scalar field types

| Puck field type | Use for | Props interface type |
|-----------------|---------|---------------------|
| `text` | Short single-line strings: titles, names, labels, URLs | `string` |
| `textarea` | Long multi-line strings: descriptions, quotes, body text | `string` |
| `number` | Numeric values: prices, counts, quantities | `number` |
| `select` | Enumerated values: sizes, ratings, on/off toggles | `string` (value from options) |
| `radio` | Small enumerated sets (2-3 options) | `string` (value from options) |

### Select field format

```tsx
{
  type: "select",
  label: "Size",
  options: [
    { label: "Default", value: "default" },
    { label: "Large", value: "large" },
  ],
}
```

For boolean-like toggles, always use `select` with `"true"` / `"false"` string values (Puck stores everything as strings in select fields).

### Array field type

For components that display lists (e.g., a grid of cards), use Puck's `array` field type:

```tsx
{
  type: "array",
  label: "Items",
  arrayFields: {
    name: { type: "text", label: "Name" },
    image: { type: "text", label: "Image URL" },
    price: { type: "number", label: "Price" },
  },
  defaultItemProps: { name: "New Item", image: "", price: 0 },
  getItemSummary: (item) => item.name,
  max: 12,
}
```

The View component receives this as a plain array of objects:

```tsx
interface ProductGridViewProps {
  items: { name: string; image: string; price: number }[];
  columns: string;
}
```

### Field definition shape

Every field must include a `label` string. Optional properties vary by type (e.g., `options` for `select`, `placeholder` for `text`, `arrayFields` for `array`).

---

## File Naming Convention

| File | Pattern | Example |
|------|---------|---------|
| Container | `{ComponentName}.tsx` | `PromotionBar.tsx` |
| View | `{ComponentName}View.tsx` | `PromotionBarView.tsx` |
| Already flat (no split needed) | `{ComponentName}.tsx` — exports metadata directly | `PriceDisplay.tsx` |

The script scans for `*View.tsx` files and for `*.tsx` files that export `puckFields`. If a file exports `puckFields`, it is treated as a Puck component regardless of naming.

---

## Concrete Examples

### Example 1: Already flat — no split needed

`PriceDisplay` already accepts flat props. Just add the metadata exports.

```tsx
// components/products/PriceDisplay.tsx

import { cn } from "@/lib/utils/cn";
import { formatProductPrice } from "@/lib/utils/formatters";

interface PriceDisplayProps {
  price: number;
  salePrice?: number | null;
  originalPrice?: number;
  isOnSale?: boolean;
  className?: string;
  size?: "default" | "large";
}

export const puckLabel = "Price Display";
export const puckCategory = "Products";

export const puckFields = {
  price:         { type: "number", label: "Price" },
  salePrice:     { type: "number", label: "Sale Price" },
  originalPrice: { type: "number", label: "Original Price" },
  isOnSale: {
    type: "select",
    label: "On Sale",
    options: [
      { label: "No", value: "false" },
      { label: "Yes", value: "true" },
    ],
  },
  size: {
    type: "select",
    label: "Size",
    options: [
      { label: "Default", value: "default" },
      { label: "Large", value: "large" },
    ],
  },
} as const;

export const puckDefaults = {
  price: 299,
  salePrice: 199,
  originalPrice: 299,
  isOnSale: "true",
  size: "default",
};

export function PriceDisplay({ price, salePrice, originalPrice, isOnSale, className, size = "default" }: PriceDisplayProps) {
  // component body unchanged
}
```

### Example 2: Split required — container + view

`PromotionBar` has business logic (`isPromotionActive`) and receives a `Promotion` domain object.

```tsx
// ──────────────────────────────────────────────
// components/promotions/PromotionBar.tsx  (CONTAINER)
// ──────────────────────────────────────────────
// Unchanged interface — routes keep using this.
// Delegates to View after performing logic.

import { PromotionBarView } from "./PromotionBarView";
import { isPromotionActive } from "@/lib/utils/promotions";
import type { Promotion } from "@/lib/api/types/promotions";

interface PromotionBarProps {
  promotion: Promotion | null;
  className?: string;
}

export const PromotionBar = ({ promotion, className }: PromotionBarProps) => {
  if (!promotion) return null;
  if (!isPromotionActive(promotion)) return null;

  return (
    <PromotionBarView
      title={promotion.title}
      subtitle={promotion.subtitle}
      ctaText={promotion.ctaText}
      ctaLink={promotion.ctaLink}
      visible="true"
      className={className}
    />
  );
};
```

```tsx
// ──────────────────────────────────────────────
// components/promotions/PromotionBarView.tsx  (VIEW)
// ──────────────────────────────────────────────
// Flat props, no business logic, Puck metadata.

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface PromotionBarViewProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  visible: string;
  className?: string;
}

export const puckLabel = "Promotion Bar";
export const puckCategory = "Marketing";

export const puckFields = {
  title:    { type: "text", label: "Title" },
  subtitle: { type: "text", label: "Subtitle" },
  ctaText:  { type: "text", label: "CTA Text" },
  ctaLink:  { type: "text", label: "CTA Link" },
  visible: {
    type: "select",
    label: "Visible",
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  },
} as const;

export const puckDefaults = {
  title: "Free Shipping on All Orders",
  subtitle: "Limited time only — ends soon",
  ctaText: "Shop Now",
  ctaLink: "/collections/all",
  visible: "true",
};

export const puckSeedData = {
  // Placeholder promotion for seed JSON — not editable in Puck,
  // but needed so the component doesn't null-gate in the editor
  promotion: {
    id: "promo-1",
    backgroundImage: "",
    title: "Free Shipping on All Orders",
    subtitle: "Limited time only — ends soon",
    description: "",
    ctaText: "Shop Now",
    ctaLink: "/collections/all",
    startDate: "2020-01-01T00:00:00Z",
    endDate: "2099-12-31T23:59:59Z",
  },
};

export function PromotionBarView({ title, subtitle, ctaText, ctaLink, visible, className }: PromotionBarViewProps) {
  if (visible === "false") return null;

  const hasCta = Boolean(ctaText && ctaLink);

  return (
    <div className={cn("@container w-full bg-bg-surface text-text-base border-b border-border", className)}>
      <div className="w-full px-4 py-3 flex flex-col @md:flex-row @md:items-center @md:justify-between gap-2 @md:gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-text-base">{title}</span>
          <span className="text-xs text-text-muted">{subtitle}</span>
        </div>
        {hasCta && (
          <Link href={ctaLink} className="inline-flex items-center justify-center rounded-button bg-cta-primary px-4 py-2 text-xs font-semibold text-on-primary transition-colors hover:bg-cta-primary-hover">
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}
```

### Example 3: List component with array field

A grid view that displays multiple cards.

```tsx
// components/categories/CategoryGridView.tsx

interface CategoryGridViewProps {
  columns: string;
  items: { name: string; slug: string; image: string; itemCount: number }[];
}

export const puckLabel = "Category Grid";
export const puckCategory = "Products";

export const puckFields = {
  columns: {
    type: "select",
    label: "Columns",
    options: [
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
    ],
  },
  items: {
    type: "array",
    label: "Categories",
    arrayFields: {
      name:       { type: "text", label: "Name" },
      slug:       { type: "text", label: "Slug" },
      image:      { type: "text", label: "Image URL" },
      itemCount:  { type: "number", label: "Item Count" },
    },
    defaultItemProps: { name: "New Category", slug: "new-category", image: "", itemCount: 0 },
    getItemSummary: (item) => item.name,
    max: 12,
  },
} as const;

export const puckDefaults = {
  columns: "3",
  items: [
    { name: "Outerwear", slug: "outerwear", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80", itemCount: 42 },
    { name: "Footwear", slug: "footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3779?w=600&q=80", itemCount: 28 },
    { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1611923134139-cb5f6c7c5e3e?w=600&q=80", itemCount: 15 },
  ],
};

export function CategoryGridView({ columns, items }: CategoryGridViewProps) {
  const gridCols = { "2": "grid-cols-2", "3": "grid-cols-3", "4": "grid-cols-4" }[columns] || "grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {items.map((item, i) => (
        <CategoryCardView key={i} name={item.name} slug={item.slug} image={item.image} itemCount={item.itemCount} />
      ))}
    </div>
  );
}
```

---

## The Script Contract

The script performs pure mechanical assembly. It does **not**:

- Parse TypeScript types
- Infer field types from prop types
- Make decisions about which fields to expose
- Generate default values
- Resolve nested domain objects

The script **does**:

1. Scan `components/**/*.tsx` for files that export `puckFields`
2. For each matching file, dynamically import it
3. Read the five required exports: `puckComponentName`, `puckLabel`, `puckCategory`, `puckFields`, `puckDefaults`
4. Determine the component export (default export, or named export matching filename without `View` suffix)
5. Assemble a Puck config entry:

```
{
   [puckComponentName]: {
     category: puckCategory,
     label: puckLabel,
     fields: puckFields,
     defaultProps: puckDefaults,
     render: (props) => <Component {...props} />,
   }
 }
```

6. Write the assembled config to `lib/puck-components.jsx`
7. Write a server config to `lib/puck-components.server.jsx` with async render functions for data-aware components

### Dual config generation

The script produces two files from the same View components:

| File | Used by | Render function |
|------|---------|-----------------|
| `lib/puck-components.jsx` | Puck editor (`/editor`) | `(props) => <Component {...props} />` — synchronous, no data fetching |
| `lib/puck-components.server.jsx` | Published page render (`/page/[slug]`) | `async (props) => { const data = await fetcher(props); return <Component {...props} {...data} />; }` — calls `puckDataFetcher` if exported, falls back to seed/defaults on error |

Components without `puckDataFetcher` get identical render functions in both files.

---

## Data-Aware Components

### Component types

| Type | Exports | Behavior |
|------|---------|----------|
| **Content** | `puckFields` + `puckDefaults` | Static content — no data fetching. Rendered identically in editor and production. |
| **Data-aware** | `puckFields` + `puckDefaults` + `puckSeedData` + `puckDataFetcher` | Editor shows seed/placeholder data. Production fetches real API data via `puckDataFetcher`. Falls back to seed if fetch fails. |
| **Pure data** | (not in Puck) | Not editable in Puck. Rendered directly by `page.tsx` or as part of a data-aware component's fetcher. |

### `puckDataFetcher` contract

```tsx
export async function puckDataFetcher(
  props: Record<string, unknown>,
  context?: { searchParams?: Record<string, string> },
): Promise<Partial<ComponentProps>> {
  // Call API services, return data props
  const products = await fetchFeaturedProducts(8);
  return { products };
}
```

Rules:
- **Returns partial props** — only the data-derived keys (typically the same keys as `puckSeedData`)
- **Must NOT return `puckFields` keys** — editable props are preserved from the saved page data
- **Must handle empty state internally** — if API returns empty array, return `{ products: [] }`; the View component renders the empty state
- **Must throw on failure** — the server config's render function catches errors and falls back to seed/defaults
- **Server-only** — uses `apiRequest` which calls `fetch` with server context (cookies, Next.js cache)
- **No `'use client'`** — View files with `puckDataFetcher` must NOT have `'use client'`

### `puckSeedData` for data-aware components

`puckSeedData` holds placeholder data for the editor. When the editor renders a data-aware component, it uses seed data (since there's no API to call in the browser). In production, `puckDataFetcher` overrides these with real data.

```tsx
export const puckSeedData = {
  products: [
    { _id: "seed-1", name: "Sample Product", price: 99, images: ["/placeholder.jpg"], inStock: true, slug: "sample-product" },
  ],
};
```

Keys in `puckSeedData` must NOT overlap with `puckFields` keys. They represent non-editable data props.

### What the script needs to handle

| Concern | How |
|---------|-----|
| Component name derivation | Strip `View` suffix from filename, or use default export name |
| `render` function | Simple spread — `<Component {...props} />` — works because props are flat and keys match `puckFields` |
| `className` prop | Excluded from `puckFields` — Puck doesn't edit it. Component can still accept it but Puck won't pass it |
| Select values stored as strings | Components must convert internally (e.g., `Number(price)`, `isOnSale === "true"`) |
| Array fields | Puck passes arrays directly — no conversion needed |

### What happens if a file is missing exports

The script skips the file and logs a warning:

```
⚠ components/home/HeroSectionView.tsx — missing puckComponentName export, skipping
⚠ components/home/HeroSectionView.tsx — missing puckFields export, skipping
⚠ components/home/HeroSectionView.tsx — missing puckDefaults export, skipping
```

This makes it safe to have non-Puck files in the same directories. Only files with `puckFields` are processed.

---

## Checklist for Component Authors

Before a component can be auto-processed, verify:

- [ ] Component accepts only flat scalar props (string, number, boolean, arrays of flat objects)
- [ ] No business logic inside the component (no date checks, no API calls, no store reads)
- [ ] If original component had logic, a container file handles it and delegates to this View
- [ ] `puckComponentName` exported — matches the JSX tag name used in `page.tsx`
- [ ] `puckLabel` exported — human-readable name
- [ ] `puckCategory` exported — drawer grouping
- [ ] `puckFields` exported — one entry per editable prop, with correct field type and label
- [ ] `puckDefaults` exported — sensible default for every key in `puckFields`
- [ ] Every key in `puckFields` has a matching prop in the component's interface
- [ ] Every key in `puckDefaults` has a matching key in `puckFields`
- [ ] If `puckSeedData` is exported, its keys don't overlap with `puckFields` keys
- [ ] If `puckDataFetcher` is exported, it returns partial props (only data-derived keys, not `puckFields` keys)
- [ ] If `puckDataFetcher` is exported, it throws on failure (the server config catches and falls back)
- [ ] If `puckDataFetcher` is exported, `puckSeedData` is also exported with matching keys (placeholder data for editor)
- [ ] Select fields for booleans use `"true"` / `"false"` string values
- [ ] Component does not return `null` based on business logic (only based on an explicit `visible` prop if applicable)
- [ ] Component is imported with `@/` path alias (not relative paths that break outside the original project)
