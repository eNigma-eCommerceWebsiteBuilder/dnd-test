# Category Detail Canonical Parity Plan

## Goal

Make a regenerated `category-detail.json` represent the real
`eNigma-TemplateFrontend/app/categories/[slug]/page.tsx` JSX tree closely
enough that its published Puck page has matching layout, components, runtime
data, filters, conditions, and pagination.

This is the next catalog vertical slice after `products`. It must not be
implemented as another opaque `CategoryCatalogStateSection`.

## Current Gap

The source route fetches a category from the route slug, fetches its products,
and renders a structured catalog page:

```text
main / max-width container
  category breadcrumbs
  CategoryHero
  sibling-category condition -> SubcategoryNav
  ActiveFilters Suspense boundary
  catalog content layout
    category filter sidebar Suspense boundary -> ProductFilters
    result column
      count + ViewToggle + SortDropdown
      products condition
        ProductGrid Suspense boundary
        pagination condition -> Pagination
        EmptyCategory
```

The current parser emits only `CategoryCatalogStateSection`. That component
reconstructs markup and behaviour itself, so the Puck seed cannot expose,
reorder, or validate the real page regions independently.

## Scope

- Target only `app/categories/[slug]/page.tsx` and `category-detail.json`.
- Preserve the source route's backend and URL-filter semantics.
- Reuse the products canonical components only where their JSX and runtime
  contract are genuinely identical.
- Keep `CategoryCatalogStateSection` registered only for existing saved data.
  The parser must no longer emit it.
- Do not change the real TemplateFrontend route or its production components.

## Required Route Contract

The source page requires a category slug. The Puck published route needs a
non-ambiguous way to provide it; `pageSlug` (`category-detail`) must not be
mistaken for the category slug (`outerwear`).

Recommended testbed contract:

```text
/page/category-detail/[categorySlug]
```

For example, `/page/category-detail/accessories?sort=price-asc&page=2` renders
the saved `category-detail` document with `routeParams.categorySlug` set to
`outerwear`. No query-parameter category-slug fallback will be supported.

The matching published-route resolver must pass the category slug and search
params into Puck `metadata`. Missing or unknown category slugs must render the
same not-found outcome as the source route, rather than a made-up category
preview.

## Canonical Components

Create paired renderer and `*View` files under
`dnd-test/components/categories/canonical`. Renderers contain only source JSX;
Views contain Puck fields, slots, seed defaults, `puckDataFetcher`, and
`puckAst` metadata. A View must delegate to its paired renderer and must not
recreate its UI.

### New Category-Specific Regions

- `CategoryCatalogLayout`
  - Source `main` and `max-w-[1440px]` page container.
  - Slots: `breadcrumbs`, `hero`, `subcategories`, `activeFilters`, `content`.
- `CategoryCatalogBreadcrumbs`
  - The source's `Home > All Categories > {category.name}` navigation.
- `CategorySubcategoryCondition`
  - Owns `siblingCategories.length > 0`; exposes a Puck-only preview state.
  - Slot: `content`, containing `SubcategoryNav`.
- `CategoryCatalogFilterSidebar`
  - Source `w-full lg:w-[280px]` sidebar and its exact two-skeleton fallback.
  - Slot: `filters`, containing `CategoryProductFiltersBlock`.
- `CategoryCatalogResultsHeader`
  - Source item-count row and `ViewToggle`/`SortDropdown` placement.
  - Slot: `controls`.
- `CategoryCatalogResultsState`
  - Owns the real `products.length > 0` condition.
  - Slots: `results`, `empty`; Puck preview may select either state.
- `CategoryCatalogGridBoundary`
  - Source ProductGrid `Suspense` boundary with its page-size skeleton.
  - Slot: `grid`, containing `CategoryProductGridBlock`.
- `CategoryCatalogPaginationCondition`
  - Owns `totalPages > 1`; has a Puck-only visible/hidden preview switch.
  - Slot: `content`, containing `CategoryCatalogPaginationBlock`.

### Existing Leaves To Correctly Reuse

- `CategoryHero`, `SubcategoryNav`, and `EmptyCategory` must be audited
  against their TemplateFrontend counterparts. Where a current View contains
  replacement markup or incorrect fetching, split it into a canonical delegate
  and a thin View before using it in the new tree.
- `ActiveFiltersBlock`, `ViewToggleBlock`, and `SortDropdownBlock` may be
  reused because their source calls and placement are unchanged.
- `CatalogContentLayout` and `CatalogActiveFiltersBoundary` may be reused
  only after a source-parity check confirms their wrapper JSX and fallbacks are
  identical to this route.
