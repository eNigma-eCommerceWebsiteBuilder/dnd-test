import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const sourcePath = path.join(templateRoot, 'app', 'categories', 'page.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'categories', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'categories', 'canonical');
const sourceLeafRoot = path.join(templateRoot, 'components', 'categories');
const dndLeafRoot = path.join(dndRoot, 'enigma-components', 'categories');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'categories.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'categories.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const publishedCategoryRoutePath = path.join(dndRoot, 'app', 'categories', '[slug]', 'page.tsx');
const publishedCategoriesRoutePath = path.join(dndRoot, 'app', 'categories', 'page.tsx');

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
  'CategoriesPageLayout',
  'CategoriesPageBreadcrumbs',
  'CategoriesPageIntro',
  'TrendingCategoriesSection',
  'DepartmentCategoriesSection',
];

for (const component of canonicalComponents) {
  requireText(
    source,
    `@/components/categories/canonical/${component}`,
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
  'fetchCategories({ withStats: true })',
  'fetchTrendingCategories()',
  'const topTrending = trendingCategories.slice(0, 2);',
  'const trendingIds = new Set(topTrending.map(c => c._id));',
  'const mainCategories = categories.filter(c => !trendingIds.has(c._id));',
  'hasTrending={topTrending.length > 0}',
  "badge={index === 0 ? 'Seasonal Pick' : 'Trending Now'}",
  'categories={mainCategories}',
  'showConciergeCard={mainCategories.length > 0}',
]) requireText(source, expected, 'production categories-page behavior');

for (const forbidden of [
  '<main className=',
  '<nav className=',
  '<section className=',
  'CategoriesPageStateSection',
]) {
  if (source.includes(forbidden)) {
    throw new Error(`The categories route must delegate this concern to a canonical production component: ${forbidden}`);
  }
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptCategoriesPage')) throw new Error('Categories must not use a fixed route emitter.');

for (const view of [
  'CategoriesPageLayoutView.tsx',
  'TrendingCategoriesSectionView.tsx',
  'DepartmentCategoriesSectionView.tsx',
]) {
  const viewSource = read(path.join(dndCanonicalRoot, view));
  requireText(viewSource, 'puckTransparentSlotProps', `${view} transparent slot handling`);
  requireText(viewSource, '?.(puckTransparentSlotProps)', `${view} slot-to-node adaptation`);
  if (viewSource.includes('style: { display:')) {
    throw new Error(`${view} must not push Puck slot styling into the source renderer.`);
  }
}

for (const [name, sourceLeaf, dndLeaf] of [
  ['CategoryCard', 'CategoryCard.tsx', 'CategoryCard.tsx'],
  ['CategoryGrid', 'CategoryGrid.tsx', 'CategoryGrid.tsx'],
  ['TrendingCategoryCard', 'TrendingCategoryCard.tsx', 'TrendingCategoryCard.tsx'],
] as const) {
  if (normalizeRenderer(read(path.join(sourceLeafRoot, sourceLeaf))) !== normalizeRenderer(read(path.join(dndLeafRoot, dndLeaf)))) {
    throw new Error(`${name} must remain a source-equivalent leaf, not a Puck replacement.`);
  }
}

for (const view of ['CategoryGridView.tsx', 'TrendingCategoryCardView.tsx']) {
  const viewSource = read(path.join(dndRoot, 'components', 'categories', view));
  requireText(viewSource, '@/enigma-components/categories/', `${view} direct production delegate`);
  if (viewSource.includes('hrefPrefix')) {
    throw new Error(`${view} must keep the production category URL instead of a Puck-only href.`);
  }
}

const publishedCategoryRoute = read(publishedCategoryRoutePath);
for (const expected of [
  'slug="category-detail"',
  'categorySlug',
  'fetchCategories({ withStats: true })',
]) requireText(publishedCategoryRoute, expected, 'production category URL bridge');

const publishedCategoriesRoute = read(publishedCategoriesRoutePath);
requireText(publishedCategoriesRoute, 'slug="categories"', 'production categories URL bridge');

const manifest = (JSON.parse(read(manifestPath)) as {
  components: Array<{ type: string; ast?: { sourceImportPaths?: string[] } }>;
}).components;
for (const component of canonicalComponents) {
  const entry = manifest.find(({ type }) => type === component);
  if (!entry?.ast?.sourceImportPaths?.includes(`@/components/categories/canonical/${component}`)) {
    throw new Error(`Manifest does not identify ${component} as a production canonical component.`);
  }
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const component of [
  ...canonicalComponents,
  'TrendingCategoryCard',
  'CategoryGrid',
]) requireText(seedText, `"type":"${component}"`, `seed ${component} region`);
for (const forbidden of ['SectionHeading', 'SectionHeaderWithDivider', 'CategoriesPageStateSection']) {
  if (seedText.includes(`"type":"${forbidden}"`)) {
    throw new Error(`Categories seed must not contain generic fallback: ${forbidden}`);
  }
}

const report = JSON.parse(read(reportPath)) as { droppedComponents?: string[]; warnings?: string[] };
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0) {
  throw new Error(`Categories parser diagnostics are not clean: ${JSON.stringify(report)}`);
}

console.log('Categories source-first canonical parity checks passed.');
