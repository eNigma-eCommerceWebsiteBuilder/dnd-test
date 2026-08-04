import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const sourcePath = path.join(templateRoot, 'app', 'search', 'page.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'search', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'search', 'canonical');
const sourceLeafRoot = path.join(templateRoot, 'components', 'search');
const dndLeafRoot = path.join(dndRoot, 'enigma-components', 'search');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'search.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'search.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const runtimePath = path.join(dndCanonicalRoot, 'searchRuntime.ts');
const publishedSearchRoutePath = path.join(dndRoot, 'app', 'search', 'page.tsx');

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
const canonicalComponents = [
  'SearchPageLayout',
  'SearchBreadcrumbs',
  'SearchRecentSearchesBoundary',
  'SearchContentLayout',
  'SearchFilterSidebar',
  'SearchQueryState',
  'SearchResultsBlock',
  'SearchSortControls',
  'SearchGridBoundary',
  'SearchPaginationCondition',
  'SearchStartPrompt',
];

for (const component of canonicalComponents) {
  requireText(source, `@/components/search/canonical/${component}`, `production ${component} import`);
  requireText(source, `<${component}`, `production ${component} JSX`);

  const sourceComponent = read(path.join(sourceCanonicalRoot, `${component}.tsx`));
  const dndComponent = read(path.join(dndCanonicalRoot, `${component}.tsx`));
  if (normalizeRenderer(sourceComponent) !== normalizeRenderer(dndComponent)) {
    throw new Error(`${component} differs between the production source and the DnD canonical renderer.`);
  }
}

for (const expected of [
  'const parsedParams = parseCatalogParams(params);',
  "const query = parsedParams.query || '';",
  'const fetchParams = buildSearchFilters(params);',
  'withNull(searchProducts(query, fetchParams))',
  'fetchCategories({ withStats: true })',
  'query={query}',
  'hasResults={products.length > 0}',
  'hasPagination={totalPages > 1}',
  'content={<RecentSearches currentQuery={query} />}',
  'filters={<SearchFilters categories={categories} />}',
  'content={<SortDropdown />}',
  'content={<ProductGrid products={products} listName="Search Results" />}',
  'noResults={<NoResults query={query} />}',
  'start={<SearchStartPrompt />}',
]) requireText(source, expected, 'production search-page behavior');

for (const forbidden of [
  '<main className=',
  '<nav className=',
  '<aside className=',
  '<Suspense',
  'SearchStateSection',
]) {
  if (source.includes(forbidden)) {
    throw new Error(`The search route must delegate this concern to a canonical production component: ${forbidden}`);
  }
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptSearchPage')) throw new Error('Search must not use a fixed route emitter.');

for (const view of [
  'SearchPageLayoutView.tsx',
  'SearchContentLayoutView.tsx',
  'SearchFilterSidebarView.tsx',
  'SearchRecentSearchesBoundaryView.tsx',
  'SearchQueryStateView.tsx',
  'SearchResultsBlockView.tsx',
  'SearchSortControlsView.tsx',
  'SearchGridBoundaryView.tsx',
  'SearchPaginationConditionView.tsx',
]) {
  const viewSource = read(path.join(dndCanonicalRoot, view));
  requireText(viewSource, 'puckTransparentSlotProps', `${view} transparent slot handling`);
  requireText(viewSource, '?.(puckTransparentSlotProps)', `${view} slot-to-node adaptation`);
  if (viewSource.includes('style: { display:')) {
    throw new Error(`${view} must not push Puck-only styling into the source renderer.`);
  }
}

const paginationConditionView = read(path.join(dndCanonicalRoot, 'SearchPaginationConditionView.tsx'));
for (const expected of [
  "puckDefaults = { previewMode: 'visible'",
  "puck?.isEditing ? previewMode === 'visible' : hasPagination ?? visible ?? false",
]) requireText(paginationConditionView, expected, 'editor-only pagination preview behavior');

for (const [name, sourceLeaf, dndLeaf] of [
  ['SearchHeader', 'SearchHeader.tsx', 'SearchHeader.tsx'],
  ['SearchFilters', 'SearchFilters.tsx', 'SearchFilters.tsx'],
  ['RecentSearches', 'RecentSearches.tsx', 'RecentSearches.tsx'],
  ['NoResults', 'NoResults.tsx', 'NoResults.tsx'],
  ['SearchAnalytics', 'SearchAnalytics.tsx', 'SearchAnalytics.tsx'],
] as const) {
  if (normalizeRenderer(read(path.join(sourceLeafRoot, sourceLeaf))) !== normalizeRenderer(read(path.join(dndLeafRoot, dndLeaf)))) {
    throw new Error(`${name} must remain a source-equivalent leaf, not a Puck replacement.`);
  }
}

for (const [view, sourceImport] of [
  ['SearchHeaderView.tsx', '@/enigma-components/search/SearchHeader'],
  ['SearchFiltersView.tsx', '@/enigma-components/search/SearchFilters'],
  ['RecentSearchesView.tsx', '@/enigma-components/search/RecentSearches'],
  ['NoResultsView.tsx', '@/enigma-components/search/NoResults'],
  ['SearchAnalyticsView.tsx', '@/enigma-components/search/SearchAnalytics'],
] as const) {
  requireText(read(path.join(dndRoot, 'components', 'search', view)), sourceImport, `${view} direct production delegate`);
}

const runtime = read(runtimePath);
for (const expected of [
  'PAGINATION.DEFAULT_PAGE_SIZE',
  'withNull(searchProducts(query, fetchParams))',
  'fetchCategories({ withStats: true })',
  'sortValues.has(sort)',
  "searchParams.inStock === 'true'",
]) requireText(runtime, expected, 'source-equivalent search runtime behavior');
if (runtime.includes("getNumberSearchParam(context, 'pageSize'")) {
  throw new Error('Search runtime must use the source fixed page size, not a pageSize query parameter.');
}

const publishedSearchRoute = read(publishedSearchRoutePath);
for (const expected of ['slug="search"', 'searchParams={await searchParams}']) {
  requireText(publishedSearchRoute, expected, 'source-compatible published search URL bridge');
}

const manifest = (JSON.parse(read(manifestPath)) as {
  components: Array<{ type: string; ast?: { sourceImportPaths?: string[] } }>;
}).components;
for (const component of canonicalComponents) {
  const entry = manifest.find(({ type }) => type === component);
  if (!entry?.ast?.sourceImportPaths?.includes(`@/components/search/canonical/${component}`)) {
    throw new Error(`Manifest does not identify ${component} as a production canonical component.`);
  }
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const component of [
  ...canonicalComponents,
  'SearchHeader',
  'SearchAnalytics',
  'RecentSearches',
  'SearchFilters',
  'SearchSortDropdown',
  'SearchProductGrid',
  'SearchPagination',
  'NoResults',
]) requireText(seedText, `"type":"${component}"`, `seed ${component} region`);
for (const forbidden of ['SearchStateSection', 'PageWrapper', 'SectionHeading']) {
  if (seedText.includes(`"type":"${forbidden}"`)) {
    throw new Error(`Search seed must not contain generic fallback: ${forbidden}`);
  }
}
if (seedText.includes('"previewMode"')) {
  throw new Error('The regenerated search seed must leave runtime conditions to their source owners.');
}

const report = JSON.parse(read(reportPath)) as {
  droppedComponents?: string[];
  warnings?: string[];
  runtimeConditionals?: Array<{ source?: string }>;
};
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0) {
  throw new Error(`Search parser diagnostics are not clean: ${JSON.stringify(report)}`);
}
for (const condition of ['query ? products.length > 0 ? results : noResults : start', 'totalPages > 1']) {
  if (!report.runtimeConditionals?.some((item) => item.source === condition)) {
    throw new Error(`Search parser did not report the source-owned condition: ${condition}`);
  }
}

console.log('Search source-first canonical parity checks passed.');
