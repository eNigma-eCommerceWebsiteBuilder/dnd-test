import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const sourcePath = path.join(templateRoot, 'app', 'wishlist', 'shared', '[token]', 'page.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'wishlist', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'wishlist', 'canonical');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'shared-wishlist.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'shared-wishlist.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const runtimePath = path.join(dndCanonicalRoot, 'sharedWishlistRuntime.ts');
const publishedRoutePath = path.join(dndRoot, 'app', 'wishlist', 'shared', '[token]', 'page.tsx');

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
  'SharedWishlistPageState',
  'SharedWishlistInvalidState',
  'SharedWishlistPageLayout',
  'SharedWishlistHeaderActionsCondition',
  'SharedWishlistContentLayout',
  'SharedWishlistSavingsCondition',
  'SharedWishlistSavingsCard',
  'SharedWishlistItemsState',
  'SharedWishlistJsonLd',
];

for (const component of canonicalComponents) {
  requireText(source, `@/components/wishlist/canonical/${component}`, `production ${component} import`);
  requireText(source, `<${component}`, `production ${component} JSX`);

  const sourceComponent = read(path.join(sourceCanonicalRoot, `${component}.tsx`));
  const dndComponent = read(path.join(dndCanonicalRoot, `${component}.tsx`));
  if (normalizeRenderer(sourceComponent) !== normalizeRenderer(dndComponent)) {
    throw new Error(`${component} differs between the production source and DnD canonical renderer.`);
  }
}

for (const expected of [
  'wishlist = await viewSharedWishlist(token);',
  'wishlist = null;',
  'const items = wishlist?.items ?? [];',
  'const itemCount = wishlist?.totalItems ?? items.length;',
  'const savings = calculateWishlistSavings(wishlist);',
  'valid={Boolean(wishlist)}',
  'visible={items.length > 0}',
  'visible={savings.potentialValue > 0}',
  'hasItems={items.length > 0}',
  '<AddAllToCartButton items={items} />',
  '<SharedWishlistEmpty />',
  '<SharedWishlistGrid items={items} />',
]) requireText(source, expected, 'production shared-wishlist behavior');

