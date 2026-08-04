import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const sourcePath = path.join(templateRoot, 'app', 'checkout', 'success', 'page.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'checkout', 'success', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'checkout', 'success', 'canonical');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'checkout-success.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'checkout-success.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const runtimePath = path.join(dndCanonicalRoot, 'checkoutSuccessRuntime.ts');
const publishedRoutePath = path.join(dndRoot, 'app', 'checkout', 'success', 'page.tsx');

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
  'CheckoutSuccessPageState',
  'CheckoutSuccessPageLayout',
  'CheckoutSuccessHeaderLayout',
  'CheckoutSuccessTwoColumnLayout',
  'CheckoutSuccessOrderColumn',
  'CheckoutSuccessDetailsColumn',
  'CheckoutSuccessDigitalAssetsCondition',
  'CheckoutSuccessLicenseKeys',
  'CheckoutSuccessActionsLayout',
];

for (const component of canonicalComponents) {
  requireText(source, `@/components/checkout/success/canonical/${component}`, `production ${component} import`);
  requireText(source, `<${component}`, `production ${component} JSX`);

  const sourceComponent = read(path.join(sourceCanonicalRoot, `${component}.tsx`));
  const dndComponent = read(path.join(dndCanonicalRoot, `${component}.tsx`));
  if (normalizeRenderer(sourceComponent) !== normalizeRenderer(dndComponent)) {
    throw new Error(`${component} differs between the production source and DnD canonical renderer.`);
  }
}

for (const expected of [
  'if (!orderId)',
  'order = await getOrder(orderId);',
  'if (order && hasDigitalItems(order))',
  'digitalAssets = await getOrderDigitalAssets(orderId, email || null);',
  'available={digitalAssetsAvailable}',
  '<DigitalDownloads assets={assets} />',
  '<CheckoutSuccessLicenseKeys assets={assets} />',
  '<PurchaseTracker order={order!} />',
  '<ViewOrderButton orderId={order!._id} />',
]) requireText(source, expected, 'production checkout-success behavior');

for (const forbidden of ['<main className=', '<div className="grid grid-cols-1', '<LicenseKeyDisplay', 'CheckoutDigitalAssetsSection']) {
  if (source.includes(forbidden)) {
    throw new Error(`The checkout-success route must delegate this concern to a canonical production component: ${forbidden}`);
  }
}

