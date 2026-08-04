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

function normalizeRenderer(source: string): string {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, '');
}

function collectProps(value: unknown, props: Set<string>) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectProps(item, props));
    return;
  }

  if (!value || typeof value !== 'object') return;
  const record = value as Record<string, unknown>;
  if (record.props && typeof record.props === 'object' && !Array.isArray(record.props)) {
    Object.keys(record.props as Record<string, unknown>).forEach((key) => props.add(key));
  }
  Object.values(record).forEach((child) => collectProps(child, props));
}

const pagePath = path.join(templateRoot, 'app', 'checkout', 'subscription', 'page.tsx');
const clientPath = path.join(templateRoot, 'components', 'checkout', 'subscription', 'SubscriptionCheckoutClient.tsx');
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'checkout', 'subscription', 'canonical');
const dndCanonicalRoot = path.join(dndRoot, 'components', 'checkout', 'subscription', 'canonical');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'checkout-subscription.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'checkout-subscription.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const bridgePath = path.join(dndRoot, 'app', 'checkout', 'subscription', 'page.tsx');

const page = read(pagePath);
const client = read(clientPath);
const pageState = read(path.join(sourceCanonicalRoot, 'SubscriptionCheckoutPageState.tsx'));
const pageLayout = read(path.join(sourceCanonicalRoot, 'SubscriptionCheckoutPageLayout.tsx'));
const slotLayout = read(path.join(sourceCanonicalRoot, 'SubscriptionCheckoutSlotLayout.tsx'));
const flowProvider = read(path.join(sourceCanonicalRoot, 'SubscriptionCheckoutFlowProvider.tsx'));

for (const value of [
  'fetchSubscriptionCheckoutData()',
  '<SubscriptionCheckoutPageState checkoutData={checkoutData}>',
  '<SubscriptionCheckoutPageLayout',
  '<SubscriptionCheckoutClient {...checkoutData!} />',
]) requireText(page, value, 'production route signature');

for (const value of [
  '<SubscriptionCheckoutSlotLayout',
  'header={<SubscriptionCheckoutHeader />}',
  'steps={<SubscriptionCheckoutSteps />}',
  '<SubscriptionCustomerInfoSection',
  '<SubscriptionShippingAddressSection',
  '<SubscriptionBillingTermsSection',
  '<SubscriptionCheckoutError',
  '<SubscriptionCartSummaryPanel',
  '<SubscriptionPricingPreviewPanel',
  '<SubscriptionTermsSummaryPanel',
  '<SubscriptionCheckoutActions',
]) requireText(client, value, 'production client signature');

for (const value of [
  'if (!checkoutData)',
  'redirect(ROUTES.CART)',
]) requireText(pageState, value, 'production page-state behavior');
for (const value of [
  'min-h-screen w-full bg-bg-base text-text-base',
  'max-w-[1440px]',
  'lg:px-20',
]) requireText(pageLayout, value, 'production page-layout markup');
for (const value of [
  '<SubscriptionCheckoutFlowProvider',
  '<SubscriptionCheckoutContentLayout',
  'leftColumn={leftColumn}',
  'rightColumn={rightColumn}',
]) requireText(slotLayout, value, 'production slot-layout markup');
for (const value of [
  'useSubscriptionCheckoutFlow({ cart, sellingPlans, pricingPreview })',
  'SubscriptionCheckoutFlowContext.Provider',
]) requireText(flowProvider, value, 'production checkout-flow owner');

const dndState = read(path.join(dndCanonicalRoot, 'SubscriptionCheckoutPageState.tsx'));
const dndLayout = read(path.join(dndCanonicalRoot, 'SubscriptionCheckoutPageLayout.tsx'));
const dndClientLayout = read(path.join(dndCanonicalRoot, 'SubscriptionCheckoutClientLayout.tsx'));
const dndFlow = read(path.join(dndCanonicalRoot, 'SubscriptionCheckoutFlowContext.tsx'));
const dndRuntime = read(path.join(dndCanonicalRoot, 'subscriptionCheckoutRuntime.ts'));
const dndStateView = read(path.join(dndCanonicalRoot, 'SubscriptionCheckoutPageStateView.tsx'));
const dndClientView = read(path.join(dndCanonicalRoot, 'SubscriptionCheckoutClientLayoutView.tsx'));

for (const [source, copied, name] of [
  [pageLayout, dndLayout, 'page layout'],
] as Array<[string, string, string]>) {
  if (normalizeRenderer(source) !== normalizeRenderer(copied)) {
    throw new Error(`Subscription checkout ${name} is not source-equivalent.`);
  }
}

