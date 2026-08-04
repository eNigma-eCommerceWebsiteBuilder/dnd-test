import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const sourcePath = path.join(templateRoot, 'app', 'collections', '[slug]', 'page.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'collections', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'collections', 'canonical');
const sourceLeafRoot = path.join(templateRoot, 'components', 'collections');
const dndLeafRoot = path.join(dndRoot, 'enigma-components', 'collections');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'collection-detail.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'collection-detail.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const runtimePath = path.join(dndCanonicalRoot, 'collectionDetailRuntime.ts');
const publishedRoutePath = path.join(dndRoot, 'app', 'collections', '[slug]', 'page.tsx');

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
  'CollectionDetailPageState',
  'CollectionDetailNotFound',
  'CollectionDetailPageLayout',
  'CollectionDetailHero',
  'CuratedCollectionCondition',
  'CollectionDetailCuratedDisplay',
  'InspirationDetailCondition',
  'CollectionDetailInspirationGallery',
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
  'await fetchCollectionDetailPageData(slug);',
  'hasCollection={Boolean(collection)}',
  'visible={Boolean(curatedCollection)}',
  'visible={Boolean(inspirationDetail)}',
  'collection={collection!}',
  'collection={curatedCollection!}',
  'collection={inspirationDetail!}',
]) requireText(source, expected, 'production collection-detail behavior');

for (const forbidden of ['<main className=', '<section className=', 'if (!collection)', 'CollectionDetailStateSection']) {
  if (source.includes(forbidden)) {
    throw new Error(`The collection-detail route must delegate this concern to a canonical production component: ${forbidden}`);
  }
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptCollectionDetailPage')) throw new Error('Collection detail must not use a fixed route emitter.');

for (const view of [
  'CollectionDetailPageStateView.tsx',
  'CollectionDetailPageLayoutView.tsx',
  'CuratedCollectionConditionView.tsx',
  'InspirationDetailConditionView.tsx',
]) {
  const viewSource = read(path.join(dndCanonicalRoot, view));
  requireText(viewSource, 'puckTransparentSlotProps', `${view} transparent slot handling`);
  requireText(viewSource, '?.(puckTransparentSlotProps)', `${view} slot-to-node adaptation`);
  if (viewSource.includes('style: { display:')) {
    throw new Error(`${view} must not push Puck-only styling into a source renderer.`);
  }
}

for (const view of [
  'CollectionDetailPageStateView.tsx',
  'CuratedCollectionConditionView.tsx',
  'InspirationDetailConditionView.tsx',
  'CollectionDetailHeroView.tsx',
  'CollectionDetailCuratedDisplayView.tsx',
  'CollectionDetailInspirationGalleryView.tsx',
]) requireText(read(path.join(dndCanonicalRoot, view)), 'puck?.isEditing', `${view} editor-only preview behavior`);

for (const [name, file] of [
  ['CollectionHero', 'CollectionHero.tsx'],
  ['CuratedProductDisplay', 'CuratedProductDisplay.tsx'],
  ['InspirationGallery', 'InspirationGallery.tsx'],
] as const) {
  if (normalizeRenderer(read(path.join(sourceLeafRoot, file))) !== normalizeRenderer(read(path.join(dndLeafRoot, file)))) {
    throw new Error(`${name} must remain a source-equivalent leaf, not a Puck replacement.`);
  }
}

for (const [file, sourceImport] of [
  ['CollectionDetailHero.tsx', '@/components/collections/CollectionHero'],
  ['CollectionDetailCuratedDisplay.tsx', '@/components/collections/CuratedProductDisplay'],
  ['CollectionDetailInspirationGallery.tsx', '@/components/collections/InspirationGallery'],
] as const) requireText(read(path.join(dndCanonicalRoot, file)), sourceImport, `${file} direct production delegate`);

const runtime = read(runtimePath);
for (const expected of [
  'withFallback<Collection[]>(fetchCollections(), [])',
  'withFallback<CuratedCollection[]>(fetchCuratedCollections(), [])',
  'withNull<InspirationCollection>(fetchInspirationCollection())',
  'const collection = collections.find((entry) => matchesCollectionSlug(entry, slug)) ?? null;',
  'const curatedFromAll = collections.filter(isCuratedCollection);',
  'const inspirationFromAll = collections.filter(isInspirationCollection);',
]) requireText(runtime, expected, 'source-equivalent collection-detail runtime behavior');

const publishedRoute = read(publishedRoutePath);
for (const expected of ['slug="collection-detail"', 'collectionSlug']) {
  requireText(publishedRoute, expected, 'production collection-detail URL bridge');
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
for (const component of canonicalComponents) {
  requireText(seedText, `"type":"${component}"`, `seed ${component} region`);
}
for (const forbidden of ['CollectionDetailStateSection', 'PageWrapper', 'SectionHeading']) {
  if (seedText.includes(`"type":"${forbidden}"`)) {
    throw new Error(`Collection-detail seed must not contain generic fallback: ${forbidden}`);
  }
}
if (seedText.includes('"previewMode"')) {
  throw new Error('The regenerated collection-detail seed must leave runtime conditions to their source owners.');
}

const report = JSON.parse(read(reportPath)) as {
  droppedComponents?: string[];
  warnings?: string[];
  unmatchedHtml?: string[];
  runtimeConditionals?: Array<{ source?: string }>;
};
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0 || (report.unmatchedHtml ?? []).length > 0) {
  throw new Error(`Collection-detail parser diagnostics are not clean: ${JSON.stringify(report)}`);
}
for (const condition of ['Boolean(collection)', 'Boolean(curatedCollection)', 'Boolean(inspirationDetail)']) {
  if (!report.runtimeConditionals?.some((item) => item.source === condition)) {
    throw new Error(`Collection-detail parser did not report the source-owned condition: ${condition}`);
  }
}

console.log('Collection-detail source-first canonical parity checks passed.');
