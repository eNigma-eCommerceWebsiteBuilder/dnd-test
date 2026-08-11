# Target-Owned Architecture

## Current State

- `eNigma-TemplateFrontend` owns the Puck application: 333 component definitions, 32-route manifest, editor, `/page` renderer, persistence API, seeds, diagnostics, and generated configuration.
- The real storefront routes remain unchanged. Editing is available at `/editor?slug=<route-id>` and published Puck pages at `/page/<route-id>` or `/page/<route-id>/<entitySlug>`.
- `dnd-test` is now parser-only. It contains the AST parser, the target-site contract package, the direct regeneration launcher, and no Next.js app, editor, Puck runtime, duplicate components, seed data, or production service layer.
- `npm run seeds:regenerate-target` reads the target manifest and writes seeds plus parser diagnostics directly to `eNigma-TemplateFrontend/data/puck`.
- The parser reads `lib/content.ts` as TypeScript source rather than importing it at runtime, keeping direct parsing compatible with the target's ESM project setup.
- Final migration validation passed: parser boundary check, parser typecheck, shared contract typecheck/test, 32/32 direct route regeneration, target Puck config generation, and target manifest validation.

## Remaining Quality Work

- Complete manual visual parity QA for the target's `/page` routes against their real storefront equivalents.
- Test authenticated and backend-dependent states against a compatible backend/database environment.
- Add the existing commands to target CI when the team is ready to enforce this pipeline in pull requests.

## Migration Result

The architecture migration is complete. Remaining work is product QA and CI hardening, not a dependency or ownership gap between `dnd-test` and `eNigma-TemplateFrontend`.
