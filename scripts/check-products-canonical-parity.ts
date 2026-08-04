import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const sourcePath = path.join(templateRoot, 'app', 'products', 'page.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'products', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'products', 'canonical');
const gridViewPath = path.join(dndRoot, 'components', 'products', 'ProductGridView.tsx');
const dndProductGridPath = path.join(dndRoot, 'components', 'products', 'ProductGrid.tsx');
const sourceProductGridPath = path.join(templateRoot, 'components', 'products', 'ProductGrid.tsx');
const dndProductCardPath = path.join(dndRoot, 'components', 'ui', 'ProductCard.tsx');
const sourceProductCardPath = path.join(templateRoot, 'components', 'ui', 'ProductCard.tsx');
const dndProductCardMediaPath = path.join(dndRoot, 'components', 'ui', 'ProductCardMedia.tsx');
const sourceProductCardMediaPath = path.join(templateRoot, 'components', 'ui', 'ProductCardMedia.tsx');
const publishedProductRoutePath = path.join(dndRoot, 'app', 'products', '[slug]', 'page.tsx');
const publishedPuckProductRoutePath = path.join(dndRoot, 'app', 'page', '[slug]', '[entitySlug]', 'page.tsx');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'products.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'products.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');

function read(filePath: string): string {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireText(source: string, expected: string, description: string) {
  if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`);
}

function normalizeRenderer(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, '');
}

const source = read(sourcePath);
const canonicalComponents = [
  'ProductsCatalogLayout',
  'CatalogHeaderLayout',
  'CatalogBreadcrumbs',
  'CatalogTitleSummary',
  'CatalogControlsLayout',
  'CatalogActiveFiltersBoundary',
  'CatalogContentLayout',
  'CatalogFilterSidebar',
  'CatalogResultsState',
  'CatalogGridBoundary',
  'CatalogPaginationCondition',
];

for (const component of canonicalComponents) {
  requireText(
    source,
    `@/components/products/canonical/${component}`,
    `production ${component} import`,
  );
  requireText(source, `<${component}`, `production ${component} JSX`);

  const sourceComponent = read(path.join(sourceCanonicalRoot, `${component}.tsx`));
  const dndComponent = read(path.join(dndCanonicalRoot, `${component}.tsx`));
  if (normalizeRenderer(sourceComponent) !== normalizeRenderer(dndComponent)) {
    throw new Error(`${component} differs between the production source and the DnD canonical renderer.`);
  }
}

for (const expected of [
  'fetchProducts(fetchParams)',
  'fetchCategories({ withStats: true })',
  'currentLabel="All Products"',
  'title="All Products"',
  'hasProducts={products.length > 0}',
  'hasPagination={totalPages > 1}',
  'grid={<ProductGrid products={products} />}',
  'filters={<ProductFilters categories={categories} />}',
  'content={<ActiveFilters className="mb-8" />}',
]) requireText(source, expected, 'production products-page behavior');

for (const forbidden of [
  'ProductsCatalogStateSection',
  'className="min-h-screen bg-bg-base text-text-base"',
  '<Suspense',
]) {
  if (source.includes(forbidden)) {
    throw new Error(`The products route must delegate this concern to a canonical production component: ${forbidden}`);
  }
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptProductsPage')) throw new Error('Products must not use a fixed route emitter.');

const gridView = read(gridViewPath);
requireText(gridView, '<ProductGrid products={products}', 'direct ProductGrid delegation');
for (const forbidden of ['ProductCard', 'function toProduct', 'items:', 'hrefPrefix']) {
  if (gridView.includes(forbidden)) throw new Error(`ProductGridView must not contain replacement behavior: ${forbidden}`);
}

const sourceProductGrid = read(sourceProductGridPath);
for (const expected of [
  '<div className="@container">',
  '"grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4"',
]) requireText(sourceProductGrid, expected, 'production ProductGrid container-query structure');

const slotViews = [
  'ProductsCatalogLayoutView',
  'CatalogHeaderLayoutView',
  'CatalogControlsLayoutView',
  'CatalogActiveFiltersBoundaryView',
  'CatalogContentLayoutView',
  'CatalogFilterSidebarView',
  'CatalogResultsStateView',
  'CatalogGridBoundaryView',
  'CatalogPaginationConditionView',
];
for (const view of slotViews) {
  requireText(read(path.join(dndCanonicalRoot, `${view}.tsx`)), 'puckTransparentSlotProps', `${view} transparent Puck slot handling`);
}

for (const [name, sourceLeaf, dndLeaf] of [
  ['ProductGrid', sourceProductGridPath, dndProductGridPath],
  ['ProductCard', sourceProductCardPath, dndProductCardPath],
  ['ProductCardMedia', sourceProductCardMediaPath, dndProductCardMediaPath],
] as const) {
  if (normalizeRenderer(read(sourceLeaf)) !== normalizeRenderer(read(dndLeaf))) {
    throw new Error(`${name} must remain a source-equivalent leaf, not a Puck replacement.`);
  }
}

const publishedProductRoute = read(publishedProductRoutePath);
for (const expected of [
  "slug=\"product-detail\"",
  "productSlug",
  "await fetchProduct(productSlug)",
]) requireText(publishedProductRoute, expected, 'production product URL bridge');

const publishedPuckProductRoute = read(publishedPuckProductRoutePath);
for (const expected of [
  "slug === 'products' ? 'product-detail' : slug",
  "slug === 'products' || slug === 'product-detail'",
]) requireText(publishedPuckProductRoute, expected, 'published Puck product URL bridge');

const manifest = (JSON.parse(read(manifestPath)) as {
  components: Array<{ type: string; ast?: { sourceImportPaths?: string[] } }>;
}).components;
for (const component of canonicalComponents) {
  const entry = manifest.find(({ type }) => type === component);
  if (!entry?.ast?.sourceImportPaths?.includes(`@/components/products/canonical/${component}`)) {
    throw new Error(`Manifest does not identify ${component} as a production canonical component.`);
  }
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const component of canonicalComponents) {
  requireText(seedText, `"type":"${component}"`, `seed ${component} region`);
}
if (seedText.includes('ProductsCatalogStateSection')) {
  throw new Error('The regenerated products seed must not emit ProductsCatalogStateSection.');
}

const report = JSON.parse(read(reportPath)) as { droppedComponents?: string[]; warnings?: string[] };
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0) {
  throw new Error(`Products parser diagnostics are not clean: ${JSON.stringify(report)}`);
}

console.log('Products source-first canonical parity checks passed.');
