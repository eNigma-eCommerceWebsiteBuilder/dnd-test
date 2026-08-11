# Parser Project Overview

`dnd-test` is the parser and contract project for target-owned Puck-enabled
Next.js websites. It is not a Next.js application and does not contain an
editor, published-page renderer, production component library, seed data, or
backend service layer.

## Responsibilities

- Parse declared real JSX routes from a target project.
- Read the target-generated Puck site manifest and AST component metadata.
- Emit validated Puck seed JSON and parser diagnostics directly into the target.
- Enforce the versioned target-site contract and parser boundary checks.

## Repository Layout

```text
dnd-test/
  scripts/templatefrontend-parser/  AST parser engine, route profiles, CLI
  scripts/run-parser-to-dnd-test.ps1  target regeneration launcher
  scripts/check-parser-boundary.ts  parser-only dependency guard
  packages/puck-site-contract/      versioned manifest types and validation
  docs/                             parser and target-integration references
```

## Typical Workflow

1. The target website defines thin Puck adapters, routes, composition rules,
   and an `npm run puck:generate` command.
2. The target generator produces `puck/generated/site-manifest.json`.
3. Run `dnd-test` against the target root.
4. The parser writes `data/puck/seeds/<route-id>.json` and
   `data/puck/reports/<route-id>.report.json` in the target.
5. The target editor opens the seed and its target-owned `/page` renderer
   renders published data.

## Commands

```powershell
npm run parser:check
npm run parser:typecheck
npm run contract:typecheck
npm run contract:test
npm run seeds:regenerate-target
```

See [Target Project Integration Guide](target-project-integration-guide.md) for
the compatibility contract, setup steps, direct commands, and diagnostics
guidance.
