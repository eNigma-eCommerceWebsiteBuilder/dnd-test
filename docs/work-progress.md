# Work Progress — Puck Editor Integration

## Objective

Integrate Puck visual editor into the `dnd-test` Next.js 16 app using 5 pre-existing components from the `eNigma-TemplateFrontend` component library, with JSON file persistence and `/editor` + `/page/[slug]` routing.

---

## 1. Project Exploration

- Audited `dnd-test` project: Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, Tailwind v4, TypeScript, `@puckeditor/core` v0.22.0 installed.
- Found existing `app/editor/page.jsx` had critical issues: missing `'use client'`, no default export, no CSS import, no-op save, minimal config.
- Explored `eNigma-TemplateFrontend/components/` folder structure and selected one component from each of 5 folders.
- Read all selected components, their dependencies (`lib/utils/`, `lib/api/types/`, `lib/content.ts`), and the Tailwind config.

## 2. Dependencies Installed

- `clsx` and `tailwind-merge` (required by eNigma's `cn()` utility).

## 3. Tailwind v4 Theme Ported

- Ported eNigma's custom Tailwind v3 theme (colors, border-radius, shadows) into dnd-test's Tailwind v4 `globals.css` using CSS variables + `@theme inline`.
- Includes light/dark mode color system with semantic tokens (text-base, bg-surface, cta-primary, border, badge-sale, price, rating, etc.).
- Added Material Symbols Outlined font via `<link>` in layout for icon components.

## 4. Shared Libraries Created

Copied and adapted the following from `eNigma-TemplateFrontend/lib/`:

| File | Purpose |
|------|---------|
| `lib/utils/cn.ts` | `clsx` + `tailwind-merge` class name utility |
| `lib/utils/formatters/` | `formatRating`, `formatRelativeTime`, `formatPrice`, `formatProductPrice` |
| `lib/utils/promotions/` | `isPromotionActive`, `calculateTimeRemaining`, types |
| `lib/api/types/` | Type definitions: `Product`, `Category`, `Testimonial`, `Promotion`, `HeroProduct` |
| `lib/content.ts` | `siteContent` object + `HeroContent` type |
| `lib/page-data.ts` | JSON file read/write utility (`getAllPages`, `getPageBySlug`, `savePage`, `deletePage`) |

## 5. Five eNigma Components Copied

| Component | Source folder | Props exposed in Puck |
|-----------|--------------|-----------------------|
| `components/home/HeroSection.tsx` | `home/` | title, subtitle, CTAs, product name/slug/description/image |
| `components/testimonials/TestimonialCard.tsx` | `testimonials/` | quote, author, role, avatar, rating, platform |
| `components/promotions/PromotionBar.tsx` | `promotions/` | title, subtitle, CTA text/link, start/end dates |
| `components/categories/CategoryCard.tsx` | `categories/` | name, slug, image, product count |
| `components/products/PriceDisplay.tsx` | `products/` | price, sale price, original price, on-sale toggle, size |

All imports adapted from `eNigma-TemplateFrontend` paths to `@/` paths for `dnd-test`.

## 6. Puck Component Config Created

- **`lib/puck-components.jsx`** — Puck config wrapping all 5 eNigma components.
- Each component maps flat Puck fields (text, textarea, number, select) to the component's props.
- Each `render` function constructs the typed object the eNigma component expects and passes it through.
- Components categorized: Home, Social Proof, Marketing, Products.

## 7. Editor Page Fixed

- **`app/editor/page.jsx`** — Complete rewrite:
  - Added `'use client'` directive.
  - Added default export with Suspense wrapper (for `useSearchParams`).
  - Imports Puck CSS (`@puckeditor/core/puck.css`).
  - Loads existing page data via `GET /api/pages/[slug]` on mount.
  - `onPublish` saves via `PUT /api/pages/[slug]` with save/saved status indicators.
  - `overrides.headerActions` provides "View Page" button (replaces deprecated `renderHeaderActions`).
  - Slug defaults to `home`, overridable via `?slug=` query param.

## 8. Data Persistence (JSON File)

- **`data/pages.json`** — Empty JSON array, stores all published pages.
- **`app/api/pages/route.ts`** — `GET` (list all), `POST` (create).
- **`app/api/pages/[slug]/route.ts`** — `GET` (one), `PUT` (update), `DELETE` (remove).
- All routes use `lib/page-data.ts` which reads/writes `data/pages.json` via Node `fs`.

## 9. Page Rendering Route

- **`app/page/[slug]/page.tsx`** — Server Component using Puck's RSC `Render` from `@puckeditor/core/rsc`.
  - Reads page data from disk via `getPageBySlug`.
  - `force-dynamic` to always read fresh data.
  - Calls `notFound()` if page doesn't exist.
- **`app/page/[slug]/not-found.tsx`** — Friendly "Page not published" message with link to editor.

## 10. Home Page & Layout Updated

- **`app/page.tsx`** — Replaced default Next.js starter with:
  - "Open Editor" button linking to `/editor`.
  - List of saved pages with component counts, linking to `/page/[slug]`.
- **`app/layout.tsx`** — Updated metadata title/description, added Material Symbols font `<link>`.

## 11. Verification

- TypeScript: 0 errors.
- ESLint: 0 errors, 0 warnings.
- `next build`: succeeds with no warnings.
- End-to-end flow tested: API save → data persisted to JSON → `/page/[slug]` renders 200.

---

## Final File Structure

```
dnd-test/
├── app/
│   ├── api/pages/
│   │   ├── route.ts              # GET all, POST create
│   │   └── [slug]/route.ts       # GET one, PUT update, DELETE
│   ├── editor/page.jsx           # Puck visual editor (client)
│   ├── page/[slug]/
│   │   ├── page.tsx              # RSC Render view
│   │   └── not-found.tsx         # "Not published" fallback
│   ├── globals.css               # Tailwind v4 + eNigma theme tokens
│   ├── layout.tsx                # Root layout + Material Symbols font
│   └── page.tsx                  # Home: editor link + saved pages list
├── components/                   # 5 eNigma components
│   ├── home/HeroSection.tsx
│   ├── testimonials/TestimonialCard.tsx
│   ├── promotions/PromotionBar.tsx
│   ├── categories/CategoryCard.tsx
│   └── products/PriceDisplay.tsx
├── lib/
│   ├── api/types/                # Product, Category, Testimonial, etc.
│   ├── utils/                    # cn, formatters, promotions
│   ├── content.ts                # Site content + HeroContent type
│   ├── page-data.ts              # JSON file persistence utility
│   └── puck-components.jsx       # Puck config wrapping 5 components
├── data/pages.json               # Persisted page data store
└── package.json                  # + clsx, tailwind-merge
```

## How to Use

1. `npm run dev`
2. Visit `/editor` (or `/editor?slug=my-page`)
3. Drag components from left panel, edit props on right
4. Click **Publish** to save
5. Visit `/page/my-page` to view the rendered page
6. Home page (`/`) lists all saved pages
