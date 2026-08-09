# Canonical Component Commonality Audit

## Scope And Decision

This audit covers the 30 generated route grammars, 287 canonical Puck View adapters, and their canonical structural renderers. It proposes future groupings only; no canonical components, Puck types, parser metadata, or route grammars are changed by this document.

Runtime/page-state owners are deliberately excluded. That includes components whose primary job is fetching data, resolving route state, or selecting a runtime branch such as `CartPageState`, `SearchQueryState`, `CollectionDetailPageState`, and `CheckoutPageState`.

## Recommended Groups At A Glance

- **Shared product-grid Suspense boundary**: group `CatalogGridBoundary`, `CategoryCatalogGridBoundary`, and `SearchGridBoundary` behind a non-Puck `ProductGridSuspenseBoundary` primitive. Keep all three route-specific Puck Views and their existing slot names.
- **Shared pagination visibility**: group `CatalogPaginationCondition`, `CategoryCatalogPaginationCondition`, and `SearchPaginationCondition` behind a non-Puck `PaginationVisibility` primitive. Keep the products editor-preview decision in its View.
- **Shared catalog two-column row**: group the core row behavior of `CatalogContentLayout`, `SearchContentLayout`, and the category catalog content region behind a parameterized non-Puck `CatalogTwoColumnRow` primitive. Source-named renderers retain their exact classes.
- **Shared catalog sidebar boundary, cautiously**: group only the repeated `Suspense` slot behavior of `CatalogFilterSidebar`, `CategoryCatalogFilterSidebar`, and `SearchFilterSidebar`. Do not merge their tags, visibility, skeletons, or Puck types.
- **Shared detail primary/sidebar grid, cautiously**: group the 12-column mechanics of `OrderDetailsContentLayout`, `ReturnDetailsContentLayout`, and `SubscriptionDetailContentLayout` behind a class-configurable non-Puck `DetailTwoColumnGrid` primitive.
- **Shared Puck slot utilities**: group repeated `puckTransparentSlotProps` and slot invocation mechanics into explicit shared utilities. Keep per-route slot type aliases and choose the correct helper per source delegate.
- **Keep existing shared production leaves as-is**: `ProductGrid`, `Pagination`, `SortDropdown`, `ProductFilters`, and `ProductGridSkeleton` are already the correct common rendering leaves. Do not add another generic Puck layer around them.

The groups above are internal implementation reuse only. They must not replace source-specific canonical Puck component names, Views, `puckAst` metadata, route grammars, parser mappings, runtime loaders, or editor-preview contracts.

## Reuse Boundary

The correct reuse boundary is below the route-specific Puck type:

1. Share pure rendering primitives or Puck adapter utilities.
2. Keep one source-specific canonical renderer and one Puck View per parsed JSX role.
3. Keep each Puck View's `puckAst`, slot allow-list, runtime loader, preview behavior, and parser mapping route-specific.

This protects the parser's ability to recognize the original JSX while avoiding repeated, behavior-free markup.

## Evidence

- The generated route grammar contains 32 routes and requires a canonical root for each.
- The canonical component directories contain 287 `*View` adapters.
- No non-View canonical `.tsx` renderer files have identical content hashes. Similar names therefore do not prove safe component identity.
- The manifest shows genuine shared production leaves: `ProductGrid` is referenced by seven canonical types, `Pagination` by five, `SortDropdown` by four, and `ProductFilters` by three.

## Detailed Rationale

### Group 1: Shared Product-Grid Suspense Boundary

Members:

- `products/canonical/CatalogGridBoundary.tsx`
- `categories/canonical/CategoryCatalogGridBoundary.tsx`
- `search/canonical/SearchGridBoundary.tsx`

All three render a `Suspense` boundary with `ProductGridSkeleton(count={pageSize})`. The category and products renderers are structurally identical. Search differs only in naming its child slot `content` instead of `grid`.

Proposal: introduce one non-Puck `ProductGridSuspenseBoundary` primitive with `pageSize` and `children`. Keep the three named route renderers and Views as thin delegates, preserving their existing Puck types, slot names, fetchers, and `puckAst` roles.

Safety: high. This primitive has no fetch, state ownership, or visible wrapper element.

### Group 2: Shared Pagination Visibility Primitive

Members:

- `products/canonical/CatalogPaginationCondition.tsx`
- `categories/canonical/CategoryCatalogPaginationCondition.tsx`
- `search/canonical/SearchPaginationCondition.tsx`

All own the same production predicate shape: render the pagination slot only when pagination is available. Category and search are exact `hasPagination ? children : null` renderers. The products renderer adds an editor-preview fallback when no runtime value is supplied.

Proposal: introduce a non-Puck `PaginationVisibility` primitive that receives the resolved boolean and children. Resolve editor preview in `CatalogPaginationConditionView`, not in the shared renderer.

Safety: high after preserving the products View preview behavior. It produces no wrapper DOM and does not decide backend state.

### Group 3: Catalog Two-Column Row

Members:

- `products/canonical/CatalogContentLayout.tsx`
- `search/canonical/SearchContentLayout.tsx`
- The content region nested by `categories/canonical/CategoryCatalogLayout.tsx`

Products and search both use the same responsive row: `flex flex-col lg:flex-row gap-8 lg:gap-12`. Search adds `mt-10`; category detail places the equivalent content region within a larger page frame.

Proposal: group the common row as a non-Puck `CatalogTwoColumnRow` with a route-supplied class string. Preserve each source-named renderer so the parser still maps `CatalogContentLayout` and `SearchContentLayout` directly from JSX.

Safety: medium. The wrapper DOM is shared, but route spacing is observable and must remain explicit in the source-named component.

### Group 4: Catalog Filter Sidebar Frame

