# Component Standard For Target-Owned Puck Parsing

This is the binding standard for a component or page region in a Next.js target
that must work with the complete eNigma Puck system:

```text
real Next.js JSX -> target Puck definition -> generated manifest
-> dnd-test AST parser -> seed JSON -> target editor -> published /page render
```

The goal is visual and structural fidelity. Puck data must represent the real
JSX hierarchy with target-owned, thin adapters. It must not replace a page with
a generic block or independently redesigned UI.

## Ownership

| Layer | Owner | Purpose |
| --- | --- | --- |
| Production component and real page JSX | Target Next.js project | The visual and behavioral source of truth. |
| Canonical structural renderer | Target Next.js project | Exact extracted JSX when page-level structure needs a named Puck boundary. |
| Puck View adapter and metadata | Target Next.js project | Editor fields, slots, preview behavior, parser matching, and server data bridge. |
| Puck route manifest and config generation | Target Next.js project | Declares routes, valid component grammar, generated client/server configs. |
| Seed and published data | Target Next.js project | Generated baseline and saved author edits. |
| AST parser and contract validator | `dnd-test` | Reads target JSX and emits only target-declared Puck types. |

`dnd-test` must never become the home for target production components, Puck
Views, the editor, published routes, or backend service substitutes.

## 1. Production Component Requirements

A production component remains a normal Next.js component in the target's
`components/` directory. It may be a Server Component or a Client Component.

- Keep its real DOM, semantic elements, Tailwind classes, class ordering,
  Suspense boundaries, and source prop flow intact.
- Give it typed, explicit props. A Puck View must be able to delegate the same
  complete values without recreating its internal markup.
- Keep backend calls, stores, client actions, and conditional behavior in the
  production/domain owner that already owns that behavior.
- Keep runtime list iteration (`products.map`, cart items, fetched collections)
  in a runtime owner; never expand it into repeated static seed blocks.
- Do not import Puck into a plain production leaf merely to make it editable.

If a component is already a suitable leaf, its Puck View should call it
directly. For example, `ProductGridView` delegates complete `Product[]` data to
`ProductGrid`; it must not recreate the grid by rendering `ProductCard` itself.

## 2. Canonical Structural Renderer Requirements

Create a canonical renderer when a real page's meaningful structure is inline
JSX rather than an existing reusable component: a page wrapper, two-column
layout, header row, conditional boundary, or named section wrapper.

Place it with the target Puck definitions, for example:

```text
puck/definitions/products/canonical/ProductsCatalogLayout.tsx
puck/definitions/products/canonical/ProductsCatalogLayoutView.tsx
```

The renderer is an exact structural extraction from the real source route.

- Preserve original tags, nesting, class names, source order, and Suspense
  fallbacks.
- Accept `ReactNode` values for the regions that become Puck slots.
- Contain only the JSX it owns. Do not add generic wrappers, alternate markup,
  editor controls, or replacement leaves.
- Use source-specific names even when similar layouts exist on other routes.
  Reuse only lower-level non-Puck helpers after source-parity evidence proves
  that reuse does not alter markup.
- Add a concise comment recording the source route when the extraction is not
  self-evident.

```tsx
import type { ReactNode } from "react";

interface CatalogHeaderLayoutProps {
  breadcrumbs?: ReactNode;
  title?: ReactNode;
  controls?: ReactNode;
}

// Extracted from app/products/page.tsx; preserve its DOM and class sequence.
export function CatalogHeaderLayout({
  breadcrumbs,
  title,
  controls,
}: CatalogHeaderLayoutProps) {
  return (
    <div className="mb-10">
      {breadcrumbs}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {title}
        {controls}
      </div>
    </div>
  );
}
```

## 3. Thin Puck View Adapter Requirements

Every parser-visible Puck component is a target-owned `*View.tsx` module under
`puck/definitions/`. It adapts Puck's fields and slots to the real production
component or canonical renderer.

The target config generator requires these exports:

```tsx
export const puckComponentName = "CatalogHeaderLayout";
export const puckLabel = "Catalog Header Layout";
export const puckCategory = "Products";
export const puckFields = { /* Puck fields and slots */ };
export const puckDefaults = { /* JSON-safe defaults */ };
export const puckAst = { /* parser metadata */ };
export function CatalogHeaderLayoutView() { /* render delegate */ }
```

The generator resolves the component export by file name. A file named
`CatalogHeaderLayoutView.tsx` must export either a default component,
`CatalogHeaderLayoutView`, or `CatalogHeaderLayout`.

Adapter rules:

- Delegate directly to a production component or canonical renderer.
- Do not copy lower-level DOM, recreate a grid/card, or write a visually
  similar replacement implementation.
- Keep Puck-only preview props and fields confined to the View. They must not
  change published behavior.