for (const value of ['if (!checkoutData)', 'redirect(ROUTES.CART)']) {
  requireText(dndState, value, 'DnD page-state behavior');
}
for (const value of [
  '<SubscriptionCheckoutFlowProvider',
  '<SubscriptionCheckoutContentLayout',
  'leftColumn={leftColumn}',
  'rightColumn={rightColumn}',
]) requireText(dndClientLayout, value, 'DnD source slot-layout delegation');
for (const value of [
  'useSubscriptionCheckoutFlow({ cart, sellingPlans, pricingPreview })',
  'SubscriptionCheckoutFlowContext.Provider',
]) requireText(dndFlow, value, 'DnD production-flow delegation');
for (const forbidden of ['handleCheckout: () => {}', 'Cancellation policy details will be shared before payment.']) {
  if (dndFlow.includes(forbidden)) {
    throw new Error(`Subscription checkout still contains a no-op flow replacement: ${forbidden}`);
  }
}
for (const value of ['getCart', 'getProductSellingPlans', 'previewSubscriptionPricing']) {
  requireText(dndRuntime, value, 'DnD runtime loader behavior');
}
for (const forbidden of ['subscriptionCheckoutPreview', 'puckPreview', 'getSearchParam']) {
  if (dndRuntime.includes(forbidden)) {
    throw new Error(`Subscription checkout runtime contains editor-preview behavior: ${forbidden}`);
  }
}
for (const view of [dndStateView, dndClientView]) {
  requireText(view, 'puck?.isEditing', 'editor-only preview boundary');
  requireText(view, 'subscriptionCheckoutPreview', 'editor fixture use');
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptSubscriptionCheckoutPage')) {
  throw new Error('Subscription checkout must not use a fixed route emitter.');
}
for (const forbidden of ['const previewCart =', 'const previewPlans =', 'const previewPricing =']) {
  if (parser.includes(forbidden)) {
    throw new Error(`Subscription checkout parser still serializes preview data: ${forbidden}`);
  }
}

requireText(read(bridgePath), 'slug="checkout-subscription"', 'direct published route bridge');

const manifest = JSON.parse(read(manifestPath)) as {
  components?: Array<{ type?: string; ast?: Record<string, unknown> }>;
};
for (const [component, sourceImport] of [
  ['SubscriptionCheckoutPageState', '@/components/checkout/subscription/canonical/SubscriptionCheckoutPageState'],
  ['SubscriptionCheckoutClientLayout', '@/components/checkout/subscription/canonical/SubscriptionCheckoutSlotLayout'],
] as Array<[string, string]>) {
  const entry = manifest.components?.find((candidate) => candidate.type === component);
  if (!entry) throw new Error(`Missing manifest component: ${component}`);
  const paths = entry.ast?.sourceImportPaths;
  if (!Array.isArray(paths) || !paths.includes(sourceImport)) {
    throw new Error(`Manifest provenance mismatch for ${component}.`);
  }
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const type of [
  'SubscriptionCheckoutPageState',
  'SubscriptionCheckoutPageLayout',
  'SubscriptionCheckoutClientLayout',
  'SubscriptionCheckoutHeader',
  'SubscriptionCheckoutSteps',
  'SubscriptionCustomerInfoSection',
  'SubscriptionShippingAddressSection',
  'SubscriptionBillingTermsSection',
  'SubscriptionCheckoutErrorCondition',
  'SubscriptionCartSummaryPanel',
  'SubscriptionPricingPreviewPanel',
  'SubscriptionSummaryPanel',
  'SubscriptionCheckoutActions',
]) requireText(seedText, `"type":"${type}"`, `seed ${type} region`);

const persistedProps = new Set<string>();
collectProps(seed, persistedProps);
for (const forbidden of ['state', 'cart', 'sellingPlans', 'pricingPreview', 'checkoutData', 'previewMode']) {
  if (persistedProps.has(forbidden)) {
    throw new Error(`Subscription seed must not persist runtime or preview data: ${forbidden}`);
  }
}
for (const forbidden of [
  'CheckoutSubscriptionStateSection',
  'PageWrapper',
  'PageHeader',
  'TwoColumnDetail',
  'CardSection',
  'CalloutCard',
  'subscription-preview-cart',
  'subscription-preview-plan',
]) {
  if (seedText.includes(forbidden)) {
    throw new Error(`Subscription seed must not contain a generic fallback or preview fixture: ${forbidden}`);
  }
}

const report = JSON.parse(read(reportPath)) as {
  droppedComponents?: string[];
  warnings?: string[];
  unmatchedHtml?: string[];
  runtimeConditionals?: Array<{ source?: string; handledBy?: string }>;
};
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0 || (report.unmatchedHtml ?? []).length > 0) {
  throw new Error(`Subscription parser diagnostics are not clean: ${JSON.stringify(report)}`);
}
if (!report.runtimeConditionals?.some((condition) =>
  condition.source === '!checkoutData => redirect(ROUTES.CART)'
  && condition.handledBy === 'SubscriptionCheckoutPageState'
)) {
  throw new Error('Subscription parser diagnostics do not record the source-owned empty-cart redirect.');
}

console.log('Checkout-subscription source-first canonical parity checks passed.');
