import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const sourcePath = path.join(templateRoot, 'app', 'products', '[slug]', 'page.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'products', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'products', 'canonical');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const sourcePageUtilsPath = path.join(templateRoot, 'app', 'products', '[slug]', 'productPageUtils.tsx');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'product-detail.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'product-detail.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');

function read(filePath: string): string {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireText(source: string, expected: string, description: string) {
  if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`);
}

function normalizeRenderer(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, '');
}

const source = read(sourcePath);
const canonicalComponents = [
  'ProductDetailPageLayout',
  'ProductDetailMediaColumn',
  'ProductDetailPurchaseColumn',
  'ProductDetailMobileTabs',
  'ProductDetailSection',
  'ProductDetailRelatedProductsSection',
  'ProductDetailTrustBadges',
];

for (const component of canonicalComponents) {
  requireText(source, `@/components/products/canonical/${component}`, `production ${component} import`);
  requireText(source, `<${component}`, `production ${component} JSX`);

  const sourceComponent = read(path.join(sourceCanonicalRoot, `${component}.tsx`));
  const dndComponent = read(path.join(dndCanonicalRoot, `${component}.tsx`));
  if (normalizeRenderer(sourceComponent) !== normalizeRenderer(dndComponent)) {
    throw new Error(`${component} differs between the production source and the DnD canonical renderer.`);
  }
}

const sourceContentBuilder = read(path.join(sourceCanonicalRoot, 'ProductDetailContent.tsx'));
const dndContentBuilder = read(path.join(dndCanonicalRoot, 'ProductDetailContent.tsx'));
if (normalizeRenderer(sourceContentBuilder) !== normalizeRenderer(dndContentBuilder)) {
  throw new Error('ProductDetailContent differs between the production source and the DnD canonical helper.');
}
const sourcePageUtils = read(sourcePageUtilsPath);
requireText(sourcePageUtils, "from '@/components/products/canonical/ProductDetailContent'", 'production detail-content helper re-export');

for (const expected of [
  'const pageData = await withNull(fetchProductPageData(slug));',
  'if (!pageData)',
  'notFound();',
  'hasRating={product.rating !== undefined && product.rating > 0}',
  'visible={relatedProducts.length > 0}',
  'purchase={<ProductDetailsClient product={product} />}',
  'content={<ProductTabs tabs={tabs} defaultTab="description" />}',
  'content={<TestimonialsSection testimonials={featuredTestimonials} />}',
  'content={<RelatedProducts products={relatedProducts} title="Complete the Look" />}',
]) requireText(source, expected, 'production product-detail behavior');

for (const forbidden of [
  'ProductsCatalogStateSection',
  'className="min-h-screen bg-bg-base text-text-base"',
  '<Suspense',
]) {
  if (source.includes(forbidden)) {
    throw new Error(`The product-detail route must delegate this concern to a canonical production component: ${forbidden}`);
  }
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptProductDetailPage')) throw new Error('Product detail must not use a fixed route emitter.');

for (const view of [
  'ProductDetailPageLayoutView.tsx',
  'ProductDetailMediaColumnView.tsx',
  'ProductDetailPurchaseColumnView.tsx',
  'ProductDetailMobileTabsView.tsx',
  'ProductDetailSectionView.tsx',
  'ProductDetailRelatedProductsSectionView.tsx',
]) {
  const viewSource = read(path.join(dndCanonicalRoot, view));
  requireText(viewSource, 'puckTransparentSlotProps', `${view} transparent slot handling`);
  requireText(viewSource, '?.(puckTransparentSlotProps)', `${view} slot-to-node adaptation`);
  if (viewSource.includes('<ProductCard') || viewSource.includes('style: { display:')) {
    throw new Error(`${view} must not reconstruct layout or pass Puck-only slot styling to the renderer.`);
  }
}

const breadcrumbsView = read(path.join(dndRoot, 'components', 'products', 'BreadcrumbsView.tsx'));
requireText(breadcrumbsView, 'buildProductBreadcrumbs(product)', 'source breadcrumb builder delegation');
const tabsView = read(path.join(dndRoot, 'components', 'products', 'ProductTabsView.tsx'));
requireText(tabsView, 'buildProductTabs(product, reviewsData)', 'source tab builder delegation');
if (tabsView.includes('Shipping & Returns') || tabsView.includes('product.specs.map')) {
  throw new Error('ProductTabsView must not reconstruct a simplified product-tab payload.');
}

const manifest = (JSON.parse(read(manifestPath)) as {
  components: Array<{ type: string; ast?: { sourceImportPaths?: string[] } }>;
}).components;
for (const component of canonicalComponents) {
  const entry = manifest.find(({ type }) => type === component);
  if (!entry?.ast?.sourceImportPaths?.includes(`@/components/products/canonical/${component}`)) {
    throw new Error(`Manifest does not identify ${component} as a production canonical component.`);
  }
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const component of [
  ...canonicalComponents,
  'PromotionBanner',
  'Breadcrumbs',
  'ProductGallery',
  'ProductDetailsClient',
  'ReviewsSection',
  'TestimonialsSection',
  'RelatedProducts',
]) requireText(seedText, `"type":"${component}"`, `seed ${component} region`);
for (const forbidden of ['ProductsCatalogStateSection', 'PageWrapper', 'TwoColumnDetail']) {
  if (seedText.includes(forbidden)) throw new Error(`Product-detail seed must not contain generic fallback: ${forbidden}`);
}

const report = JSON.parse(read(reportPath)) as { droppedComponents?: string[]; warnings?: string[] };
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0) {
  throw new Error(`Product-detail parser diagnostics are not clean: ${JSON.stringify(report)}`);
}

const dynamicRoute = read(path.join(dndRoot, 'app', 'page', '[slug]', '[entitySlug]', 'page.tsx'));
requireText(dynamicRoute, "slug === 'product-detail'", 'product-detail dynamic route');
requireText(dynamicRoute, 'productSlug: entitySlug', 'product-detail route metadata');

console.log('Product-detail source-first canonical parity checks passed.');
