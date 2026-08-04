import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');

function read(filePath: string): string {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireText(source: string, expected: string, description: string) {
  if (!source.includes(expected)) {
    throw new Error(`Missing ${description}: ${expected}`);
  }
}

function normalizeSource(source: string): string {
  return source
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

const sourcePage = read(path.join(templateRoot, 'app', 'checkout', 'page.tsx'));
const sourceClient = read(path.join(templateRoot, 'components', 'templates', 'checkout', 'CheckoutPageClient.tsx'));
const sourceCanonicalRoot = path.join(templateRoot, 'components', 'templates', 'checkout', 'canonical');
const sourceRuntime = read(path.join(sourceCanonicalRoot, 'checkoutPageRuntime.ts'));
const sourceState = read(path.join(sourceCanonicalRoot, 'CheckoutPageState.tsx'));
const sourceSlotLayout = read(path.join(sourceCanonicalRoot, 'CheckoutPageSlotLayout.tsx'));
const sourceFlow = read(path.join(sourceCanonicalRoot, 'CheckoutFlowProvider.tsx'));
const sourceRegions = read(path.join(sourceCanonicalRoot, 'CheckoutPageRegions.tsx'));

for (const signature of [
  'fetchCheckoutPageData()',
  '<CheckoutPageState checkoutData={checkoutData}>',
  '<CheckoutPageClient',
  'initialCart={checkoutData.cart!}',
]) requireText(sourcePage, signature, 'production checkout route signature');
for (const signature of [
  'const cookies = requestCookies ?? await getServerCookies()',
  'const session = await auth()',
  'cart = await getCart({ cookies })',
]) requireText(sourceRuntime, signature, 'production checkout runtime signature');
for (const signature of [
  '!checkoutData.cart?.items?.length',
  'redirect(ROUTES.CART)',
]) requireText(sourceState, signature, 'production empty-cart redirect');
for (const signature of [
  '<CheckoutPageSlotLayout',
  'steps={<CheckoutStepsRegion />}',
  'shipping={<CheckoutShippingSection />}',
  'payment={<CheckoutPaymentCondition />}',
  'review={<CheckoutReviewCondition />}',
  'summary={<CheckoutOrderSummaryPanel />}',
]) requireText(sourceClient, signature, 'production client slot composition');
for (const signature of [
  '<CheckoutFlowProvider',
  '<CheckoutPageLayout',
  'confirmation={confirmation}',
  'summary={summary}',
]) requireText(sourceSlotLayout, signature, 'production checkout slot layout');
for (const signature of [
  'useCheckoutPageState({ initialCart, initialEmail })',
  'AnalyticsEventType.CHECKOUT_COMPLETED',
  'CheckoutFlowContext.Provider',
]) requireText(sourceFlow, signature, 'production checkout flow owner');
for (const signature of [
  '<ShippingForm',
  '<ShippingMethodSelector',
  '<CheckoutPaymentStep',
  '<OrderReview',
  '<PlaceOrderButton',
  '<OrderSummary',
]) requireText(sourceRegions, signature, 'production checkout region delegate');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'templates', 'checkout');
const copiedClient = read(path.join(copiedRoot, 'CheckoutPageClient.tsx'));
const copiedState = read(path.join(copiedRoot, 'canonical', 'CheckoutPageState.tsx'));
const copiedFlow = read(path.join(copiedRoot, 'canonical', 'CheckoutFlowProvider.tsx'));
const copiedRegions = read(path.join(copiedRoot, 'canonical', 'CheckoutPageRegions.tsx'));
if (normalizeSource(sourceClient) !== normalizeSource(copiedClient)) {
  throw new Error('DnD CheckoutPageClient is not source-equivalent.');
}
for (const signature of ['!checkoutData.cart?.items?.length', 'redirect(ROUTES.CART)']) {
  requireText(copiedState, signature, 'copied checkout-state behavior');
}
for (const signature of ['useCheckoutPageState({ initialCart, initialEmail })', 'AnalyticsEventType.CHECKOUT_COMPLETED']) {
  requireText(copiedFlow, signature, 'copied checkout-flow behavior');
}
for (const signature of [
  "@/enigma-components/checkout/ShippingForm",
  "@/enigma-components/checkout/OrderReview",
  '<CheckoutPaymentStep',
  '<OrderSummary',
]) requireText(copiedRegions, signature, 'copied checkout region delegate');

const dndCanonicalRoot = path.join(dndRoot, 'components', 'checkout', 'canonical');
const dndStateView = read(path.join(dndCanonicalRoot, 'CheckoutPageStateView.tsx'));
const dndLayoutView = read(path.join(dndCanonicalRoot, 'CheckoutPageClientLayoutView.tsx'));
const dndLayout = read(path.join(dndCanonicalRoot, 'CheckoutPageClientLayout.tsx'));
for (const source of [dndStateView, dndLayoutView]) {
  requireText(source, 'puck?.isEditing', 'editor-only fixture boundary');
  requireText(source, 'checkoutPreview', 'editor fixture use');
  requireText(source, 'loadCheckoutPageRuntime', 'Puck runtime loader');
}
for (const signature of [
  '<CheckoutFlowProvider',
  '<CheckoutPageLayout',
  'shipping={shipping}',
  'summary={summary}',
]) requireText(dndLayout, signature, 'thin DnD checkout layout delegate');
if (fs.existsSync(path.join(dndRoot, 'components', 'checkout', 'CheckoutStateSectionView.tsx'))) {
  throw new Error('Legacy CheckoutStateSection replacement must be removed.');
}

const hook = read(path.join(dndRoot, 'lib', 'hooks', 'checkout', 'useCheckout.ts'));
for (const signature of ['createOrder(buildOrderPayload', 'getAvailableShippingMethods()', 'getCompletedCheckoutState']) {
  requireText(hook, signature, 'copied production checkout hook');
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as {
  components?: Array<{ type?: string; ast?: Record<string, unknown> }>;
};
const expectedManifestRoles: Array<[string, string]> = [
  ['CheckoutPageState', 'checkout-page-state'],
  ['CheckoutPageClientLayout', 'checkout-page-client-layout'],
  ['CheckoutShippingSection', 'checkout-shipping-section'],
  ['CheckoutPaymentCondition', 'checkout-payment-condition'],
  ['CheckoutReviewCondition', 'checkout-review-condition'],
  ['CheckoutOrderSummaryPanel', 'checkout-order-summary'],
];
for (const [component, role] of expectedManifestRoles) {
  const entry = manifest.components?.find((candidate) => candidate.type === component);
  if (!entry || entry.ast?.role !== role) {
    throw new Error(`Missing checkout manifest role ${role} for ${component}.`);
  }
}
if (manifest.components?.some((component) => component.type === 'CheckoutStateSection')) {
  throw new Error('Legacy CheckoutStateSection is still registered in the Puck manifest.');
}

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'checkout.json')));
const seedText = JSON.stringify(seed);
for (const type of [
  'CheckoutPageState',
  'CheckoutPageClientLayout',
  'CheckoutStepsRegion',
  'CheckoutPageHeader',
  'CheckoutErrorCondition',
  'CheckoutShippingSection',
  'CheckoutShippingForm',
  'CheckoutShippingMethodCondition',
  'CheckoutShippingMethod',
  'CheckoutPaymentCondition',
  'CheckoutPaymentStepRegion',
  'CheckoutReviewCondition',
  'CheckoutReviewSection',
  'CheckoutConfirmationCondition',
  'CheckoutOrderSummaryPanel',
]) requireText(seedText, `"type":"${type}"`, `checkout seed ${type} region`);
for (const forbidden of ['CheckoutStateSection', 'CartEmpty', 'CheckoutPaymentMethod', 'CheckoutOrderReview', 'CheckoutPlaceOrderButton', 'CheckoutSecureBadges']) {
  if (seedText.includes(forbidden)) {
    throw new Error(`Checkout seed contains legacy or replacement component: ${forbidden}`);
  }
}
const persistedProps = new Set<string>();
collectProps(seed, persistedProps);
for (const forbidden of ['state', 'cart', 'checkoutData', 'initialCart', 'initialEmail', 'previewMode']) {
  if (persistedProps.has(forbidden)) {
    throw new Error(`Checkout seed must not persist runtime or preview data: ${forbidden}`);
  }
}

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'checkout.report.json'))) as {
  warnings?: string[];
  droppedComponents?: string[];
  unmatchedHtml?: string[];
  runtimeConditionals?: Array<{ source?: string; handledBy?: string }>;
};
if ((report.warnings ?? []).length || (report.droppedComponents ?? []).length || (report.unmatchedHtml ?? []).length) {
  throw new Error(`Checkout parser diagnostics are not clean: ${JSON.stringify(report)}`);
}
for (const [source, handledBy] of [
  ['!checkoutData.cart?.items?.length => redirect(ROUTES.CART)', 'CheckoutPageState'],
  ['checkout.currentStepId === PAYMENT', 'CheckoutPaymentCondition'],
  ['checkout.currentStepId === REVIEW && Boolean(checkout.shippingAddress)', 'CheckoutReviewCondition'],
] as Array<[string, string]>) {
  if (!report.runtimeConditionals?.some((condition) => condition.source === source && condition.handledBy === handledBy)) {
    throw new Error(`Checkout diagnostics do not record ${source}.`);
  }
}

const bridge = read(path.join(dndRoot, 'app', 'checkout', 'page.tsx'));
for (const signature of ['CheckoutPageState', 'CheckoutPageClient', 'fetchCheckoutPageData()', 'initialCart={checkoutData.cart!}']) {
  requireText(bridge, signature, 'direct DnD checkout bridge');
}

console.log('Checkout source-first canonical parity checks passed.');
