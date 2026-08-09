import assert from "node:assert/strict";
import {
  PUCK_SITE_CONTRACT_VERSION,
  PuckSiteContractError,
  parsePuckSiteManifest,
  validatePuckSiteManifest,
  type PuckSiteManifestV1,
} from "../src/index.js";

function manifest(): PuckSiteManifestV1 {
  return {
    contractVersion: PUCK_SITE_CONTRACT_VERSION,
    siteId: "fixture-storefront",
    sourceRoot: ".",
    seedDirectory: "data/puck/seeds",
    reportDirectory: "data/puck/reports",
    routes: [
      {
        id: "products",
        sourceFile: "app/products/page.tsx",
        routePattern: "/products",
        seedFile: "products.json",
        requiredRootRole: "catalog-layout",
        composition: {
          roots: ["ProductsCatalogLayout"],
          allowedTypes: ["ProductsCatalogLayout", "CatalogHeading"],
          children: {
            ProductsCatalogLayout: { heading: ["CatalogHeading"] },
          },
          slots: [
            {
              parentType: "ProductsCatalogLayout",
              slot: "heading",
              allowedTypes: ["CatalogHeading"],
              minChildren: 1,
              repeatable: false,
            },
          ],
        },
      },
    ],
    components: [
      {
        type: "ProductsCatalogLayout",
        category: "Products",
        label: "Products Catalog Layout",
        hasDataFetcher: false,
        defaults: { heading: [] },
        fieldNames: ["heading"],
        canonical: true,
        legacy: false,
        parserEligible: true,
        ast: {
          kind: "static",
          topLevel: true,
          slots: ["heading"],
          role: "catalog-layout",
          routes: ["products"],
          sourceJsxNames: ["ProductsCatalogLayout"],
          sourceImportPaths: ["@/components/products/ProductsCatalogLayout"],
        },
      },
      {
        type: "CatalogHeading",
        category: "Products",
        label: "Catalog Heading",
        hasDataFetcher: true,
        defaults: { title: "All products" },
        fieldNames: ["title"],
        canonical: true,
        legacy: false,
        parserEligible: true,
        ast: {
          kind: "runtime",
          role: "catalog-heading",
          slotTarget: "heading",
          routes: ["products"],
          sourceJsxNames: ["CatalogHeading"],
        },
      },
    ],
  };
}

assert.deepEqual(parsePuckSiteManifest(manifest()), manifest());

const wrongVersion = structuredClone(manifest()) as unknown as Record<string, unknown>;
wrongVersion.contractVersion = 2;
assert.match(validatePuckSiteManifest(wrongVersion).errors.join("\n"), /contractVersion/);

const duplicateRoute = manifest();
duplicateRoute.routes.push(structuredClone(duplicateRoute.routes[0]!));
assert.match(validatePuckSiteManifest(duplicateRoute).errors.join("\n"), /routes\.id must be unique/);

const unknownComponent = manifest();
unknownComponent.routes[0]!.composition.allowedTypes.push("MissingComponent");
assert.match(validatePuckSiteManifest(unknownComponent).errors.join("\n"), /unknown component type: MissingComponent/);

const unsafePath = manifest();
unsafePath.seedDirectory = "../outside";
assert.match(validatePuckSiteManifest(unsafePath).errors.join("\n"), /seedDirectory/);

assert.throws(() => parsePuckSiteManifest(unsafePath), PuckSiteContractError);

const invalidAst = manifest();
invalidAst.components[1]!.ast.list = { previewCount: -1 };
assert.match(validatePuckSiteManifest(invalidAst).errors.join("\n"), /previewCount/);

const nonJsonDefaults = manifest() as unknown as { components: Array<{ defaults: Record<string, unknown> }> };
nonJsonDefaults.components[0]!.defaults.render = () => null;
assert.match(validatePuckSiteManifest(nonJsonDefaults).errors.join("\n"), /JSON-safe/);

console.log("Puck site contract tests passed.");
