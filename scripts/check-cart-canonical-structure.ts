import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const routePath = path.join(templateRoot, 'app', 'cart', 'page.tsx');
const clientPath = path.join(templateRoot, 'components', 'templates', 'cart', 'CartPageClient.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'templates', 'cart', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'cart', 'canonical');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'cart.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'cart.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const publishedRoutePath = path.join(dndRoot, 'app', 'cart', 'page.tsx');

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

const route = read(routePath);
for (const expected of [
  'initialCart = await getCart({',
  'cookies: await getServerCookies(),',
  '<CartPageClient initialCart={initialCart} />',
]) requireText(route, expected, 'production server cart handoff');

const client = read(clientPath);
const canonicalComponents = [
  'CartPageState',
  'CartPageLayout',
  'CartPageEmptyLayout',
  'CartPageHeader',
  'CartPageFreeShippingProgress',
  'CartPageItemList',
  'CartPageContinueShopping',
  'CartPageSummary',
  'CartPageEmpty',
];

for (const component of canonicalComponents) {
  requireText(client, `./canonical/${component}`, `production ${component} import`);
  requireText(client, `<${component}`, `production ${component} JSX`);

  const sourceComponent = read(path.join(sourceCanonicalRoot, `${component}.tsx`));
  const dndComponent = read(path.join(dndCanonicalRoot, `${component}.tsx`));
  if (normalizeRenderer(sourceComponent) !== normalizeRenderer(dndComponent)) {
    throw new Error(`${component} differs between the production source and DnD canonical renderer.`);
  }
}

for (const forbidden of ['<main className=', '<CartSummary ', '<CartItemList ', '<FreeShippingProgress ', 'useCart(false)']) {
  if (client.includes(forbidden)) {
    throw new Error(`CartPageClient must delegate this concern to a production canonical component: ${forbidden}`);
  }
}

const state = read(path.join(sourceCanonicalRoot, 'CartPageState.tsx'));
for (const expected of [
  'hydrateCart(initialCart)',
  'useCart(false)',
  'trackEvent(AnalyticsEventType.REMOVE_FROM_CART',
  'await updateItem(productId, quantity);',
  'await removeItem(productId);',
  'await estimateTax(location);',
  '!loading && activeItems.length === 0',
]) requireText(state, expected, 'production cart state behavior');

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptCartPage')) throw new Error('Cart must not use a fixed route emitter.');

for (const view of [
  'CartPageStateView.tsx',
  'CartPageLayoutView.tsx',
  'CartPageEmptyLayoutView.tsx',
]) {
  const viewSource = read(path.join(dndCanonicalRoot, view));
  requireText(viewSource, 'puckTransparentSlotProps', `${view} transparent slot handling`);
  requireText(viewSource, '?.(puckTransparentSlotProps)', `${view} slot-to-node adaptation`);
  if (viewSource.includes('style: { display:')) {
    throw new Error(`${view} must not push Puck-only styling into a source renderer.`);
  }
}

requireText(read(path.join(dndCanonicalRoot, 'CartPageStateView.tsx')), 'puck?.isEditing', 'editor-only cart preview behavior');
for (const [file, canonical] of [
  ['CartPageHeaderView.tsx', 'CartPageHeader'],
  ['CartPageFreeShippingProgressView.tsx', 'CartPageFreeShippingProgress'],
  ['CartPageItemListView.tsx', 'CartPageItemList'],
  ['CartPageContinueShoppingView.tsx', 'CartPageContinueShopping'],
  ['CartPageSummaryView.tsx', 'CartPageSummary'],
  ['CartPageEmptyView.tsx', 'CartPageEmpty'],
] as const) requireText(read(path.join(dndCanonicalRoot, file)), `import { ${canonical} } from './${canonical}';`, `${file} canonical delegate`);

const dndCartHook = read(path.join(dndRoot, 'lib', 'hooks', 'cart', 'useCart.ts'));
const sourceCartHook = read(path.join(templateRoot, 'lib', 'hooks', 'cart', 'useCart.ts'));
if (normalizeRenderer(dndCartHook) !== normalizeRenderer(sourceCartHook)) {
  throw new Error('DnD useCart must remain the source-equivalent production cart hook.');
}

const publishedRoute = read(publishedRoutePath);
for (const expected of ['slug="cart"', "routeParams={{ slug: 'cart' }}"]) {
  requireText(publishedRoute, expected, 'production cart URL bridge');
}

const manifest = (JSON.parse(read(manifestPath)) as {
  components: Array<{ type: string; ast?: { sourceImportPaths?: string[] } }>;
}).components;
for (const component of canonicalComponents) {
  const entry = manifest.find(({ type }) => type === component);
  if (!entry?.ast?.sourceImportPaths?.includes(`@/components/templates/cart/canonical/${component}`)) {
    throw new Error(`Manifest does not identify ${component} as a production canonical component.`);
  }
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const component of canonicalComponents) {
  requireText(seedText, `"type":"${component}"`, `seed ${component} region`);
}
for (const forbidden of ['CartStateSection', 'CartHeader', 'CartList', 'CartContinueShopping', '"previewMode"', 'Preview Wool Scarf', '"subtotal"']) {
  if (seedText.includes(forbidden)) {
    throw new Error(`Cart seed must not contain prototype-only data or generic fallback: ${forbidden}`);
  }
}

const report = JSON.parse(read(reportPath)) as {
  droppedComponents?: string[];
  warnings?: string[];
  unmatchedHtml?: string[];
  runtimeConditionals?: Array<{ source?: string }>;
};
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0 || (report.unmatchedHtml ?? []).length > 0) {
  throw new Error(`Cart parser diagnostics are not clean: ${JSON.stringify(report)}`);
}
if (!report.runtimeConditionals?.some((item) => item.source === '!loading && activeItems.length === 0')) {
  throw new Error('Cart parser did not report the source-owned empty-cart condition.');
}

console.log('Cart source-first canonical parity checks passed.');
