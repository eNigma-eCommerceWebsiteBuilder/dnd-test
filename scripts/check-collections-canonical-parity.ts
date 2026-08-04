import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const sourcePath = path.join(templateRoot, 'app', 'collections', 'page.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'collections', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'collections', 'canonical');
const sourceLeafRoot = path.join(templateRoot, 'components', 'collections');
const dndLeafRoot = path.join(dndRoot, 'enigma-components', 'collections');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'collections.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'collections.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const runtimePath = path.join(dndCanonicalRoot, 'collectionsRuntime.ts');
const publishedCollectionsRoutePath = path.join(dndRoot, 'app', 'collections', 'page.tsx');
const publishedCollectionDetailRoutePath = path.join(dndRoot, 'app', 'collections', '[slug]', 'page.tsx');

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
  'CollectionsPageLayout',
  'CollectionsPageHeader',
  'CollectionsFilterSection',
  'FeaturedCuratedCollectionCondition',
  'FeaturedCuratedCollection',
  'CollectionsResultsState',
  'InspirationCollectionCondition',
  'InspirationCollectionSection',
];

for (const component of canonicalComponents) {
  requireText(source, `@/components/collections/canonical/${component}`, `production ${component} import`);
  requireText(source, `<${component}`, `production ${component} JSX`);

  const sourceComponent = read(path.join(sourceCanonicalRoot, `${component}.tsx`));
  const dndComponent = read(path.join(dndCanonicalRoot, `${component}.tsx`));
  if (normalizeRenderer(sourceComponent) !== normalizeRenderer(dndComponent)) {
    throw new Error(`${component} differs between the production source and DnD canonical renderer.`);
  }
}

for (const expected of [
  'withFallback<Collection[]>(fetchCollections(), [])',
  'withFallback<CuratedCollection[]>(fetchCuratedCollections(), [])',
  'withNull<InspirationCollection>(fetchInspirationCollection())',
  'const sortedCollections = sortCollections(collections);',
  'const curatedFromAll = sortedCollections.filter(isCuratedCollection);',
  'const inspirationFromAll = sortedCollections.filter(isInspirationCollection);',
  'const featuredCurated = curatedCollections[0] ?? curatedFromAll[0];',
  'const hasFeaturedCurated = hasCurated && Boolean(featuredCurated);',
  'visible={hasFeaturedCurated}',
  'hasCollections={hasCollections}',
  'visible={hasInspiration}',
  'getHref={(collection) =>',
  'collection.slug ? `/collections/${collection.slug}` : undefined',
]) requireText(source, expected, 'production collections-page behavior');

