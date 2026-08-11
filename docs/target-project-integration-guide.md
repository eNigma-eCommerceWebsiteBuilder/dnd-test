# Use `dnd-test` With Any Puck-Enabled Next.js Project

`dnd-test` is a parser, not a website runtime. It reads a compatible Next.js
project's real route JSX and writes Puck seed JSON plus diagnostics into that
same target project.

It does **not** create a separate Next.js page file for every source route.
The target project must already own the Puck editor, published-page renderer,
and generic `/page/<route-id>` routing. The generated seed is the data those target-owned routes open, edit, and publish.

## Result

For every declared source route, a successful run creates or updates:

```text
<target>/data/puck/seeds/<route-id>.json
<target>/data/puck/reports/<route-id>.report.json
```

The runner does not overwrite the target's saved publications, normally stored
separately as `data/puck/pages.json`.

## Compatibility Checklist

Before running the parser against a new project, confirm all of these are true.

- It is a Next.js project with its real page source files available locally.
- It owns its Puck editor and published renderer. The recommended contract is
  `/editor?slug=<route-id>` and `/page/<route-id>` or
  `/page/<route-id>/<entitySlug>`.
- It has a `puck/definitions/` directory containing its thin Puck adapters.
- Its `npm run puck:generate` command creates
  `puck/generated/site-manifest.json`.
- Its `npm run puck:validate` command validates the generated manifest.
- The generated manifest conforms to `@enigma/puck-site-contract` version 1.
- Every parseable route is declared in the target's route source, normally
  `puck/site.ts`, with a route ID, real `sourceFile`, route pattern, and root parser role.
- Every JSX component the parser should capture has a parser-eligible Puck definition with source-matching metadata and a unique AST role.
- The target has `lib/content.ts` exporting `siteContent` when its pages refer to static site content. This is a current parser input contract; the parser reads this source file statically rather than importing it at runtime.

The first seven items are target application responsibilities. `dnd-test`
cannot infer missing Puck components, missing route composition, or a missing
published-page renderer.

## One-Time Target Setup

### 1. Make the shared contract resolvable

The target config generator imports `@enigma/puck-site-contract`. In a local multi-project workspace, add it as a file dependency:

```powershell
cd D:\projects\my-storefront
npm install --save-dev file:..\dnd-test\packages\puck-site-contract
```

If the projects are not siblings, use the appropriate relative file path or
publish/install the same version of the contract package through your normal package registry.

### 2. Define routes in the target

The target's route configuration is the parser's route discovery source. A minimal route declaration has this shape:

```ts
route(
  "products",
  "app/products/page.tsx",
  "/products",
  "catalog-layout",
);
```

`id` becomes the seed filename (`products.json`) and the Puck page identifier.
`sourceFile` must be a portable path relative to the target root. The parser
never discovers routes by crawling `app/`; only declared routes are parsed.

### 3. Define parser-aware Puck adapters

Each component that should appear in generated Puck data needs a Puck adapter inside `puck/definitions/`. It should be a thin delegate to production JSX, not a replacement UI.

The target config generator requires these exports:

```tsx
export const puckComponentName = "CatalogHeader";
export const puckLabel = "Catalog Header";
export const puckCategory = "Products";
export const puckFields = {
  content: { type: "slot", allow: ["Breadcrumbs", "CatalogTitle"] },
};
export const puckDefaults = { content: [] };

export const puckAst = {
  kind: "static",
  role: "catalog-header",
  slots: ["content"],
  sourceJsxNames: ["CatalogHeader"],
  sourceImportPaths: ["@/components/products/CatalogHeader"],
  slotTarget: "header",
};

export function CatalogHeaderView({ content: Content }) {
  return <CatalogHeader>{Content}</CatalogHeader>;
}
```

For a component to be parser-eligible, `puckAst` must at least have a unique
`role`, a `kind` (`static` or `runtime`), `sourceJsxNames`, and
`sourceImportPaths`. Add `slots`, source structural matching, condition,
runtime signal, list, and variant metadata when the source JSX needs them.

The source import path and JSX names must match the real route's imports and
JSX usage. This is how the parser identifies components; route-name keywords
are not a substitute for metadata.

### 4. Supply valid composition rules

The generated manifest must define which root type and slot children are valid
for every route. A target generator can build that from any combination of:

- a prior validated seed;
- an initial `puck/route-composition-bootstrap.json`;
- declared Puck slot `allow` rules; or
- explicit route composition logic in the generator.

For a brand-new route, provide the root role and slot allowances before its
first parser run. This prevents a plausible but structurally invalid seed from
being accepted.

### 5. Generate and validate the target manifest

From the target root:

