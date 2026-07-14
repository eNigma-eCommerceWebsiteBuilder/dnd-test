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

const source = read(path.join(templateRoot, 'app', 'products', '[slug]', 'page.tsx'));
for (const expected of [
  'PromotionBanner', 'Breadcrumbs', 'ProductGallery', 'ProductDetailsClient',
  'product.rating !== undefined && product.rating > 0', 'relatedProducts.length > 0',
  'lg:grid-cols-12', 'lg:sticky', 'lg:hidden', 'ReviewsSection', 'TestimonialsSection', 'RelatedProducts',
]) requireText(source, expected, 'production product-detail signature');

const canonicalRoot = path.join(dndRoot, 'components', 'products', 'canonical');
for (const [file, expected] of [
  ['ProductDetailPageLayout.tsx', 'max-w-7xl'],
  ['ProductDetailMediaColumn.tsx', 'lg:col-span-7'],
  ['ProductDetailPurchaseColumn.tsx', 'lg:sticky lg:top-28'],
  ['ProductDetailMobileTabs.tsx', 'lg:hidden'],
  ['ProductDetailRelatedProductsSection.tsx', 'mb-16 mt-24'],
] as Array<[string, string]>) requireText(read(path.join(canonicalRoot, file)), expected, `${file} source layout signature`);

for (const [file, expected] of [
  ['ProductGalleryView.tsx', "import { ProductGallery } from './ProductGallery';"],
  ['PriceDisplayView.tsx', "import { PriceDisplay } from './PriceDisplay';"],
  ['StockIndicatorView.tsx', "import { StockIndicator } from './StockIndicator';"],
  ['ProductTabsView.tsx', "import { ProductTabs } from './ProductTabs';"],
  ['ReviewsSectionView.tsx', "import { ReviewsSection } from './ReviewsSection';"],
  ['RelatedProductsView.tsx', "import { RelatedProducts } from './RelatedProducts';"],
] as Array<[string, string]>) requireText(read(path.join(dndRoot, 'components', 'products', file)), expected, `${file} direct production delegate`);

const seed = read(path.join(dndRoot, 'data', 'seeds', 'product-detail.json'));
for (const type of [
  'ProductDetailPageLayout', 'ProductDetailMediaColumn', 'ProductDetailPurchaseColumn',
  'ProductDetailMobileTabs', 'ProductDetailTrustBadges', 'ProductDetailRelatedProductsSection',
  'PromotionBanner', 'ProductGallery', 'ProductDetailsClient', 'ReviewsSection', 'RelatedProducts',
]) requireText(seed, `"type": "${type}"`, 'canonical product-detail seed component');
for (const forbidden of ['"type": "PageWrapper"', '"type": "TwoColumnDetail"']) {
  if (seed.includes(forbidden)) throw new Error(`Product-detail seed must not contain generic fallback: ${forbidden}`);
}

const dynamicRoute = read(path.join(dndRoot, 'app', 'page', '[slug]', '[entitySlug]', 'page.tsx'));
requireText(dynamicRoute, "slug === 'product-detail'", 'product-detail dynamic route');
requireText(dynamicRoute, 'productSlug: entitySlug', 'product route metadata');

console.log('Product-detail canonical parity checks passed.');
