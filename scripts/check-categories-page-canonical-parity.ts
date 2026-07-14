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

const source = read(path.join(templateRoot, 'app', 'categories', 'page.tsx'));
for (const expected of [
  'const topTrending = trendingCategories.slice(0, 2);',
  'const mainCategories = categories.filter(c => !trendingIds.has(c._id));',
  'topTrending.length > 0',
  '<TrendingCategoryCard',
  '<CategoryGrid',
  'Browse by Department',
]) requireText(source, expected, 'production categories-page signature');

const canonicalRoot = path.join(dndRoot, 'components', 'categories', 'canonical');
const canonicalChecks: Array<[string, string[]]> = [
  ['CategoriesPageLayout.tsx', ['min-h-screen bg-bg-base text-text-base', 'max-w-[1280px] mx-auto px-6 lg:px-10 py-8']],
  ['CategoriesPageIntro.tsx', ['Curated Collections', 'meticulously selected categories']],
  ['TrendingCategoriesSection.tsx', ['Trending Categories', 'View all trends', 'grid grid-cols-1 md:grid-cols-2 gap-6']],
  ['DepartmentCategoriesSection.tsx', ['Browse by Department', 'h-[2px] flex-1 bg-divider']],
];

for (const [file, expectedValues] of canonicalChecks) {
  const component = read(path.join(canonicalRoot, file));
  for (const expected of expectedValues) requireText(component, expected, `${file} source parity`);
}

requireText(
  read(path.join(canonicalRoot, 'TrendingCategoriesSection.tsx')),
  "cards?.({ className: 'grid grid-cols-1 md:grid-cols-2 gap-6' })",
  'Puck slot grid ownership',
);
requireText(
  read(path.join(canonicalRoot, 'DepartmentCategoriesSection.tsx')),
  "grid?.({ style: { display: 'contents' } })",
  'transparent Puck slot wrapper for the production category grid',
);
requireText(
  read(path.join(dndRoot, 'tailwind.config.ts')),
  "'./enigma-components/**/*.{js,jsx,ts,tsx}'",
  'Tailwind production-component content source',
);

for (const leaf of ['CategoryGridView.tsx', 'TrendingCategoryCardView.tsx']) {
  const view = read(path.join(dndRoot, 'components', 'categories', leaf));
  requireText(view, '@/enigma-components/categories/', `${leaf} direct production delegate`);
  requireText(view, 'hrefPrefix="/page/category-detail"', `${leaf} published category-detail route`);
}

const seed = read(path.join(dndRoot, 'data', 'seeds', 'categories.json'));
for (const expectedType of [
  'CategoriesPageLayout', 'CategoriesPageBreadcrumbs', 'CategoriesPageIntro',
  'TrendingCategoriesSection', 'TrendingCategoryCard', 'DepartmentCategoriesSection', 'CategoryGrid',
]) requireText(seed, `"type": "${expectedType}"`, 'canonical categories seed component');
for (const forbiddenType of ['"type": "SectionHeading"', '"type": "SectionHeaderWithDivider"']) {
  if (seed.includes(forbiddenType)) throw new Error(`Categories seed must not contain generic fallback: ${forbiddenType}`);
}

console.log('Categories-page canonical parity checks passed.');
