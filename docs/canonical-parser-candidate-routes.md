# Canonical Parser Candidate Routes

## Purpose

This is the implementation backlog for replacing the remaining generic or opaque
`ast-parser.ts` adapters with source-faithful, slot-based Puck seeds. The goal is
not merely to make a route render: a regenerated seed must preserve the original
Next.js JSX hierarchy, leaf component choices, responsive branches, data-fetching
behaviour, and meaningful conditional states.

The completed reference slices are:

1. `/products` - canonical product catalog hierarchy.
2. `/products/[slug]` - canonical product-detail hierarchy.
3. `/categories` - canonical trending and department category hierarchy.
4. `/categories/[slug]` - canonical category-detail hierarchy.

The remaining candidates below are ordered by expected customer-facing value,
reusable canonical structure, and feasibility in the current testbed. A lower
rank is not lower importance; it usually has more authenticated, payment, or
order-specific runtime dependencies that must be migrated faithfully first.

## Ordered Backlog

| Rank | Source route | Existing parser status | Why it is next / conversion focus |
| --- | --- | --- | --- |
| 1 | `/` | No dedicated adapter | The storefront baseline. It has a stable, section-oriented JSX tree (`PromotionBanner`, hero, category highlights, featured products, curated collections, inspiration, testimonials, newsletter, trust badges) and establishes visual parity for shared home components. |
| 2 | `/search` | Opaque `SearchStateSection` fallback | Closely related to the completed catalog slice but must preserve the real search header, filters, recent-search behavior, analytics, results/no-results/start states, URL parameters, and pagination. |
| 3 | `/collections` | Opaque `CollectionStateSection` fallback | A public browse page with clear source sections: breadcrumbs, collection type filter, collection grid, and empty condition. It is a good public-page follow-up with lower runtime risk. |
| 4 | `/collections/[slug]` | Opaque `CollectionDetailStateSection` fallback | Shares product-display patterns but has a distinct composition: collection hero, curated product display, and inspiration gallery. The adapter must derive the dynamic collection slug from Puck route metadata. |
| 5 | `/cart` | Partially granular `CartStateSection` fallback | Important commerce behavior. The source `CartPageClient` must be represented through canonical source delegates and its true empty/filled branches. Do this only against the original cart store/server-action infrastructure, not testbed replacements. |
| 6 | `/checkout` | Partially granular `CheckoutStateSection` fallback | The checkout page must use the real checkout client and cart/session behavior. Its canonical tree should preserve the source form, shipping method, payment, review, summary, secure badges, and empty-cart state. |
| 7 | `/checkout/success` | No dedicated adapter | High-value confirmation page with a rich but concrete source hierarchy: success header, order number, order summary/items, shipping, next steps, digital assets/licenses, and order actions. It requires reliable order identity routing. |
| 8 | `/checkout/subscription` | Generic reconstructed fallback | Current output is explicitly reconstructed from generic `PageWrapper`, `CardSection`, and `CalloutCard`. Replace it with source-delegating subscription checkout structure and real recurring-billing conditions. |
| 9 | `/wishlist/shared/[token]` | Opaque `SharedWishlistStateSection` fallback | A public, token-driven page with well-bounded states: header, shared item grid, savings, add-all action, and invalid/empty state. It is a strong dynamic-route reference after collection detail. |
| 10 | `/account/wishlist` | No dedicated adapter | Reuses wishlist leaves but adds authenticated server data, savings, and its own empty state. Convert after shared wishlist so leaf adapters are already proven. |
| 11 | `/auth` | No dedicated adapter | Small and self-contained (`AuthEntryCard` plus return URL handling). It is low effort, but its value depends on the production authentication provider being available. |
| 12 | `/downloads/[key]` | Opaque `DownloadLicenseStateSection` fallback | A focused dynamic page with license-key route metadata and a source `DownloadPage` delegate. Implement after the dynamic-route metadata pattern is fully documented. |
| 13 | `/account/downloads` | Opaque `AccountDigitalLibraryStateSection` fallback | The authenticated digital library requires orders, digital assets, license info, loading/empty behavior, and direct delegation to `DigitalLibrary`. |
| 14 | `/account/orders` | No dedicated adapter | A bounded authenticated list: order status filter, order list, and empty state. It provides reusable account-list shell patterns for returns and subscriptions. |
| 15 | `/account/orders/[id]` | No dedicated adapter | Detailed order composition with status, items, addresses, payment, cancel/reorder actions, and digital-item conditions. Requires trustworthy order-id metadata and authenticated server context. |
| 16 | `/account/orders/[id]/downloads` | No dedicated adapter | A narrow order-detail extension with downloads and license-key components. Convert after canonical order detail so it can reuse the same identity and authorization loader. |
| 17 | `/account/orders/[id]/return` | No dedicated adapter | Conditional return flow with eligibility, return window, policy reminder, and request form. Its source-specific conditions must remain owners of their Puck branches. |
| 18 | `/account/returns` | No dedicated adapter | Reuses the authenticated list pattern, but its filters and return-status semantics should be captured directly from source. |
| 19 | `/account/returns/[id]` | No dedicated adapter | Rich detail state: header, returned items, reason, refund data, notes, timeline, tracking, label, actions, and not-found state. Convert only after returns list and order identity handling. |
| 20 | `/account/subscriptions` | No dedicated adapter | A subscription list with authenticated runtime data. It is the precursor to the more action-heavy subscription detail route. |
| 21 | `/account/subscriptions/[id]` | Opaque `SubscriptionDetailStateSection` fallback | Requires faithful canonical composition around billing history, payment, pause/resume/skip/cancel/modify actions, failed-payment state, and subscription identity metadata. |
| 22 | `/account/addresses` | Opaque `AccountAddressesStateSection` fallback | Source is primarily `AddressManager`; convert it as a thin source delegate once production address mutations and authentication context are available in the target runtime. |
| 23 | `/account/payment-methods` | No dedicated adapter | Authenticated Stripe-sensitive page with payment method list, empty state, add-card action, and card form. Do not implement an imitation payment form in Puck. |
| 24 | `/account/settings` | No dedicated adapter | Mostly account-shell and settings navigation structure. It is low visual risk but should use real source components and authenticated behavior. |
| 25 | `/account/sessions` | No dedicated adapter | Similar account-shell work, but session list/revocation behavior must use the original authenticated session flow. |
| 26 | `/account` | No dedicated adapter | Account overview/dashboard. Convert after account navigation, identity, and common account runtime context are canonicalized by the routes above. |

