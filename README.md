# eNigma Puck Parser

`dnd-test` is the parser and contract project for target-owned Puck websites.
It does not host an editor, published pages, production components, or a
Next.js runtime. Those live in the target storefront, such as
`eNigma-TemplateFrontend`.

## Target Contract

A target website owns:

- `puck/definitions/` and `puck/generated/site-manifest.json`
- the `/editor` Puck editor and `/page/<route-id>` Puck preview routes
- `data/puck/seeds/` and `data/puck/reports/`

The parser reads the target manifest to discover route IDs and source files,
then writes seeds and diagnostics directly back into that target.

## Commands

```powershell
npm run parser:check
npm run parser:typecheck
npm run seeds:regenerate-target
```

To target another compatible storefront:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/run-parser-to-dnd-test.ps1 `
  -TemplateFrontendRoot D:\projects\another-storefront `
  -PuckTargetRoot D:\projects\another-storefront
```

The target manifest is the source of truth for route discovery. A target must
generate its Puck config before parsing so the parser can match only its known
component metadata and composition rules.

For the complete target-project contract, setup, seed-generation, and
troubleshooting workflow, see
[`docs/target-project-integration-guide.md`](docs/target-project-integration-guide.md).