const pageState = read(path.join(sourceCanonicalRoot, 'CheckoutSuccessPageState.tsx'));
for (const expected of ['if (!order)', 'redirect(ROUTES.HOME)']) {
  requireText(pageState, expected, 'production success redirect state');
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptCheckoutSuccessPage')) throw new Error('Checkout success must not use a fixed route emitter.');

for (const view of [
  'CheckoutSuccessPageStateView.tsx',
  'CheckoutSuccessPageLayoutView.tsx',
  'CheckoutSuccessHeaderLayoutView.tsx',
  'CheckoutSuccessTwoColumnLayoutView.tsx',
  'CheckoutSuccessOrderColumnView.tsx',
  'CheckoutSuccessDetailsColumnView.tsx',
  'CheckoutSuccessDigitalAssetsConditionView.tsx',
  'CheckoutSuccessActionsLayoutView.tsx',
]) {
  const viewSource = read(path.join(dndCanonicalRoot, view));
  requireText(viewSource, 'puckTransparentSlotProps', `${view} transparent slot handling`);
  requireText(viewSource, '?.(puckTransparentSlotProps)', `${view} slot-to-node adaptation`);
  if (viewSource.includes('style: { display:')) {
    throw new Error(`${view} must not push Puck-only styling into a source renderer.`);
  }
}

for (const view of [
  'CheckoutSuccessPageStateView.tsx',
  'CheckoutSuccessDigitalAssetsConditionView.tsx',
  'CheckoutSuccessDigitalDownloadsView.tsx',
  'CheckoutSuccessLicenseKeysView.tsx',
  'CheckoutSuccessOrderNumberView.tsx',
  'CheckoutSuccessOrderItemListView.tsx',
  'CheckoutSuccessOrderSummaryView.tsx',
  'CheckoutSuccessShippingInfoView.tsx',
  'CheckoutSuccessNextStepsView.tsx',
  'CheckoutSuccessPurchaseTrackerView.tsx',
  'CheckoutSuccessViewOrderView.tsx',
]) requireText(read(path.join(dndCanonicalRoot, view)), 'puck?.isEditing', `${view} editor-only preview behavior`);

for (const [file, delegate] of [
  ['CheckoutSuccessHeaderView.tsx', '@/enigma-components/checkout/success/SuccessHeader'],
  ['CheckoutSuccessOrderNumberView.tsx', '@/enigma-components/checkout/success/OrderNumber'],
  ['CheckoutSuccessOrderItemListView.tsx', '@/enigma-components/checkout/success/OrderItemList'],
  ['CheckoutSuccessOrderSummaryView.tsx', '@/enigma-components/checkout/success/OrderSummary'],
  ['CheckoutSuccessShippingInfoView.tsx', '@/enigma-components/checkout/success/ShippingInfo'],
  ['CheckoutSuccessDigitalDownloadsView.tsx', '@/enigma-components/checkout/success/DigitalDownloads'],
  ['CheckoutSuccessNextStepsView.tsx', '@/enigma-components/checkout/success/NextStepsCard'],
  ['CheckoutSuccessPurchaseTrackerView.tsx', '@/enigma-components/checkout/success/PurchaseTracker'],
  ['CheckoutSuccessContinueShoppingView.tsx', '@/enigma-components/checkout/success/ContinueShoppingButton'],
  ['CheckoutSuccessViewOrderView.tsx', '@/enigma-components/checkout/success/ViewOrderButton'],
] as const) requireText(read(path.join(dndCanonicalRoot, file)), delegate, `${file} direct production delegate`);
requireText(read(path.join(dndCanonicalRoot, 'CheckoutSuccessLicenseKeysView.tsx')), "import { CheckoutSuccessLicenseKeys } from './CheckoutSuccessLicenseKeys';", 'license-key canonical delegate');

const runtime = read(runtimePath);
for (const expected of [
  'const order = await getOrder(orderId);',
  'if (order && hasDigitalItems(order))',
  'digitalAssets = await getOrderDigitalAssets(orderId, email);',
  'return { order, digitalAssets };',
]) requireText(runtime, expected, 'source-equivalent checkout-success runtime behavior');
for (const forbidden of ['isCheckoutSuccessSeedPreview', 'puckPreview', 'catch {']) {
  if (runtime.includes(forbidden)) {
    throw new Error(`Checkout-success runtime must not retain prototype preview/error behavior: ${forbidden}`);
  }
}

const publishedRoute = read(publishedRoutePath);
for (const expected of ['slug="checkout-success"', "routeParams={{ slug: 'checkout-success' }}"]) {
  requireText(publishedRoute, expected, 'production checkout-success URL bridge');
}

const manifest = (JSON.parse(read(manifestPath)) as {
  components: Array<{ type: string; ast?: { sourceImportPaths?: string[] } }>;
}).components;
for (const component of canonicalComponents) {
  const entry = manifest.find(({ type }) => type === component);
  if (!entry?.ast?.sourceImportPaths?.includes(`@/components/checkout/success/canonical/${component}`)) {
    throw new Error(`Manifest does not identify ${component} as a production canonical component.`);
  }
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const component of [
  ...canonicalComponents,
  'CheckoutSuccessPurchaseTracker',
  'CheckoutSuccessHeader',
  'CheckoutSuccessOrderNumber',
  'CheckoutSuccessOrderItemList',
  'CheckoutSuccessOrderSummary',
  'CheckoutSuccessDigitalDownloads',
  'CheckoutSuccessShippingInfo',
  'CheckoutSuccessNextSteps',
  'CheckoutSuccessContinueShopping',
  'CheckoutSuccessViewOrder',
]) requireText(seedText, `"type":"${component}"`, `seed ${component} region`);
for (const forbidden of ['CheckoutDigitalAssetsSection', 'PageWrapper', 'TwoColumnDetail', '"previewMode"', 'ORD-PREVIEW-1001', 'PREVIEW-LICENSE-KEY-1001', '"orderNumber":"', '"customerEmail":"']) {
  if (seedText.includes(forbidden)) {
    throw new Error(`Checkout-success seed must not contain prototype-only data or generic fallback: ${forbidden}`);
  }
}

const report = JSON.parse(read(reportPath)) as {
  droppedComponents?: string[];
  warnings?: string[];
  unmatchedHtml?: string[];
  runtimeConditionals?: Array<{ source?: string; handledBy?: string }>;
};
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0 || (report.unmatchedHtml ?? []).length > 0) {
  throw new Error(`Checkout-success parser diagnostics are not clean: ${JSON.stringify(report)}`);
}
for (const condition of [
  { source: '!order => redirect(ROUTES.HOME)', handledBy: 'CheckoutSuccessPageState' },
  {
    source: 'digitalAssets && digitalAssets.hasDigitalItems && digitalAssets.assets && digitalAssets.assets.length > 0',
    handledBy: 'CheckoutSuccessDigitalAssetsCondition',
  },
]) {
  if (!report.runtimeConditionals?.some((item) => item.source === condition.source && item.handledBy === condition.handledBy)) {
    throw new Error(`Checkout-success parser did not report the source-owned condition: ${condition.handledBy}`);
  }
}

console.log('Checkout-success source-first canonical parity checks passed.');
