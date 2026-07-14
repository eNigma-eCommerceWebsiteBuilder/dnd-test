import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const sourcePath = path.join(templateRoot, 'app', 'products', 'page.tsx');
const canonicalRoot = path.join(dndRoot, 'components', 'products', 'canonical');
const gridViewPath = path.join(dndRoot, 'components', 'products', 'ProductGridView.tsx');

function read(filePath: string): string {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireText(source: string, expected: string, description: string) {
  if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`);
}

const source = read(sourcePath);
for (const expected of [
  'className="min-h-screen bg-bg-base text-text-base"',
  'className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8"',
  'className="flex items-center gap-2 text-sm text-text-muted mb-4"',
  'className="flex flex-col md:flex-row md:items-end justify-between gap-4"',
  'className="hidden lg:block w-[280px] flex-shrink-0"',
  'products.length > 0',
  'totalPages > 1',
  '<ProductGrid products={products} />',
]) requireText(source, expected, 'production products-page signature');

const canonicalChecks: Array<[string, string[]]> = [
  ['ProductsCatalogLayout.tsx', ['min-h-screen bg-bg-base text-text-base', 'max-w-[1440px] mx-auto px-6 lg:px-12 py-8']],
  ['CatalogHeaderLayout.tsx', ['mb-10', 'flex flex-col md:flex-row md:items-end justify-between gap-4']],
  ['CatalogBreadcrumbs.tsx', ['flex items-center gap-2 text-sm text-text-muted mb-4', 'hover:text-primary transition-colors']],
  ['CatalogTitleSummary.tsx', ['text-4xl md:text-5xl font-black tracking-tight text-text-base mb-2', 'text-text-muted font-medium']],
  ['CatalogControlsLayout.tsx', ['flex items-center gap-3 md:gap-4']],
  ['CatalogContentLayout.tsx', ['flex flex-col lg:flex-row gap-8 lg:gap-12']],
  ['CatalogFilterSidebar.tsx', ['hidden lg:block w-[280px] flex-shrink-0', 'h-40 bg-bg-skeleton rounded-card animate-pulse']],
  ['CatalogResultsState.tsx', ['className="flex-1"', 'showResults ? results : empty']],
  ['CatalogGridBoundary.tsx', ['<ProductGridSkeleton count={pageSize} />']],
  ['CatalogPaginationCondition.tsx', ['showPagination ? <>{content}</> : null']],
];

for (const [file, expectedValues] of canonicalChecks) {
  const component = read(path.join(canonicalRoot, file));
  for (const expected of expectedValues) requireText(component, expected, `${file} source parity`);
}

const gridView = read(gridViewPath);
requireText(gridView, '<ProductGrid products={products} listName={listName} className={className} />', 'direct ProductGrid delegation');
for (const forbidden of ['ProductCard', 'function toProduct', 'items:']) {
  if (gridView.includes(forbidden)) throw new Error(`ProductGridView must not contain replacement behavior: ${forbidden}`);
}

console.log('Products canonical parity checks passed.');
