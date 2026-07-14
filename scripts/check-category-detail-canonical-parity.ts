import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');

function read(filePath: string): string {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireText(source: string, expected: string, description: string) {
  if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`);
}

const source = read(path.join(templateRoot, 'app', 'categories', '[slug]', 'page.tsx'));
for (const expected of [
  'className="min-h-screen bg-bg-base text-text-base"',
  'className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8"',
  'className="flex items-center gap-2 text-sm text-text-muted mb-6"',
  'className="w-full lg:w-[280px] flex-shrink-0"',
  'siblingCategories.length > 0',
  'products.length > 0',
  'totalPages > 1',
  '<CategoryHero category={category} productCount={totalItems} />',
  '<ProductGrid products={products} />',
]) requireText(source, expected, 'production category-detail signature');

const canonicalRoot = path.join(dndRoot, 'components', 'categories', 'canonical');
const canonicalChecks: Array<[string, string[]]> = [
  ['CategoryCatalogLayout.tsx', ['min-h-screen bg-bg-base text-text-base', 'max-w-[1440px] mx-auto px-6 lg:px-12 py-8']],
  ['CategoryCatalogBreadcrumbs.tsx', ['flex items-center gap-2 text-sm text-text-muted mb-6', 'All Categories']],
  ['CategoryCatalogFilterSidebar.tsx', ['w-full lg:w-[280px] flex-shrink-0', 'h-32 bg-bg-skeleton rounded-card animate-skeleton']],
  ['CategoryCatalogResultsHeader.tsx', ['flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8', 'items in this collection']],
  ['CategoryCatalogResultsState.tsx', ['className="flex-1"', 'showResults ? results : empty']],
  ['CategoryCatalogGridBoundary.tsx', ['<ProductGridSkeleton count={pageSize} />']],
];

for (const [file, expectedValues] of canonicalChecks) {
  const component = read(path.join(canonicalRoot, file));
  for (const expected of expectedValues) requireText(component, expected, `${file} source parity`);
}

for (const leaf of ['CategoryHeroView.tsx', 'SubcategoryNavView.tsx', 'EmptyCategoryView.tsx']) {
  const view = read(path.join(dndRoot, 'components', 'categories', leaf));
  requireText(view, '@/enigma-components/categories/', `${leaf} direct production delegate`);
}

const seed = read(path.join(dndRoot, 'data', 'seeds', 'category-detail.json'));
for (const expectedType of [
  'CategoryCatalogLayout', 'CategoryCatalogBreadcrumbs', 'CategorySubcategoryCondition',
  'CategoryCatalogFilterSidebar', 'CategoryCatalogResultsState', 'CategoryProductGridBlock',
  'CategoryCatalogPaginationCondition', 'EmptyCategory',
]) requireText(seed, `"type": "${expectedType}"`, 'canonical category seed component');
if (seed.includes('CategoryCatalogStateSection')) throw new Error('Category seed must not contain the legacy opaque state section.');

console.log('Category-detail canonical parity checks passed.');
