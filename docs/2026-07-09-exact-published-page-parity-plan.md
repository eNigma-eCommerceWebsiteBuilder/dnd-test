# Exact Published-Page Parity Plan

Date: 2026-07-09

## Summary

The previous parser improvement plan was not enough to guarantee exact parity. It improved parser coverage, but exact published-page behavior requires domain Puck components to wrap the real borrowed production components and services instead of approximating them.

This plan targets full user-flow parity: reads, backend conditions, empty/error states, forms, buttons, mutations, redirects, and client interactions.

Puck mechanism choices are based on official docs:

- Use `slot` fields for editable nested layout.
- Use `<Render metadata>` for route/search context.
- Use `resolveData` and server rendering for dynamic data.
- Keep separate client/server-safe config behavior where needed.

Relevant docs:

- https://puckeditor.com/docs/api-reference/fields/slot
- https://puckeditor.com/docs/api-reference/components/render
- https://puckeditor.com/docs/integrating-puck/dynamic-props
- https://puckeditor.com/docs/integrating-puck/external-data-sources
- https://puckeditor.com/docs/integrating-puck/server-components

## Key Changes

- Add a Puck route context bridge:
  - Published `<Render>` passes `metadata={{ routeParams, searchParams, pageSlug }}`.
  - Generated server config passes Puck metadata into every `puckDataFetcher`.
  - Runtime wrappers resolve params from explicit props first, then `puck.metadata.routeParams/searchParams`.

- Replace approximation components with thin domain wrappers around real borrowed components:
  - Catalog pages wrap real `ProductFilters`, `ActiveFilters`, `SortDropdown`, `ViewToggle`, `MobileFilterDrawer`, `Pagination`, `ProductGrid`, and empty-state components.
  - Account pages wrap real `AddressManager`, `DigitalLibrary`, `OrderStatusFilter`, `ReturnsList`, `SubscriptionList`, payment-method widgets, and order/subscription detail action components.
  - Collection/category/product detail wrappers fetch the same backend data and call the same real display components as the original pages.

- Keep Puck editing structure where safe:
  - Static layout remains editable through `PageWrapper`, `TwoColumnDetail`, `CardSection`, `SectionHeading`, and `slot` fields.
  - Backend/runtime branches remain domain-specific state components, not a generic `ConditionalSection`.
  - Runtime arrays are never expanded into static JSON; wrappers render fetched arrays at runtime.

- Fix parser issues found in the audit and generated seeds:
  - Prefer the primary successful JSX return over early guard/not-found returns.
  - Recursively parse `&&` right-hand expressions, including nested ternaries.
  - Generalize static `.map()` only when the source array is statically resolvable and mapped through manifest hints.
  - Stop silently dropping `Link`; map breadcrumbs/action links to known components or diagnostics.
  - Treat dropped production components as hard failures unless intentionally covered by a domain wrapper.

## Test Plan

- Regenerate config/manifest and all 30 seeds; require `30/30` parser success.
- Assert no generated page is behavior-empty, especially `products`, `collection-detail`, `account-downloads`, `account-addresses`, and `account-subscription-detail`.
- Published-page parity checks:
  - Product/category/search/catalog filters, sorting, pagination, grid/empty states behave like real pages.
  - Account address, payment, orders, returns, downloads, and subscriptions pages preserve real forms/buttons/actions.
  - Dynamic pages read params from Puck metadata and fetch the same backend records as real routes.
  - Error, not-found, redirect, empty, and unauthenticated states match the original page behavior.
- Run targeted lint/tests for touched parser/config/domain wrapper files and inspect diagnostics for unmapped important HTML or dropped components.

## Assumptions

- Full user-flow parity is required for published pages.
- Puck editor preview may use safe preview defaults, but published rendering must use real route/search metadata and backend data.
- Behavior-heavy areas should wrap borrowed production components whenever possible.
- New Puck-only views are allowed only for static/layout sections or when no real production component exists.