- Do not reuse `ProductGridView`, `ProductFiltersBlock`, or
  `CatalogPaginationBlock` for category data unless they accept category
  runtime data directly. Generic-products fetches are not correct here.

## Category Runtime Model

Add a request-scoped `categoryCatalogRuntime.ts` loader. It must resolve the
category slug from explicit Puck props first, then
`metadata.routeParams.categorySlug`. It must not infer the category from the
saved page slug or a query parameter.

For a resolved category it must perform the source route's data flow exactly:

1. Fetch all categories with stats.
2. Find the selected category by `slug`; report not-found if absent.
3. Parse source-compatible catalog search params.
4. Call `fetchCategoryProducts(category._id, filters)`.
5. Derive siblings using the same `parentCategory` and exclusion rule.
6. Return category, all categories, sibling categories, products, counts,
   page, page size, and `hasProducts`/`hasPagination` flags.

All category canonical Views must read this same request-scoped result. This
prevents the current risk of the grid, filters, and pagination fetching
different data or accidentally using the all-products catalog endpoint.

## Expected Seed Shape

```text
CategoryCatalogLayout
  breadcrumbs: CategoryCatalogBreadcrumbs
  hero: CategoryHero
  subcategories: CategorySubcategoryCondition
    content: SubcategoryNav
  activeFilters: CatalogActiveFiltersBoundary
    content: ActiveFiltersBlock
  content: CatalogContentLayout
    sidebar: CategoryCatalogFilterSidebar
      filters: CategoryProductFiltersBlock
    results: CategoryCatalogResultsState
      results: CategoryCatalogResultsHeader
        controls: ViewToggleBlock, SortDropdownBlock
      results: CategoryCatalogGridBoundary
        grid: CategoryProductGridBlock
      results: CategoryCatalogPaginationCondition
        content: CategoryCatalogPaginationBlock
      empty: EmptyCategory
```

The exact JSON may group source siblings differently where Puck slot fields
require it, but it must preserve their source order. It must contain no
`CategoryCatalogStateSection`.

## Parser Changes

- Replace the `page === 'category-detail'` shortcut in
  `eNigma-TemplateFrontend/ast-parser.ts` with an import-aware category-detail
  adapter.
- Match imports and ordered JSX for `CategoryHero`, `SubcategoryNav`,
  `ActiveFilters`, `ProductFilters`, `ViewToggle`, `SortDropdown`,
  `ProductGrid`, `Pagination`, and `EmptyCategory`.
- Validate required wrapper classes, both `Suspense` boundaries, and these
  source conditions:
  - `siblingCategories.length > 0`
  - `products.length > 0`
  - `totalPages > 1`
- Resolve emitted Puck types from generated manifest roles, not hard-coded
  component names. Each canonical View must export source JSX names, source
  import paths, role, slot target, ancestor signature, and boundary/condition
  ownership in `puckAst`.
- If a required source region or condition no longer matches, emit diagnostics
  and no plausible opaque fallback. The report must name the missing source
  signature.

## Verification And Acceptance Criteria

Automate the following before manual testing:

1. Add `scripts/check-category-detail-canonical-parity.ts`.
   - Assert the production source has the expected ordered imports, classes,
     `Suspense` fallbacks, and three conditions.
   - Assert canonical renderers retain the source wrapper JSX and direct leaf
     calls.
   - Assert category Views do not import or render replacement `ProductCard`
     markup or generic all-products loaders.
2. Regenerate Puck config and assert the manifest contains every category
   canonical role and slot declaration.
3. Regenerate `category-detail.json` from the source route.
   - Fail if `CategoryCatalogStateSection` appears.
   - Fail if any required region, condition owner, or source leaf is absent.
4. Run TypeScript checking and the Puck production build.

Manual parity checks using a known category, such as `accessories`:

1. Open the editor seed and verify the regions appear in source order and can
   be rearranged within their appropriate slots.
2. Open the published dynamic category route and compare it with
   `/categories/accessories` using the same query string.
3. Verify category selection, price, availability, sort, view, and pagination
   update the URL and refresh the same category's products.
4. Verify the sibling navigation appears only when siblings exist.
5. Verify a no-products filter combination shows `EmptyCategory` without
   removing the category hero or the source page shell.
6. Verify a one-page result hides pagination.
7. Verify an unknown category slug uses the not-found outcome, not a preview
   fallback.

## Non-Goals

- Do not make cart, checkout, search, or product detail changes in this slice.
- Do not introduce generic HTML blocks.
- Do not copy the TemplateFrontend layout/header/footer into Puck data.
- Do not expand fetched category or product arrays into static Puck children.
