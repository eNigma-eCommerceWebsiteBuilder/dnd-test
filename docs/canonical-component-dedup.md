# Canonical Component Deduplication

## Decision

Canonical components can be deduplicated, but only below the Puck route boundary. The goal is to reduce repeated rendering and parsing utility code without replacing source-specific Puck components, runtime contracts, or parser signatures with generic abstractions.

Use three layers:

1. Shared non-Puck canonical render primitives for repeated markup and simple branch behavior.
2. Route-specific Puck Views that retain their own fields, `puckAst`, slots, direct source delegates, and data fetchers.
3. Route-specific parser adapters that verify the original route structure before emitting a seed.

This keeps generated pages faithful to the original Next.js route while preventing repeated implementation details from drifting.

## Safe Reuse Now

### Results State

`CatalogResultsState` and `CategoryCatalogResultsState` have the same implementation: choose a `results` or `empty` slot based on a boolean runtime result, with an editor preview fallback.

Extract a shared non-Puck `ResultsState` renderer. Keep the existing product and category Puck Views because their runtime loaders, metadata roles, slot allow-lists, and source signatures differ.

### Product Grid Boundary

Products, category detail, and search all render `ProductGrid` inside a `Suspense` boundary using `ProductGridSkeleton` with a route-derived `pageSize`.

Extract a shared non-Puck `ProductGridBoundary` renderer. Keep separate Puck Views because each route loads `pageSize` from a different runtime loader and has its own AST role.

### Pagination Condition

Products, category detail, and search all use the source condition `totalPages > 1` to render a pagination slot.

Extract a shared non-Puck `PaginationCondition` renderer. Keep route-specific Puck Views for the loader, allowed child block, editor labels, and source metadata.

### Catalog Two-Column Layout

Product, category detail, and search catalog regions share the core layout classes:

```tsx
flex flex-col lg:flex-row gap-8 lg:gap-12
```

Extract a shared non-Puck `CatalogTwoColumnLayout` renderer with a source-derived spacing option. Search can supply its additional `mt-10` while product and category detail retain their exact original classes.

### Query Parsing

The catalog, category catalog, and search runtime loaders repeat route-query parsing for page, price, booleans, sort values, and cache keys.

Extract shared parsing helpers only. Keep each loader responsible for its resource identity and API call:

- Products fetches the full catalog plus categories.
- Category detail resolves the route category and fetches its products.
- Search performs a query-specific search and has a no-query state.

## Existing Reuse

Some appropriate reuse is already present. The category catalog composes product catalog primitives such as `CatalogContentLayout` and `CatalogActiveFiltersBoundary`, while retaining category-specific runtime leaves and parser roles.

## Do Not Genericify As Puck Components

### Runtime State Owners

Do not replace catalog results, search query state, collection states, or cart state with one generic Puck state component. Their predicates, data contracts, empty/error behavior, editor previews, and client/server boundaries differ.

For example:

- Catalog uses a two-way `products.length > 0` branch.
- Search uses a three-way no-query, results, and no-results branch.
- Cart owns client interaction state and a server-hydrated initial cart.
- Collection detail owns not-found, curated, and inspiration branches.

### Breadcrumb Puck Components

Product, category, search, and collection breadcrumbs differ in labels, route shape, spacing, and original production component delegation. A small rendering helper may be useful later, but one generic breadcrumb Puck component would weaken source parity and parser matching.

### Top-Level Page Shells

Do not introduce a universal Puck page layout. The page shells have meaningful source differences in max width, padding, responsive structure, slot order, and runtime ownership. A generic shell would recreate the opaque-wrapper problem the canonical approach is intended to remove.

## Implementation Rules

- Share pure renderers, condition helpers, and query parsing utilities.
- Preserve one Puck View per source role when its runtime loader, slots, `puckAst`, or source signature differs.
- Preserve one parser adapter per route family and make source-signature mismatch a diagnostic failure.
- Never use deduplication to flatten route-specific conditional branches or pass backend data implicitly through Puck slots.
- Add source-parity tests before replacing duplicated canonical renderers.

## Recommended First Slice

1. Extract shared `ResultsState` and replace the identical product/category renderers.
2. Extract shared `PaginationCondition` and replace product/category/search renderer duplication.
3. Extract shared query parsing helpers used by catalog, category catalog, and search runtime loaders.
4. Add a source-parity test for each route before and after the extraction.

Do not merge route-specific Puck Views or parser adapters in this first slice.
