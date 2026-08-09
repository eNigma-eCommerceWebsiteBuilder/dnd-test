# Full JSX Parser Resolution Implementation

## Latest Rebaseline: 2026-08-04

The parser now targets the 32 routes in the latest clean TemplateFrontend tree.
The removed `checkout-subscription` and `account-payment-methods` routes are no
longer emitted; `auth-complete`, `auth-storefront-account`, `policies-privacy`,
and `policies-terms` are included. Current verification is:

```text
Puck config:       441 client components, 212 data-aware server components
Route generation:  32 / 32 passed with clean diagnostics
Published data:    32 / 32 seeds applied
Fixture matrix:    1,129 cases, 32 routes, 290 slots passed
dnd-test tsc:      passed
```

## Result

The fixed-role parser has been replaced by a common import-aware JSX-to-Puck
engine. Route awareness now identifies the valid root, delegated source
modules, and route-family grammar; it no longer prescribes a component array or
hard-coded sibling order.

For the current canonical component collection, the parser can resolve valid
route-specific combinations directly from JSX, including:

- nested JSX-valued props and Puck slots;
- fragments and sibling source order;
- optional allowed components;
- repeated components where the grammar permits repetition;
- canonical conditional and runtime-list owners;
- delegated page/client component source trees; and
- source-derived static scalar props.

Unknown visible JSX, invalid slot placement, missing roots, dropped components,
unmatched visible HTML, or parser warnings make generation fatal. A failed run
still writes its report but leaves an existing seed unchanged.

## Main Implementation

- `dnd-test/scripts/templatefrontend-parser/ast-parser.ts`: public CLI entry point.
- `dnd-test/scripts/templatefrontend-parser/ast-parser-engine.ts`: common recursive parser,
  matching, prop extraction, diagnostics, and composition validation.
- `dnd-test/scripts/templatefrontend-parser/ast-parser-route-profiles.ts`:
  declarative profiles for all 32 routes and their delegated source modules.
- `dnd-test/scripts/generate-puck-config.ts`: manifest and route-composition
  generation with metadata validation.
- `dnd-test/lib/puck-ast-manifest.json`: generated canonical matching contract.
- `dnd-test/lib/puck-route-composition.json`: generated route/slot grammar.
- `dnd-test/scripts/check-full-jsx-parser-resolution.ts`: generated fixture
  matrix and failure-preservation checks.
- `dnd-test/scripts/run-parser-to-dnd-test.ps1`: strict 32-route regeneration.
- `dnd-test/scripts/apply-seed-to-page.ts`: clean-report, non-empty, and
  canonical-type application gates.

## Verification

Executed on 2026-07-29:

```text
Puck config:       411 client components, 200 data-aware server components
Route generation:  30 / 30 passed
Route parity:      30 / 30 passed
Fixture matrix:    1,125 cases, 30 routes, 291 slots passed
Checkout subscription: 4,225 exhaustive full-page combinations passed
dnd-test tsc:      passed
Template tsc:      passed
```

The matrix derives cases from the generated grammar rather than maintaining
fixed route-specific output arrays. It verifies allowed finite subsets,
reversed order, repeatable components, unknown visible component rejection,
and preservation of a pre-existing output file on parser failure.

`checkout-subscription` additionally has a full-page cross-product check. It
keeps the real state/layout/header/steps hierarchy, then combines every ordered
distinct subset of the four left-column sections with every ordered distinct
subset of the four right-column sections: 65 x 65 = 4,225 complete source
trees. Every tree was emitted with the same Puck hierarchy and ordering.

## Acceptance Boundary

These results establish JSX-tree resolution, canonical component matching,
slot grammar enforcement, seed safety, and thin-adapter structural parity.
They do not replace browser screenshot comparison. Desktop, tablet, and mobile
visual regression remains the final rendered parity check.