## Canonical Conversion Process

Apply this process to one route family at a time. Dynamic parent/detail routes
should be converted together only when they share identity and data loaders;
otherwise preserve a separately testable vertical slice.

1. **Audit the original route first.** Read its `page.tsx`, utility/data-loader
   files, imported production components, suspense boundaries, route/search
   parameters, and every conditional expression. Record the exact JSX tree,
   Tailwind classes, data dependencies, and conditions. Do not infer the layout
   from a screenshot or from the existing seed.

2. **Define the source contract.** Identify required JSX regions, direct leaf
   component calls, dynamic parameters, runtime data, and each branch owner.
   For example, `products.length > 0` belongs to the results-state canonical
   renderer, not a parser-generated unconditional list of both branches.

3. **Extract canonical renderers in `dnd-test`.** Add a route-domain folder such
   as `components/<domain>/canonical`. Each renderer owns only the source JSX it
   represents: identical element order, classes, responsive visibility,
   `Suspense` boundaries, and conditions. Prefer a small hierarchy of source
   regions over one opaque runtime section or generic layout components.

4. **Create thin colocated Puck Views.** Pair every renderer with a `*View` that
   declares Puck fields and slots, resolves route/search metadata, supplies
   editor-only preview data, and delegates to the canonical renderer. A View
   must not redraw a production leaf with substitute markup.

5. **Delegate leaves to production-compatible code.** Where a source component
   is already available in `dnd-test`, pass its real props directly. If it must
   be copied from TemplateFrontend, preserve its behavior and dependencies;
   add only the minimal adapter needed for Puck server rendering. Never replace
   a source component with hand-built card, grid, form, or action UI.

6. **Implement shared route runtime loading.** Normalize each route's backend
   data once per render request where practical. Every data-aware View must read
   `puck.metadata` route and search parameters explicitly; no slot child may
   rely on invisible parent prop plumbing. Use production service semantics,
   including headers, empty responses, and errors.

7. **Keep conditional behavior source-owned.** Represent editable branches as
   slots when editors need access to both, but let the canonical source-specific
   renderer decide which branch appears at runtime. Do not resolve runtime
   ternaries at parse time, render both branches as siblings, or expand fetched
   arrays into static Puck JSON.

8. **Register explicit AST metadata.** Add `puckAst` metadata for every
   canonical View: source import path, JSX name, ancestor signature, runtime
   role, slot target, boundary ownership, and conditional ownership. Regenerate
   the Puck config/manifest after registration.

9. **Add an import-aware route adapter to `ast-parser.ts`.** The adapter must
   start from the original JSX return tree, validate the source contract, look
   up canonical types through manifest metadata, and emit the nested slot shape
   in source order. A missing required region or condition is a diagnostic and
   a failed conversion, never a plausible generic fallback.

10. **Regenerate seed and diagnostics.** Run the parser for the actual source
    route, replace the corresponding seed intentionally, and inspect its report
    under `data/seeds/_reports`. The seed must contain canonical hierarchy and
    only known Puck component types.

11. **Add executable source-parity checks.** Create a route-specific QA script
    that verifies source signatures, canonical renderer structure, direct leaf
    delegation, manifest entries, seed nesting, forbidden fallbacks, and route
    metadata. Add an npm script alongside the existing products/category checks.

12. **Perform editor and published-page parity QA.** Compare the original route
    and `/editor?slug=<seed>` visually, then test the published route using the
    same backend data and URL state. Confirm loading, empty, error, responsive,
    conditional, filtering, paging, and mutation behavior where applicable.
    A route is not canonicalized until both the parser diagnostics and its
    published behavioral checks are clean.

## Non-Negotiable Guardrails

- The parser must emit canonical structures from verified source signatures,
  not route-name or keyword shortcuts.
- Puck slots are for editable hierarchy; runtime fetches and conditions remain
  in dedicated source-domain renderers.
- Keep Puck preview data editor-only. Published pages must use production data
  services and route metadata.
- Do not introduce generic raw HTML blocks or replacement UI for behaviorful
  source code.
- Cart, checkout, account, payment, auth, and order routes must use the original
  production infrastructure after migration. Their current testbed stand-ins
  are not a valid basis for functional parity.