- Keep fields and defaults JSON-safe. Functions, class instances, React nodes,
  secrets, request objects, and backend responses do not belong in seed data.
- A View may add only the translation necessary for slots, editor preview, or
  server data. Explain non-obvious translation with a short comment.

## 4. Native Slots And Composition

Use Puck native `slot` fields for nested page regions. Do not flatten a nested
JSX tree into unrelated top-level siblings and do not introduce raw HTML blocks.

```tsx
import { puckTransparentSlotProps, type CatalogSlot } from "./types";

interface CatalogHeaderLayoutViewProps {
  breadcrumbs?: CatalogSlot;
  title?: CatalogSlot;
  controls?: CatalogSlot;
}

export const puckFields = {
  breadcrumbs: { type: "slot" as const },
  title: { type: "slot" as const },
  controls: { type: "slot" as const },
};

export const puckDefaults = { breadcrumbs: [], title: [], controls: [] };

export function CatalogHeaderLayoutView(props: CatalogHeaderLayoutViewProps) {
  return (
    <CatalogHeaderLayout
      breadcrumbs={props.breadcrumbs?.(puckTransparentSlotProps)}
      title={props.title?.(puckTransparentSlotProps)}
      controls={props.controls?.(puckTransparentSlotProps)}
    />
  );
}
```

For every slot:

- `puckFields.<slot>` must have `type: "slot"`.
- `puckDefaults.<slot>` must be an empty array unless an intentional editor
  seed is required.
- Omit editor `allow` by default so authors can place any Puck component in the
  slot. Use it only when the product explicitly requires an editing constraint.
- `puckAst.slots` must name the same slots.
- `puckAst.parserChildren` should describe the source-valid children for each
  slot. It constrains parser validation without constraining drag-and-drop.
- The canonical renderer must render the matching prop at the original source
  position.
- The route composition must allow the parent/slot/child relationship.

