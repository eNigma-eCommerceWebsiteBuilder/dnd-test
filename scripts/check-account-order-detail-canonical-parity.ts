import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type SeedNode = { type: string; props: Record<string, unknown> };

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');

function read(filePath: string): string {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireText(source: string, expected: string, description: string): void {
  if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`);
}

function requireEqual(actual: unknown, expected: unknown, description: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${description}. Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}

function slot(node: SeedNode, name: string): SeedNode[] {
  const value = node.props[name];
  if (!Array.isArray(value)) throw new Error(`${node.type}.${name} is not a Puck slot array.`);
  return value as SeedNode[];
}

const route = read(path.join(templateRoot, 'app', 'account', 'orders', '[id]', 'page.tsx'));
for (const signature of [
  "import { OrderDetailsPage } from '@/components/orders/canonical/OrderDetailsPage';",
  'fetchOrderDetails(id)',
  '<OrderDetailsPage order={order} />',
]) {
  requireText(route, signature, 'production order-detail route signature');
}

const canonicalRoot = path.join(templateRoot, 'components', 'orders', 'canonical');
const canonicalPage = read(path.join(canonicalRoot, 'OrderDetailsPage.tsx'));
const canonicalState = read(path.join(canonicalRoot, 'OrderDetailsPageState.tsx'));
const canonicalSections = read(path.join(canonicalRoot, 'OrderDetailsPageSections.tsx'));
const canonicalRuntime = read(path.join(canonicalRoot, 'orderDetailsRuntime.ts'));

for (const signature of [
  '<OrderDetailsPageState', '<OrderDetailsPageLayout', '<OrderDetailsBreadcrumbs', '<OrderDetailsHeader',
  '<OrderDetailsDownloadAction', '<OrderDetailsReorderAction', '<OrderDetailsCancelAction',
  '<OrderDetailsContentLayout', '<OrderDetailsItemsRegion', '<OrderDetailsFinancialRegion',
  '<OrderDetailsShippingRegion', '<OrderDetailsBillingAddressCondition', '<OrderDetailsBillingRegion',
  '<OrderDetailsPaymentRegion',
]) {
  requireText(canonicalPage, signature, 'production canonical composition');
}
for (const signature of ['if (!order) notFound()', 'min-h-screen bg-bg-base text-text-base', 'max-w-[1440px]', 'lg:grid-cols-12', 'lg:col-span-7', 'lg:col-span-5', 'const orderHasDigitalItems = hasDigitalItems(order)', 'const orderCanBeCancelled = canCancelOrder(order)', '{orderHasDigitalItems ? downloads : null}', '{orderCanBeCancelled ? cancel : null}', 'return billingAddress ? <>{content}</> : null', '<ReorderButton items={items} />', '<OrderItemList items={items} />', '<PaymentInfo order={order} />']) {
  requireText(`${canonicalState}\n${canonicalSections}`, signature, 'source JSX parity signature');
}
requireText(canonicalRuntime, 'return getOrder(id)', 'source order data contract');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'orders', 'canonical');
for (const file of ['OrderDetailsPage.tsx', 'OrderDetailsPageState.tsx', 'orderDetailsRuntime.ts']) {
  requireEqual(read(path.join(copiedRoot, file)).trim(), read(path.join(canonicalRoot, file)).trim(), `${file} drifted from production source`);
}
const copiedSections = read(path.join(copiedRoot, 'OrderDetailsPageSections.tsx')
).replaceAll('@/enigma-components/orders/', '@/components/orders/');
requireEqual(copiedSections.trim(), canonicalSections.trim(), 'OrderDetailsPageSections.tsx drifted from production source');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'orders', 'detail', 'canonical');
const delegates: Array<[string, string]> = [
  ['OrderDetailsPageStateView.tsx', 'OrderDetailsPageState'], ['OrderDetailsPageLayoutView.tsx', 'OrderDetailsPageLayout'],
  ['OrderDetailsBreadcrumbsView.tsx', 'OrderDetailsBreadcrumbs'], ['OrderDetailsHeaderView.tsx', 'OrderDetailsHeader'],
  ['OrderDetailsDownloadActionView.tsx', 'OrderDetailsDownloadAction'], ['OrderDetailsReorderActionView.tsx', 'OrderDetailsReorderAction'],
  ['OrderDetailsCancelActionView.tsx', 'OrderDetailsCancelAction'], ['OrderDetailsContentLayoutView.tsx', 'OrderDetailsContentLayout'],
  ['OrderDetailsItemsRegionView.tsx', 'OrderDetailsItemsRegion'], ['OrderDetailsFinancialRegionView.tsx', 'OrderDetailsFinancialRegion'],
  ['OrderDetailsShippingRegionView.tsx', 'OrderDetailsShippingRegion'], ['OrderDetailsBillingAddressConditionView.tsx', 'OrderDetailsBillingAddressCondition'],
  ['OrderDetailsBillingRegionView.tsx', 'OrderDetailsBillingRegion'], ['OrderDetailsPaymentRegionView.tsx', 'OrderDetailsPaymentRegion'],
];
for (const [file, componentName] of delegates) {
  const source = read(path.join(adapterRoot, file));
  requireText(source, `@/enigma-components/orders/canonical/`, `${file} production delegate import`);
  requireText(source, `<${componentName}`, `${file} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=')) {
    throw new Error(`${file} contains replacement layout markup instead of a thin adapter.`);
  }
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as {
  components: Array<{ type: string; ast?: { role?: string } }>;
};
const expectedRoles = [
  'order-details-page-state', 'order-details-page-layout', 'order-details-breadcrumbs', 'order-details-header',
  'order-details-download-action', 'order-details-reorder-action', 'order-details-cancel-action', 'order-details-content-layout',
  'order-details-items-region', 'order-details-financial-region', 'order-details-shipping-region',
  'order-details-billing-condition', 'order-details-billing-region', 'order-details-payment-region',
];
for (const role of expectedRoles) {
  if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Puck AST manifest is missing order-detail role: ${role}`);
}

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-order-detail.json'))) as { content: SeedNode[] };
requireEqual(seed.content.map((node) => node.type), ['OrderDetailsPageState'], 'top-level seed structure differs');
const layout = slot(seed.content[0], 'content')[0];
requireEqual(layout.type, 'OrderDetailsPageLayout', 'state content does not contain the canonical layout');
requireEqual(slot(layout, 'breadcrumbs').map((node) => node.type), ['OrderDetailsBreadcrumbs'], 'breadcrumbs slot differs');
const header = slot(layout, 'header')[0];
requireEqual(header.type, 'OrderDetailsHeader', 'header slot differs');
requireEqual(slot(header, 'downloads').map((node) => node.type), ['OrderDetailsDownloadAction'], 'download action slot differs');
requireEqual(slot(header, 'reorder').map((node) => node.type), ['OrderDetailsReorderAction'], 'reorder action slot differs');
requireEqual(slot(header, 'cancel').map((node) => node.type), ['OrderDetailsCancelAction'], 'cancel action slot differs');
const content = slot(layout, 'content')[0];
requireEqual(content.type, 'OrderDetailsContentLayout', 'layout content is not the canonical two-column layout');
requireEqual(slot(content, 'primary').map((node) => node.type), ['OrderDetailsItemsRegion', 'OrderDetailsFinancialRegion'], 'primary source order differs');
requireEqual(slot(content, 'sidebar').map((node) => node.type), ['OrderDetailsShippingRegion', 'OrderDetailsBillingAddressCondition', 'OrderDetailsPaymentRegion'], 'sidebar source order differs');
requireEqual(slot(slot(content, 'sidebar')[1], 'content').map((node) => node.type), ['OrderDetailsBillingRegion'], 'billing condition content differs');

const serializedSeed = JSON.stringify(seed);
for (const forbidden of ['PageWrapper', 'TwoColumnDetail', 'OrderStatusBadge', 'preview', 'orderId']) {
  if (serializedSeed.includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);
}

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-order-detail.report.json'))) as {
  warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }>;
};
requireEqual(report.warnings, [], 'parser report contains warnings');
requireEqual(report.droppedComponents, [], 'parser report contains dropped components');
requireEqual(report.unmatchedHtml, [], 'parser report contains unmatched HTML');
for (const owner of ['OrderDetailsPageState', 'OrderDetailsHeader', 'OrderDetailsBillingAddressCondition']) {
  if (!report.runtimeConditionals.some((condition) => condition.handledBy === owner)) {
    throw new Error(`Parser report is missing source owner: ${owner}`);
  }
}

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'orders', '[id]', 'page.tsx'));
requireText(publishedRoute, 'slug="account-order-detail"', 'published order-detail slug bridge');
requireText(publishedRoute, "routeParams={{ slug: 'account-order-detail', id }}", 'published order-detail id metadata bridge');

// The parser must read source siblings rather than emit a fixed manual order.
const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-order-detail-order-'));
try {
  const fixturePath = path.join(temporaryDir, 'OrderDetailsPage.tsx');
  const outputPath = path.join(temporaryDir, 'account-order-detail.json');
  const original = canonicalPage.replace(/\r\n/g, '\n');
  const before = '                  <OrderDetailsItemsRegion items={order.items} />\n                  <OrderDetailsFinancialRegion order={order} />';
  const after = '                  <OrderDetailsFinancialRegion order={order} />\n                  <OrderDetailsItemsRegion items={order.items} />';
  if (!original.includes(before)) throw new Error('Unable to create reordered order-detail parser fixture.');
  fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  childProcess.execSync(`npx tsx ast-parser.ts "app/account/orders/[id]/page.tsx" "${outputPath}"`, {
    cwd: templateRoot,
    env: { ...process.env, ORDER_DETAILS_CANONICAL_SOURCE: fixturePath },
    stdio: 'pipe',
    shell: process.platform === 'win32' ? process.env.ComSpec : undefined,
  });
  const reordered = JSON.parse(read(outputPath)) as { content: SeedNode[] };
  const reorderedContent = slot(slot(reordered.content[0], 'content')[0], 'content')[0];
  requireEqual(slot(reorderedContent, 'primary').map((node) => node.type), ['OrderDetailsFinancialRegion', 'OrderDetailsItemsRegion'], 'parser did not retain reordered source siblings');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

console.log('Account order-detail source-first canonical parity checks passed.');
