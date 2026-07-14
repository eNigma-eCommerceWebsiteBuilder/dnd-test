# Before Migration Cleanup Plan

## Summary

Keep `dnd-test` runnable as a Puck integration testbed for now, but before moving the work into `eNigma-TemplateFrontend`, remove all replacement production infrastructure from the migration surface. The production repo should supply its own hooks, actions, stores, API services, auth, analytics, content, and utility infrastructure.

The goal is to migrate only Puck-specific editor/parser/rendering code and Puck-compatible component wrappers, without overwriting or shadowing working production systems.

## Core Rule

Puck components may import normal production paths such as `@/lib/api`, `@/lib/hooks`, `@/lib/actions`, `@/lib/stores`, and `@/lib/utils`, but those imports must resolve to the real `eNigma-TemplateFrontend` implementations after migration.

Do not copy `dnd-test` replacement implementations for those paths into production.

## Keep For Migration

- Puck-compatible component wrappers and `*View.tsx` files.
- Runtime/domain Puck components that preserve page behavior.
- `scripts/generate-puck-config.ts`.
- Generated Puck config pattern, regenerated inside `eNigma-TemplateFrontend`.
- `lib/puck-components.jsx`.
- `lib/puck-components.server.jsx`.
- `lib/puck-ast-manifest.json`.
- `lib/puck-route-metadata.ts`.
- Puck page rendering route, adapted to production page storage.
- Puck editor route, if production should host the editor.
- `ast-parser.ts`, parser backups, parser docs, seed/report tooling.
- Seed JSONs as fixtures or migration examples, not as production infrastructure.

## Exclude From Migration

- `lib/api/**`
- `lib/actions/**`
- `lib/hooks/**`
- `lib/stores/**`
- `lib/auth/**`
- root `auth.ts`
- `app/api/backend/**`
- replacement `lib/analytics/**`
- replacement `lib/content.ts`
- `dnd-test` shim providers or no-op hooks.
- Browser API proxy or browser-only backend compatibility hacks.
- Any local implementation whose purpose is to make `dnd-test` behave like production outside the real production app shell.

## Component Cleanup Before Migration

- Verify each Puck component imports only production-compatible aliases.
- Replace any dependency on `dnd-test` shims with the real production equivalent.
- Keep tiny Puck-only helpers only when they are genuinely specific to Puck rendering or parser metadata.
- Runtime/domain components should call production fetchers, hooks, stores, and server actions directly.
- Do not migrate fake cart, wishlist, auth, checkout, subscription, analytics, or API behavior.

## Expected Production Flow

```text
Puck JSON
 -> Puck render route
 -> Puck component config
 -> Puck-compatible components
 -> production hooks/actions/api/stores
 -> real backend/session/cookies/cache
```

For example, Quick Add should use the production flow:

```text
ProductCard
 -> useCart()
 -> useCartStore.addItem()
 -> optimistic cart update
 -> addToCartAction()
 -> server-side backend API call
 -> returned cart
 -> store hydrate + mini-cart update
```

## Validation Checklist

- `ProductGrid` Quick Add uses the production cart hook/store/server-action flow.
- Wishlist actions use production wishlist hooks/store/actions.
- Auth/account components use production auth/session behavior.
- Checkout, subscription, order, review, return, and digital-download components use production server actions and services.
- Puck render route forwards or has access to production cookies/request context where needed.
- No production infrastructure file is overwritten by a `dnd-test` replacement.
- Puck config is regenerated inside `eNigma-TemplateFrontend`.
- Production typecheck passes.
- Production lint passes.
- Published Puck pages render and behave correctly on products, cart, checkout, search, account, category, collection, subscription, returns, and downloads routes.

## Timing

Do not perform this cleanup immediately while `dnd-test` is still needed as a standalone testbed. Perform it as a final pre-migration step, or create a separate migration package/export that includes only the allowed files above.

