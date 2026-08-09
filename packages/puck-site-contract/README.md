# @enigma/puck-site-contract

Versioned, JSON-safe boundary between the generic eNigma Puck parser and a target Next.js website.

The target website owns its production components, Puck definitions, runtime config, routes, seeds, and published data. The parser consumes only source files and a manifest conforming to this package.

## Contract v1

- All paths are portable and relative to the selected target website.
- Route definitions own source paths, URL patterns, seed names, delegates, and composition rules.
- Component definitions own parser-safe AST hints; React components and fetch functions are intentionally excluded.
- `contractVersion` is validated before parsing so incompatible adapters fail before writing seeds.

```ts
import {
  PUCK_SITE_CONTRACT_VERSION,
  parsePuckSiteManifest,
  type PuckSiteManifestV1,
} from "@enigma/puck-site-contract";

const manifest: PuckSiteManifestV1 = {
  contractVersion: PUCK_SITE_CONTRACT_VERSION,
  siteId: "storefront",
  sourceRoot: ".",
  seedDirectory: "data/puck/seeds",
  reportDirectory: "data/puck/reports",
  routes: [],
  components: [],
};

parsePuckSiteManifest(manifest);
```