for (const forbidden of ['<main className=', '<section className=', 'if (!wishlist)', 'JsonLdSchema', 'SharedWishlistStateSection']) {
  if (source.includes(forbidden)) {
    throw new Error(`The shared-wishlist route must delegate this concern to a canonical production component: ${forbidden}`);
  }
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptSharedWishlistPage')) throw new Error('Shared wishlist must not use a fixed route emitter.');

for (const view of [
  'SharedWishlistPageStateView.tsx',
  'SharedWishlistPageLayoutView.tsx',
  'SharedWishlistContentLayoutView.tsx',
  'SharedWishlistHeaderView.tsx',
  'SharedWishlistHeaderActionsConditionView.tsx',
  'SharedWishlistSavingsConditionView.tsx',
  'SharedWishlistItemsStateView.tsx',
]) {
  const viewSource = read(path.join(dndCanonicalRoot, view));
  requireText(viewSource, 'puckTransparentSlotProps', `${view} transparent slot handling`);
  requireText(viewSource, '?.(puckTransparentSlotProps)', `${view} slot-to-node adaptation`);
  if (viewSource.includes('style: { display:')) {
    throw new Error(`${view} must not push Puck-only styling into a source renderer.`);
  }
}

for (const view of [
  'SharedWishlistPageStateView.tsx',
  'SharedWishlistHeaderActionsConditionView.tsx',
  'SharedWishlistSavingsConditionView.tsx',
  'SharedWishlistItemsStateView.tsx',
  'SharedWishlistAddAllView.tsx',
  'SharedWishlistGridView.tsx',
  'SharedWishlistSavingsCardView.tsx',
  'SharedWishlistJsonLdView.tsx',
]) requireText(read(path.join(dndCanonicalRoot, view)), 'puck?.isEditing', `${view} editor-only preview behavior`);

for (const [file, delegate] of [
  ['SharedWishlistHeaderView.tsx', '@/enigma-components/wishlist/shared/SharedWishlistHeader'],
  ['SharedWishlistAddAllView.tsx', '@/enigma-components/wishlist/shared/AddAllToCartButton'],
  ['SharedWishlistEmptyView.tsx', '@/enigma-components/wishlist/shared/SharedWishlistEmpty'],
  ['SharedWishlistGridView.tsx', '@/enigma-components/wishlist/shared/SharedWishlistGrid'],
] as const) requireText(read(path.join(dndCanonicalRoot, file)), delegate, `${file} direct production delegate`);

for (const [file, canonical] of [
  ['SharedWishlistSavingsCardView.tsx', 'SharedWishlistSavingsCard'],
  ['SharedWishlistJsonLdView.tsx', 'SharedWishlistJsonLd'],
] as const) requireText(read(path.join(dndCanonicalRoot, file)), `import { ${canonical} } from './${canonical}';`, `${file} canonical delegate`);

const runtime = read(runtimePath);
for (const expected of [
  'wishlist = await viewSharedWishlist(token);',
  'wishlist = null;',
  'const items = wishlist?.items ?? [];',
  'itemCount: wishlist?.totalItems ?? items.length',
  'savings: calculateWishlistSavings(wishlist)',
]) requireText(runtime, expected, 'source-equivalent shared-wishlist runtime behavior');

const publishedRoute = read(publishedRoutePath);
for (const expected of ['slug="shared-wishlist"', "routeParams={{ slug: 'shared-wishlist', token }}"]) {
  requireText(publishedRoute, expected, 'production shared-wishlist URL bridge');
}

const manifest = (JSON.parse(read(manifestPath)) as {
  components: Array<{ type: string; ast?: { sourceImportPaths?: string[] } }>;
}).components;
for (const component of canonicalComponents) {
  const entry = manifest.find(({ type }) => type === component);
  if (!entry?.ast?.sourceImportPaths?.includes(`@/components/wishlist/canonical/${component}`)) {
    throw new Error(`Manifest does not identify ${component} as a production canonical component.`);
  }
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const component of [
  ...canonicalComponents,
  'SharedWishlistHeader',
  'SharedWishlistAddAll',
  'SharedWishlistEmpty',
  'SharedWishlistGrid',
]) requireText(seedText, `"type":"${component}"`, `seed ${component} region`);
for (const forbidden of ['SharedWishlistStateSection', 'PageWrapper', 'SectionHeading', 'Preview Wool Scarf', 'Preview Leather Tote', '"previewMode"', '"priceWhenAdded"', '"productSnapshot"']) {
  if (seedText.includes(forbidden)) {
    throw new Error(`Shared-wishlist seed must not contain prototype-only data or generic fallback: ${forbidden}`);
  }
}

const report = JSON.parse(read(reportPath)) as {
  droppedComponents?: string[];
  warnings?: string[];
  unmatchedHtml?: string[];
  runtimeConditionals?: Array<{ source?: string; handledBy?: string }>;
};
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0 || (report.unmatchedHtml ?? []).length > 0) {
  throw new Error(`Shared-wishlist parser diagnostics are not clean: ${JSON.stringify(report)}`);
}
for (const condition of [
  { source: 'Boolean(wishlist)', handledBy: 'SharedWishlistPageState' },
  { source: 'items.length > 0', handledBy: 'SharedWishlistHeaderActionsCondition' },
  { source: 'savings.potentialValue > 0', handledBy: 'SharedWishlistSavingsCondition' },
  { source: 'items.length > 0', handledBy: 'SharedWishlistItemsState' },
]) {
  if (!report.runtimeConditionals?.some((item) => item.source === condition.source && item.handledBy === condition.handledBy)) {
    throw new Error(`Shared-wishlist parser did not report the source-owned condition: ${condition.handledBy}`);
  }
}

console.log('Shared-wishlist source-first canonical parity checks passed.');