```powershell
npm install
npm run puck:generate
npm run puck:validate
```

Expected output includes a valid `puck/generated/site-manifest.json`. Inspect
it before parsing: it must list the intended route IDs, their real source files,
the component metadata, and route composition.

## Generate Seeds

Install parser dependencies once:

```powershell
cd D:\projects\dnd-test
npm install
```

Then run the full parser against the target. In the normal case, both paths are
the same project:

```powershell
cd D:\projects\dnd-test
powershell -ExecutionPolicy Bypass -File .\scripts\run-parser-to-dnd-test.ps1 `
  -TemplateFrontendRoot "D:\projects\my-storefront" `
  -PuckTargetRoot "D:\projects\my-storefront"
```

`TemplateFrontendRoot` is a legacy parameter name. It means the root containing
the real Next.js route source. `PuckTargetRoot` means the root containing the
Puck manifest and where seeds/reports should be written. Use different paths
only when a deliberate source-to-target adapter arrangement exists.

For one route while iterating on metadata or JSX:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-parser-to-dnd-test.ps1 `
  -TemplateFrontendRoot "D:\projects\my-storefront" `
  -PuckTargetRoot "D:\projects\my-storefront" `
  -RouteId products
```

The runner automatically:

1. Runs the target's `puck:generate` command.
2. Reads `puck/generated/site-manifest.json` to discover declared routes.
3. Parses each declared real JSX route against target-owned AST metadata and
   composition.
4. Writes `data/puck/seeds/<route-id>.json` and
   `data/puck/reports/<route-id>.report.json` in the target.
5. Requires clean diagnostics for every route.
6. Runs target `puck:generate` and `puck:validate` again.

A correct full run ends with `Success: <count> / <count>` and `Fail: 0`.

## Open The Generated Pages

Start the target Next.js app, then use its own Puck runtime:

```powershell
cd D:\projects\my-storefront
npm run dev
```

Examples, assuming the target follows the recommended route contract:

```text
http://localhost:3000/editor?slug=products
http://localhost:3000/page/products
http://localhost:3000/editor?slug=product-detail&entitySlug=wool-scarf
http://localhost:3000/page/product-detail/wool-scarf
```

The editor reads the new seed when no saved published page exists. Publishing
creates or updates the target's persisted page data; the parser itself only
creates the seed baseline and diagnostics.

## Diagnose Failures Correctly

| Symptom | Meaning | Fix |
| --- | --- | --- |
| `Generated target site manifest is missing` | The target did not generate the required contract artifact. | Implement/fix `puck:generate`, then run it in the target root. |
| Unknown root role or unknown component type | Route metadata and Puck adapter metadata disagree. | Add/fix the target adapter role, component type, or route composition. |
| Missing input route | A manifest `sourceFile` does not exist relative to the source root. | Correct the route declaration; do not rename the real file just for the parser. |
| `diagnostics are not clean` | JSX was dropped, important HTML was unmatched, or a condition could not be represented. | Read the matching report; add a thin adapter and `puckAst` metadata rather than accepting the seed. |
| A JSON seed exists but the launcher failed | The parser can write a seed before diagnostics are evaluated. | Treat it as invalid until the report is clean and the launcher reports PASS. |
| Static content cannot load | The current parser expects `lib/content.ts` with a `siteContent` export. | Add/restore that target static-content module, or extend the parser with a new explicit content-source adapter. |
| A component is absent from generated data | It lacks parser metadata, its source imports do not match, or it is outside the route composition. | Add a thin target-owned Puck adapter, accurate `puckAst`, and valid slot/composition rules. |

## Guardrails

- Keep real Next.js routes unchanged while testing. Publish only to the target's
  Puck `/page` namespace.
- Never use raw generic HTML blocks to silence diagnostics for behavior-bearing
  source regions. Add a specific, target-owned Puck adapter.
- Keep runtime conditions inside their corresponding source-specific owner;
  do not emit both branches as unconditional siblings.
- Do not manually edit generated seeds to hide parser gaps. Fix the target
  adapter metadata or parser behavior, then regenerate.
- Run the target's Puck validation after every component, route, or seed
  structure change.

## Preflight Command Set

Run this before accepting a new target integration:

```powershell
# In dnd-test
npm run parser:check
npm run parser:typecheck
npm run contract:typecheck
npm run contract:test

# In the target
npm run puck:check

# Back in dnd-test: full direct regeneration
npm run seeds:regenerate-target -- `
  -TemplateFrontendRoot "D:\projects\my-storefront" `
  -PuckTargetRoot "D:\projects\my-storefront"
```

Only begin editor and visual testing after every command completes successfully.