Members:

- `products/canonical/CatalogFilterSidebar.tsx`
- `categories/canonical/CategoryCatalogFilterSidebar.tsx`
- `search/canonical/SearchFilterSidebar.tsx`

All contain a filter slot inside a `Suspense` boundary and reserve a 280px desktop sidebar. They intentionally differ in element (`div` versus `aside`), visibility (`hidden lg:block` only for products), fallback skeleton composition, and utility classes.

Proposal: group only the internal concept as a `SuspenseSlotBoundary` helper if duplication becomes costly. Do not introduce a generic `FilterSidebar` Puck component or erase route-specific element/class choices.

Safety: medium-low. A parameterized renderer is possible, but a direct component merge would weaken source fidelity.

### Group 5: Detail Primary/Sidebar Grid Primitive

Members:

- `OrderDetailsContentLayout`
- `ReturnDetailsContentLayout`
- `SubscriptionDetailContentLayout`

Each uses a 12-column desktop grid with primary content spanning seven columns and a sidebar spanning five. Their source renderers differ in margins, gaps, and vertical spacing. For example, order details uses `gap-8 lg:gap-12` and distinct primary/sidebar spacing, returns uses uniform `space-y-6`, and subscription detail adds `mt-8` with narrower desktop gaps.

Proposal: create a low-level `DetailTwoColumnGrid` primitive that accepts the exact outer, primary, and sidebar class strings. The route-named source components should remain and delegate to this primitive; their Puck Views and parser mappings must not be merged.

Safety: medium. This removes repeated grid mechanics while keeping every visual token owned by the original component.

### Group 6: Existing Shared Catalog Production Leaves

Members already reused across the catalog family:

- `ProductGrid`: products, category detail, and search.
- `Pagination`: products, category detail, and search.
- `SortDropdown`: products, category detail, and search.
- `ProductFilters`: products and category detail.
- `ProductGridSkeleton`: catalog loading boundaries.

Proposal: do not add another generic Puck layer. Continue to use these production components as the common rendering leaves. Route-specific Puck Views may retain distinct fetchers and metadata because the same leaf appears in different source positions and receives different route data.

Safety: already achieved. The parser should continue resolving import symbol plus import path, not component labels alone.

### Group 7: Puck Slot Adapter Utilities

Members:

- Route-local `puckTransparentSlotProps` definitions in canonical `types.ts` files.
- Route-local slot function invocation such as `slot?.(puckTransparentSlotProps)`.

Most route families use `{ style: { display: 'contents' } }`; a smaller account-oriented group uses `{ puck: { isEditing: false } }` because those source delegates require an editor-state safeguard.

Proposal: provide two explicitly named shared utilities, such as `transparentSlotProps` and `nonEditingSlotProps`, plus a typed `renderPuckSlot` helper. Keep route-local slot type aliases and decide which helper to use per source component.

Safety: high for the constants and render helper. Do not create a generic View factory because metadata, data fetchers, previews, and slot contracts must remain statically visible per canonical Puck type.

## Conceptual Families That Must Stay Separate

### Breadcrumbs

Products, category detail, search, collections, account pages, order detail, return detail, and subscription detail all have breadcrumb regions. They are not a single safe Puck component: depth, labels, route parameters, margin classes, and source delegates differ. Several account breadcrumbs also depend on fetched identifiers.

At most, a future production-only breadcrumb rendering helper could accept already-resolved items. Keep each route Puck type and parser source mapping separate.

### Account List Pages

Orders, returns, and subscriptions have page headers, filters, result lists, empty states, and pagination. Their shared vocabulary is not shared JSX: slot order, source components, empty-state behavior, query handling, and card/list DOM differ. The runtime result owners are also out of scope for this audit.

No generic `AccountListPage` Puck component is recommended.

### Checkout Family

Standard checkout, subscription checkout, and checkout success contain headers, step indicators, summary columns, and actions. Their cart contracts, client providers, conditional states, and markup are materially different.

No common Puck layout or state owner is recommended. A future non-Puck visual primitive may be considered only after source parity tests demonstrate identical DOM for a narrowly scoped element.

### Top-Level Page Shells

Do not introduce a universal page shell. The 32 routes differ in max widths, padding, background ownership, responsive structure, root state boundaries, and slot order. Generic shells would recreate the opaque replacement components this project has been removing.

## Recommended Implementation Order

1. Add shared slot adapter utilities. This has no parser or visual-output impact when imports are changed mechanically.
2. Extract `ProductGridSuspenseBoundary` and `PaginationVisibility` as non-Puck primitives.
3. Extract `CatalogTwoColumnRow` only after source-parity snapshots prove the current product and search DOM remains identical.
4. Consider `DetailTwoColumnGrid` after the order, return, and subscription source components are co-located in TemplateFrontend.
5. Revisit runtime conditions and state owners separately; they are intentionally excluded here.

## Required Guardrails

- Preserve every existing canonical Puck component name, slot name, slot allow-list, and `puckAst` source mapping.
- Keep parser output types unchanged; a shared internal primitive must never become a fallback parser target.
- Keep editor-only preview resolution in route-specific Views.
- Run the route-specific canonical parity test before and after each extraction, then regenerate the 30 seeds and run `npm run qa:full-jsx-parser` plus `npm run qa:published-pages`.
- Reject any extraction that changes generated seed topology, route grammar, rendered DOM/class output, or the parser's ability to report a source-specific missing region.

## Relationship To The Earlier Deduplication Note

`docs/canonical-component-dedup.md` remains useful for its central rule: share below the Puck route boundary. This audit supersedes its component-identity claims where the current renderers now differ, notably the catalog result/pagination preview handling and the category catalog layout composition.
