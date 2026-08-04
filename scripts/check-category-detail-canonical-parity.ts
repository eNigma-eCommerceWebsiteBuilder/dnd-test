import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const sourcePath = path.join(templateRoot, 'app', 'categories', '[slug]', 'page.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'categories', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'categories', 'canonical');
const sourceLeafRoot = path.join(templateRoot, 'components', 'categories');
const dndLeafRoot = path.join(dndRoot, 'enigma-components', 'categories');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'category-detail.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'category-detail.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const publishedCategoryRoutePath = path.join(dndRoot, 'app', 'categories', '[slug]', 'page.tsx');

function read(filePath: string): string {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireText(source: string, expected: string, description: string) {
  if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`);
}

function normalizeRenderer(source: string): string {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, '');
}

const source = read(sourcePath);
const categoryCanonicalComponents = [
  'CategoryCatalogLayout',
  'CategoryCatalogBreadcrumbs',
  'CategorySubcategoryCondition',
  'CategoryCatalogFilterSidebar',
  'CategoryCatalogResultsHeader',
  'CategoryCatalogResultsState',
  'CategoryCatalogGridBoundary',
  'CategoryCatalogPaginationCondition',
];

for (const component of categoryCanonicalComponents) {
  requireText(source, `@/components/categories/canonical/${component}`, `production ${component} import`);
  requireText(source, `<${component}`, `production ${component} JSX`);

  const sourceComponent = read(path.join(sourceCanonicalRoot, `${component}.tsx`));
  const dndComponent = read(path.join(dndCanonicalRoot, `${component}.tsx`));
  if (normalizeRenderer(sourceComponent) !== normalizeRenderer(dndComponent)) {
    throw new Error(`${component} differs between the production source and the DnD canonical renderer.`);
  }
}

for (const expected of [
  'const allCategories = await fetchCategories({ withStats: true });',
  'const category = allCategories.find(c => c.slug === slug);',
  'if (!category)',
  'notFound();',
  'const parsedParams = parseCatalogParams(urlParams);',
  'const fetchParams = buildCategoryFilters(urlParams);',
  'fetchCategoryProducts(category.slug, fetchParams)',
  'c => c.parentCategory === category.parentCategory && c._id !== category._id',
  'hasSiblings={siblingCategories.length > 0}',
  'hasProducts={products.length > 0}',
  'hasPagination={totalPages > 1}',
  'filters={<ProductFilters categories={allCategories} />}',
  'grid={<ProductGrid products={products} />}',
  'content={<SubcategoryNav categories={siblingCategories} currentSlug={slug} />}',
]) requireText(source, expected, 'production category-detail behavior');

for (const forbidden of [
  '<main className=',
  '<nav className=',
  '<Suspense',
  'CategoryCatalogStateSection',
]) {
  if (source.includes(forbidden)) {
    throw new Error(`The category-detail route must delegate this concern to a canonical production component: ${forbidden}`);
  }
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptCategoryDetailPage')) throw new Error('Category detail must not use a fixed route emitter.');

for (const view of [
  'CategoryCatalogLayoutView.tsx',
  'CategoryCatalogFilterSidebarView.tsx',
  'CategoryCatalogGridBoundaryView.tsx',
  'CategoryCatalogResultsHeaderView.tsx',
  'CategoryCatalogResultsStateView.tsx',
  'CategoryCatalogPaginationConditionView.tsx',
  'CategorySubcategoryConditionView.tsx',
]) {
  const viewSource = read(path.join(dndCanonicalRoot, view));
  requireText(viewSource, 'puckTransparentSlotProps', `${view} transparent slot handling`);
  requireText(viewSource, '?.(puckTransparentSlotProps)', `${view} slot-to-node adaptation`);
  if (viewSource.includes('style: { display:')) {
    throw new Error(`${view} must not push Puck-only styling into the source renderer.`);
  }
}

for (const [name, sourceLeaf, dndLeaf] of [
  ['CategoryHero', 'CategoryHero.tsx', 'CategoryHero.tsx'],
  ['SubcategoryNav', 'SubcategoryNav.tsx', 'SubcategoryNav.tsx'],
  ['EmptyCategory', 'EmptyCategory.tsx', 'EmptyCategory.tsx'],
] as const) {
  if (normalizeRenderer(read(path.join(sourceLeafRoot, sourceLeaf))) !== normalizeRenderer(read(path.join(dndLeafRoot, dndLeaf)))) {
    throw new Error(`${name} must remain a source-equivalent leaf, not a Puck replacement.`);
  }
}

const categoryHeroView = read(path.join(dndRoot, 'components', 'categories', 'CategoryHeroView.tsx'));
requireText(categoryHeroView, '@/enigma-components/categories/CategoryHero', 'CategoryHero direct production delegate');
const subcategoryView = read(path.join(dndRoot, 'components', 'categories', 'SubcategoryNavView.tsx'));
requireText(subcategoryView, '@/enigma-components/categories/SubcategoryNav', 'SubcategoryNav direct production delegate');
if (subcategoryView.includes('parentSlug')) {
  throw new Error('SubcategoryNavView must not inject a parentSlug that the source route does not pass.');
}
const emptyView = read(path.join(dndRoot, 'components', 'categories', 'EmptyCategoryView.tsx'));
requireText(emptyView, 'return <EmptyCategory />;', 'EmptyCategory direct production delegation');

const sharedContentLayoutView = read(path.join(dndRoot, 'components', 'products', 'canonical', 'CatalogContentLayoutView.tsx'));
requireText(sharedContentLayoutView, "'CategoryCatalogFilterSidebar'", 'category sidebar slot allowance');
requireText(sharedContentLayoutView, "'CategoryCatalogResultsState'", 'category results slot allowance');

const publishedCategoryRoute = read(publishedCategoryRoutePath);
for (const expected of [
  'slug="category-detail"',
  'categorySlug',
  'fetchCategories({ withStats: true })',
]) requireText(publishedCategoryRoute, expected, 'production category URL bridge');

const manifest = (JSON.parse(read(manifestPath)) as {
  components: Array<{ type: string; ast?: { sourceImportPaths?: string[] } }>;
}).components;
for (const component of categoryCanonicalComponents) {
  const entry = manifest.find(({ type }) => type === component);
  if (!entry?.ast?.sourceImportPaths?.includes(`@/components/categories/canonical/${component}`)) {
    throw new Error(`Manifest does not identify ${component} as a production canonical component.`);
  }
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const component of [
  ...categoryCanonicalComponents,
  'CatalogActiveFiltersBoundary',
  'CatalogContentLayout',
  'CategoryHero',
  'SubcategoryNav',
  'ActiveFiltersBlock',
  'CategoryProductFiltersBlock',
  'ViewToggleBlock',
  'SortDropdownBlock',
  'CategoryProductGridBlock',
  'CategoryCatalogPaginationBlock',
  'EmptyCategory',
]) requireText(seedText, `"type":"${component}"`, `seed ${component} region`);
for (const forbidden of ['CategoryCatalogStateSection', 'PageWrapper', 'SectionHeading']) {
  if (seedText.includes(`"type":"${forbidden}"`)) {
    throw new Error(`Category-detail seed must not contain generic fallback: ${forbidden}`);
  }
}
if (seedText.includes('"previewMode"')) {
  throw new Error('The regenerated category-detail seed must leave runtime conditions to their source owners.');
}

const report = JSON.parse(read(reportPath)) as {
  droppedComponents?: string[];
  warnings?: string[];
  runtimeConditionals?: Array<{ source?: string }>;
};
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0) {
  throw new Error(`Category-detail parser diagnostics are not clean: ${JSON.stringify(report)}`);
}
for (const condition of ['siblingCategories.length > 0', 'products.length > 0', 'totalPages > 1']) {
  if (!report.runtimeConditionals?.some((item) => item.source === condition)) {
    throw new Error(`Category-detail parser did not report the source-owned condition: ${condition}`);
  }
}

console.log('Category-detail source-first canonical parity checks passed.');