Puck slots are the supported nested composition model and are compatible with
server rendering when the server config preserves slot field information. See
[Puck slot fields](https://puckeditor.com/docs/api-reference/fields/slot) and
[Puck React Server Components](https://puckeditor.com/docs/integrating-puck/server-components).

## 5. Parser Metadata: `puckAst`

`puckAst` is the contract between real JSX and the AST parser. A parser-eligible
component needs a unique role, kind, source JSX names, and source import paths.

```tsx
export const puckAst = {
  kind: "static", // "static" or "runtime"
  role: "catalog-header-layout", // unique across the target
  slots: ["breadcrumbs", "title", "controls"],
  parserChildren: {
    breadcrumbs: ["CatalogBreadcrumbs"],
    title: ["CatalogTitleSummary"],
    controls: ["CatalogControlsLayout"],
  },
  sourceJsxNames: ["CatalogHeaderLayout"],
  sourceImportPaths: ["@/puck/definitions/products/canonical/CatalogHeaderLayout"],
  slotTarget: "header",
  requiredClasses: ["mb-10", "lg:flex-row", "lg:items-end"],
  match: {
    tag: "div",
    rootClasses: ["mb-10"],
  },
  routes: ["products"],
};
```

Metadata rules:

- `role` is unique and is the route's root-role/composition identifier.
- `kind: "static"` means output comes from source/static props; it does not
  mean the rendered page cannot receive normal styling or links.
- `kind: "runtime"` means a data fetch, route state, client state, condition,
  or runtime list influences the output.
- `sourceJsxNames` must use the actual imported JSX identifier(s), including
  aliases where applicable.
- `sourceImportPaths` must match the real source import path after the target's
  normal alias resolution. Do not use a route-name keyword as a parser hint.
- `match` and `requiredClasses` are additional structural evidence for inline
  HTML/canonical boundaries. They must describe the real source, not desired
  output.
- Set `slotTarget` to the parent slot that owns this component.
- Use `parserChildren` to declare expected source composition independently of
  optional Puck editor `allow` restrictions.
- Describe source conditions with `conditional` and data dependencies with
  `runtimeSignals`.
- Use `list` metadata only for a declared list owner. The parser must not turn
  runtime arrays into static duplicated children.
- Set `parserEligible: false` only for a Puck component intentionally excluded
  from AST output, such as editor-only support UI.

If the parser cannot match an important region, add an accurate target adapter
and metadata. Do not add a broad fallback that inserts a large page component
based only on the route name.

## 6. Runtime Data And Conditional State

Published pages must use real target behavior. Editor preview values exist only
to make components visible and editable before real data is available.

- Put backend fetch logic in a route/domain runtime loader or a Puck data
  fetcher, not in static seed JSON.
- Use `PuckFetcherContext` and `puck/route-metadata.ts` to read route params,
  search params, and request cookies. Do not depend on editor-only props for
  published behavior.
- A runtime View can export `puckDataFetcher` or a server fetcher declaration
  so the generated server config resolves data before rendering.
- Keep source conditions in the component that owns them. A results-state
  component may contain both `results` and `empty` slots but renders exactly
  one according to the real runtime condition.
- Runtime branches must never become unconditional sibling blocks in seed JSON.
- Errors, authentication redirects, empty states, and not-found states must be
  deliberate source-specific regions, not generic parser fallbacks.

```tsx
export const puckAst = {
  kind: "runtime",
  role: "catalog-results-state",
  slots: ["results", "empty"],
  sourceJsxNames: ["CatalogResultsState"],
  sourceImportPaths: ["@/puck/definitions/products/canonical/CatalogResultsState"],
  conditional: "products.length > 0",
  runtimeSignals: ["products.items"],
};

export async function puckDataFetcher(_props: unknown, context?: PuckFetcherContext) {
  const runtime = await loadCatalogRuntime(context);
  return { hasProducts: runtime.productsData.items.length > 0 };
}
```

For dynamic routes, the target renderer maps its generic Puck entity parameter
to the route parameters expected by the real domain loader. Keep this mapping
in the target's publication/route helper; never bake a product slug, order ID,
or token into the seed.

## 7. Client Interactivity And Server Rendering

The editor config and published server config are separate generated artifacts.

- The editor route may import the interactive `<Puck>` client component and
  `config.client`.
- The published `/page` route must use the RSC-compatible `Render` API and
  `config.server`.
- A Client Component needed by production interaction must retain its
  `"use client"` boundary and be imported through an adapter safe for both
  generated configs.
- Do not import editor UI, Puck CSS, or editor-only state into public
  storefront routes or published renderer components.
- Use the original target stores, server actions, and API clients for cart,
  checkout, account, and mutation behavior. A parser seed is page structure,
  not a replacement application backend.

## 8. CSS, Layout, And Assets

Visual parity requires the target's real layout environment.

- The target's global theme, Tailwind tokens, fonts, reset, and layout shell
  must be available to both real and published Puck routes.
- Canonical renderers retain source classes. Do not compensate for a missing
  target token by adding arbitrary View-only styles.
- Use the target's existing `next/image` configuration, asset host allow-list,
  and image URL normalization. Do not substitute preview assets on published
  pages.
- Verify desktop and mobile layouts. Editor iframe dimensions are not proof of
  published page parity.
- Header/footer ownership must be consistent: either the target app layout
  renders them for both routes, or the matching Puck page tree explicitly owns
  them. Never render them twice.

## 9. Route And Manifest Requirements

Each parseable page is declared in the target's `puck/site.ts` (or equivalent)
with a stable ID, real source file, public source route pattern, and required
root role.

```ts
route("products", "app/products/page.tsx", "/products", "catalog-layout");
```

- The route ID becomes the seed filename and `/editor?slug=<route-id>` value.
- The source file is relative to the target root and points to real JSX.
- The required root role must exist on one unique parser-eligible component.
- Declared delegates are allowed only when source route JSX intentionally
  delegates page structure to another target-owned module.
- The target generator must validate route roots, Puck types, slots, and
  composition before the parser runs.

## 10. Required Validation Sequence

Run this sequence whenever a component, route, metadata hint, or canonical
layout changes:

```powershell
# Target project
npm run puck:check

# Parser project
cd ..\dnd-test
npm run parser:check
npm run parser:typecheck
npm run contract:typecheck
npm run contract:test

# Parse the changed route first
powershell -ExecutionPolicy Bypass -File .\scripts\run-parser-to-dnd-test.ps1 `
  -TemplateFrontendRoot "D:\projects\my-storefront" `
  -PuckTargetRoot "D:\projects\my-storefront" `
  -RouteId products
```

Accept the change only when:

- target Puck generation, validation, and typecheck pass;
- the route report has no errors, warnings, dropped components, or unmatched
  important HTML;
- the generated seed has the expected root and nested slot tree;
- the target editor outline matches the meaningful source JSX hierarchy; and
- the target `/page` route visually matches the real source route for the same
  data, URL, viewport, and authentication state.

Run full regeneration after the focused route passes:

```powershell
npm run seeds:regenerate-target -- `
  -TemplateFrontendRoot "D:\projects\my-storefront" `
  -PuckTargetRoot "D:\projects\my-storefront"
```

## Definition Of Done

A component is fully integrated only when it has all applicable layers:

- Real production component or exact canonical structural renderer.
- Thin target-owned Puck View adapter.
- Complete Puck fields and JSON-safe defaults.
- Correct `puckAst` identity, source matching, slots, and runtime metadata.
- Valid route composition and manifest presence.
- Real published runtime behavior, with preview data isolated to editor mode.
- Clean parser diagnostics and regenerated seed.
- Visual parity verified at desktop and mobile widths.
