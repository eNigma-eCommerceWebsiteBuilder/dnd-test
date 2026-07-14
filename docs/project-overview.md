# dnd-test Project Overview

## What It Is

`dnd-test` is the Puck integration testbed for
`eNigma-TemplateFrontend`, the production Next.js storefront. Its purpose is to
turn real TemplateFrontend pages into editable Puck seed JSON, let authors edit
those pages in Puck, and publish pages that retain the original storefront's
visual structure and runtime behavior.

It is not intended to become a separate replacement storefront. It is the
proving ground for Puck-compatible components, parser behavior, seed generation,
and published-page rendering before the work is migrated into
`eNigma-TemplateFrontend`.

## Main Flow

1. `eNigma-TemplateFrontend/ast-parser.ts` reads a real source route and writes
   Puck seed JSON into `dnd-test/data/seeds`.
2. Puck loads the seed in `/editor?slug=<page-slug>` using the generated Puck
   component configuration and manifest.
3. Editors rearrange or edit supported components and slots.
4. `dnd-test` renders the saved seed at `/page/<slug>` (and supported dynamic
   nested routes), using route metadata and production-compatible API services.
5. Parser diagnostics and route-specific parity checks identify unmapped source
   JSX, unsupported conditions, unknown Puck types, or unsafe fallbacks.

## Architecture

- `components/`: Puck-compatible Views and supporting renderers.
- `components/products/canonical` and `components/categories/canonical`:
  source-faithful canonical renderers paired with thin Puck adapters. These
  preserve real JSX structure instead of replacing a whole page with one
  generic runtime block.
- `enigma-components/`: production-compatible component copies/delegates used
  by Views when source behavior needs to be retained.
- `lib/puck-components.*` and `lib/puck-ast-manifest.json`: generated Puck
  configuration and parser metadata. Do not edit generated files directly.
- `data/seeds/`: generated/editable Puck data, with parser reports under
  `data/seeds/_reports`.
- `scripts/generate-puck-config.ts`: discovers component metadata and generates
  client/server Puck configuration plus the AST manifest.
- `scripts/run-parser-to-dnd-test.ps1`: runs the TemplateFrontend parser and
  writes its outputs into this testbed.
- `app/page/[slug]` and `app/page/[slug]/[entitySlug]`: published-page routes
  that supply route metadata to data-aware Puck components.

## Current Canonical Coverage

The following source routes have canonical, nested parser treatment and
route-specific parity scripts:

- `/products`
- `/products/[slug]`
- `/categories`
- `/categories/[slug]`

For these pages, the parser validates source signatures and emits a hierarchy of
known Puck components and slots. The Views delegate to source-compatible leaves
where possible, and runtime data/conditions are owned by dedicated canonical
renderers rather than flattened into static seed data.

All other routes still need the same treatment. The ordered implementation
backlog and repeatable conversion procedure are in
[canonical-parser-candidate-routes.md](canonical-parser-candidate-routes.md).

## Useful Commands

```powershell
# Start the Puck testbed.
npm run dev

# Regenerate Puck configuration and the AST manifest after component metadata changes.
npm run generate:puck-config

# Parse TemplateFrontend routes into dnd-test seeds.
npm run seeds:parse-template

# Run canonical parity checks for completed slices.
npm run qa:catalog-parity
npm run qa:product-detail-parity
npm run qa:categories-page-parity
npm run qa:category-detail-parity
```

## Important Boundaries

- Puck preview data exists only to make the editor understandable. Published
  pages must read the same backend data and route/search state as the real page.
- Runtime arrays, conditions, loading boundaries, empty states, and errors must
  stay in source-domain components; the parser must not convert them into fixed
  JSON repetitions or show both conditional branches unconditionally.
- Views are adapters, not redesigns. They should pass the original props to
  original or production-compatible components rather than recreate their DOM.
- Cart, checkout, authentication, payment, account, and order mutations still
  require the original production infrastructure for true functional parity.
  Testbed replacement stores or server actions are not a valid final solution.