for (const forbidden of ['<main className=', '<section className=', 'CollectionStateSection']) {
  if (source.includes(forbidden)) {
    throw new Error(`The collections route must delegate this concern to a canonical production component: ${forbidden}`);
  }
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptCollectionsPage')) throw new Error('Collections must not use a fixed route emitter.');

for (const view of [
  'CollectionsPageLayoutView.tsx',
  'CollectionsPageHeaderView.tsx',
  'CollectionsFilterSectionView.tsx',
  'CollectionsResultsStateView.tsx',
  'FeaturedCuratedCollectionConditionView.tsx',
  'InspirationCollectionConditionView.tsx',
]) {
  const viewSource = read(path.join(dndCanonicalRoot, view));
  requireText(viewSource, 'puckTransparentSlotProps', `${view} transparent slot handling`);
  requireText(viewSource, '?.(puckTransparentSlotProps)', `${view} slot-to-node adaptation`);
  if (viewSource.includes('style: { display:')) {
    throw new Error(`${view} must not push Puck-only styling into a source renderer.`);
  }
}

for (const view of [
  'CollectionsResultsStateView.tsx',
  'FeaturedCuratedCollectionConditionView.tsx',
  'InspirationCollectionConditionView.tsx',
]) {
  requireText(read(path.join(dndCanonicalRoot, view)), 'puck?.isEditing', `${view} editor-only conditional preview`);
}

for (const [name, file] of [
  ['Breadcrumbs', 'Breadcrumbs.tsx'],
  ['CollectionGrid', 'CollectionGrid.tsx'],
  ['CollectionTypeFilter', 'CollectionTypeFilter.tsx'],
  ['EmptyCollections', 'EmptyCollections.tsx'],
] as const) {
  if (normalizeRenderer(read(path.join(sourceLeafRoot, file))) !== normalizeRenderer(read(path.join(dndLeafRoot, file)))) {
    throw new Error(`${name} must remain a source-equivalent leaf, not a Puck replacement.`);
  }
}

for (const [directory, view, sourceImport] of [
  ['canonical', 'CollectionBreadcrumbsView.tsx', '@/enigma-components/collections/Breadcrumbs'],
  ['canonical', 'CollectionTypeFilterView.tsx', '@/enigma-components/collections/CollectionTypeFilter'],
  ['.', 'CollectionGridView.tsx', '@/enigma-components/collections/CollectionGrid'],
  ['.', 'EmptyCollectionsView.tsx', '@/enigma-components/collections/EmptyCollections'],
] as const) {
  requireText(read(path.join(dndRoot, 'components', 'collections', directory, view)), sourceImport, `${view} direct production delegate`);
}

const gridView = read(path.join(dndRoot, 'components', 'collections', 'CollectionGridView.tsx'));
requireText(gridView, 'collection.slug ? `/collections/${collection.slug}` : undefined', 'source collection URL');
if (gridView.includes('/page/collection-detail/')) {
  throw new Error('CollectionGridView must not rewrite source collection URLs to a Puck-only path.');
}

const runtime = read(runtimePath);
for (const expected of [
  'withFallback<Collection[]>(fetchCollections(), [])',
  'withFallback<CuratedCollection[]>(fetchCuratedCollections(), [])',
  'withNull<InspirationCollection>(fetchInspirationCollection())',
  'const sortedCollections = sortCollections(collections);',
  'hasFeaturedCurated: curatedCollections.length > 0 && Boolean(featuredCurated)',
]) requireText(runtime, expected, 'source-equivalent collections runtime behavior');

const publishedCollectionsRoute = read(publishedCollectionsRoutePath);
requireText(publishedCollectionsRoute, 'slug="collections"', 'production collections URL bridge');
const publishedCollectionDetailRoute = read(publishedCollectionDetailRoutePath);
for (const expected of ['slug="collection-detail"', 'collectionSlug']) {
  requireText(publishedCollectionDetailRoute, expected, 'production collection-detail URL bridge');
}

const manifest = (JSON.parse(read(manifestPath)) as {
  components: Array<{ type: string; ast?: { sourceImportPaths?: string[] } }>;
}).components;
for (const component of canonicalComponents) {
  const entry = manifest.find(({ type }) => type === component);
  if (!entry?.ast?.sourceImportPaths?.includes(`@/components/collections/canonical/${component}`)) {
    throw new Error(`Manifest does not identify ${component} as a production canonical component.`);
  }
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const component of [
  ...canonicalComponents,
  'CollectionBreadcrumbs',
  'CollectionTypeFilter',
  'CollectionGrid',
  'EmptyCollections',
]) requireText(seedText, `"type":"${component}"`, `seed ${component} region`);
for (const forbidden of ['CollectionStateSection', 'PageWrapper', 'SectionHeading']) {
  if (seedText.includes(`"type":"${forbidden}"`)) {
    throw new Error(`Collections seed must not contain generic fallback: ${forbidden}`);
  }
}
if (seedText.includes('"previewMode"')) {
  throw new Error('The regenerated collections seed must leave runtime conditions to their source owners.');
}

const report = JSON.parse(read(reportPath)) as {
  droppedComponents?: string[];
  warnings?: string[];
  unmatchedHtml?: string[];
  runtimeConditionals?: Array<{ source?: string; handledBy?: string }>;
};
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0 || (report.unmatchedHtml ?? []).length > 0) {
  throw new Error(`Collections parser diagnostics are not clean: ${JSON.stringify(report)}`);
}
for (const condition of [
  { source: 'hasFeaturedCurated', handledBy: 'FeaturedCuratedCollectionCondition' },
  { source: 'hasCollections', handledBy: 'CollectionsResultsState' },
  { source: 'hasInspiration', handledBy: 'InspirationCollectionCondition' },
]) {
  if (!report.runtimeConditionals?.some((item) => item.source === condition.source && item.handledBy === condition.handledBy)) {
    throw new Error(`Collections parser did not report the source-owned condition: ${condition.handledBy}`);
  }
}

console.log('Collections source-first canonical parity checks passed.');
