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

function requireExactCopy(sourcePath: string, dndPath: string, description: string) {
  const normalizeLineEndings = (source: string) => source.replace(/\r\n/g, '\n');
  if (normalizeLineEndings(read(sourcePath)) !== normalizeLineEndings(read(dndPath))) {
    throw new Error(`Source delegate drift: ${description}`);
  }
}

const source = read(path.join(templateRoot, 'app', 'page.tsx'));
for (const expected of [
  'className="flex-1 max-w-[1440px] mx-auto w-full"',
  '<PromotionBanner promotion={currentPromotion} className="w-full py-2 px-4" />',
  '<HeroSection heroProduct={heroProduct} content={homepage.hero} className="p-6 lg:p-12" />',
  '<CategoryHighlights',
  '<FeaturedProductsGrid',
  '<CuratedCollectionSection',
  '<InspirationSection',
  '<TestimonialsSection',
  '<NewsletterSignup className="px-6 lg:px-12 py-24" content={homepage.newsletter} />',
  '<TrustBadges badges={common.trustBadges} className="px-6 lg:px-12 py-12" />',
]) requireText(source, expected, 'production home-page signature');

const layout = read(path.join(dndRoot, 'components', 'home', 'canonical', 'HomePageLayout.tsx'));
for (const expected of [
  'flex-1 max-w-[1440px] mx-auto w-full',
  '{promotion}', '{hero}', '{categories}', '{featuredProducts}', '{curatedCollection}',
  '{inspiration}', '{testimonials}', '{newsletter}', '{trustBadges}',
]) requireText(layout, expected, 'canonical home layout');

for (const [file, importPath] of [
  ['PromotionBannerView.tsx', '@/enigma-components/home/PromotionBanner'],
  ['HeroSectionView.tsx', '@/enigma-components/home/HeroSection'],
  ['CategoryHighlightsView.tsx', '@/enigma-components/home/CategoryHighlights'],
  ['FeaturedProductsGridView.tsx', '@/enigma-components/home/FeaturedProductsGrid'],
  ['CuratedCollectionSectionView.tsx', '@/enigma-components/home/CuratedCollectionSection'],
  ['InspirationSectionView.tsx', '@/enigma-components/home/InspirationSection'],
  ['NewsletterSignupView.tsx', '@/enigma-components/home/NewsletterSignup'],
] as const) {
  requireText(read(path.join(dndRoot, 'components', 'home', file)), importPath, `${file} direct source delegate`);
}
for (const file of [
  'PromotionBanner.tsx',
  'HeroSection.tsx',
  'CategoryHighlights.tsx',
  'FeaturedProductsGrid.tsx',
  'CuratedCollectionSection.tsx',
  'InspirationSection.tsx',
  'NewsletterSignup.tsx',
  'TrustBadges.tsx',
]) {
  requireExactCopy(
    path.join(templateRoot, 'components', 'home', file),
    path.join(dndRoot, 'enigma-components', 'home', file),
    `home/${file}`,
  );
}
requireExactCopy(
  path.join(templateRoot, 'components', 'testimonials', 'TestimonialsSection.tsx'),
  path.join(dndRoot, 'enigma-components', 'testimonials', 'TestimonialsSection.tsx'),
  'testimonials/TestimonialsSection.tsx',
);

requireText(
  read(path.join(dndRoot, 'components', 'testimonials', 'TestimonialsSectionView.tsx')),
  '@/enigma-components/testimonials/TestimonialsSection',
  'TestimonialsSectionView direct source delegate',
);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'home.json')));
const root = seed.content?.[0];
if (root?.type !== 'HomePageLayout') throw new Error('Home seed must emit HomePageLayout.');
if (JSON.stringify(seed).includes('PageWrapper')) throw new Error('Home seed must not fall back to PageWrapper.');
const expectedSlots: Record<string, string> = {
  promotion: 'PromotionBanner', hero: 'HeroSection', categories: 'CategoryHighlights',
  featuredProducts: 'FeaturedProductsGrid', curatedCollection: 'CuratedCollectionSection',
  inspiration: 'InspirationSection', testimonials: 'TestimonialsSection',
  newsletter: 'NewsletterSignup', trustBadges: 'TrustBadges',
};
for (const [slot, type] of Object.entries(expectedSlots)) {
  if (root.props?.[slot]?.[0]?.type !== type) throw new Error(`Home seed slot ${slot} must contain ${type}.`);
}

const expectedSourceProps: Record<string, Record<string, unknown>> = {
  promotion: { className: 'w-full py-2 px-4' },
  hero: { className: 'p-6 lg:p-12', title: 'Timeless Quality for the Modern Wardrobe' },
  categories: { className: 'px-6 lg:px-12 py-20', header: 'Shop by Category' },
  featuredProducts: { className: 'px-6 lg:px-12 py-20', header: 'Featured Products' },
  curatedCollection: { className: 'px-6 lg:px-12 py-20', eyebrow: 'Curated Collection' },
  inspiration: { className: 'px-6 lg:px-12 py-20', header: 'Autumn in the City: A Curated Look' },
  testimonials: { className: 'px-6 lg:px-12 py-32', title: 'Our Community' },
  newsletter: { className: 'px-6 lg:px-12 py-24', title: 'Join the Inner Circle' },
  trustBadges: { className: 'px-6 lg:px-12 py-12' },
};

for (const [slot, expectedProps] of Object.entries(expectedSourceProps)) {
  const props = root.props?.[slot]?.[0]?.props;
  for (const [key, value] of Object.entries(expectedProps)) {
    if (props?.[key] !== value) throw new Error(`Home seed ${slot} must preserve source prop ${key}.`);
  }
}

for (const slot of ['categories', 'featuredProducts', 'curatedCollection', 'inspiration', 'testimonials']) {
  const props = root.props?.[slot]?.[0]?.props || {};
  for (const runtimeProp of ['runtimeCategories', 'runtimeProducts', 'runtimeCollection', 'runtimeTestimonials']) {
    if (runtimeProp in props) throw new Error(`Home seed must not serialize runtime prop ${runtimeProp}.`);
  }
}

const homeLayoutView = read(path.join(dndRoot, 'components', 'home', 'canonical', 'HomePageLayoutView.tsx'));
requireText(homeLayoutView, 'puckTransparentSlotProps', 'transparent Puck slot props');
requireText(homeLayoutView, 'promotion?.(puckTransparentSlotProps)', 'transparent promotion slot');

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'home.report.json')));
if (report.warnings?.length || report.droppedComponents?.length || report.unmatchedHtml?.length) {
  throw new Error('Home parser diagnostics must be clean.');
}

console.log('Home canonical parity checks passed.');
