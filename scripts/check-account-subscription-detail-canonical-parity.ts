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

const route = read(path.join(templateRoot, 'app', 'account', 'subscriptions', '[id]', 'page.tsx'));
for (const signature of [
  "import { SubscriptionDetailsPage } from '@/components/subscriptions/canonical/SubscriptionDetailsPage';",
  'fetchSubscriptionDetailsPageData(id)',
  '<SubscriptionDetailsPage',
  'pageData={{ billingHistory, details, orders }}',
]) {
  requireText(route, signature, 'production subscription-detail route signature');
}

const canonicalRoot = path.join(templateRoot, 'components', 'subscriptions', 'canonical');
const canonicalPage = read(path.join(canonicalRoot, 'SubscriptionDetailsPage.tsx'));
const canonicalState = read(path.join(canonicalRoot, 'SubscriptionDetailsPageState.tsx'));
const canonicalSections = read(path.join(canonicalRoot, 'SubscriptionDetailsPageSections.tsx'));
const canonicalRuntime = read(path.join(canonicalRoot, 'subscriptionDetailsRuntime.ts'));

for (const signature of [
  '<SubscriptionDetailsPageState',
  '<SubscriptionDetailsPageLayout',
  '<SubscriptionDetailsBreadcrumbs',
  '<SubscriptionDetailHeaderRegion',
  '<SubscriptionDetailContentLayout',
  '<SubscriptionItemsPanel',
  '<SubscriptionModifyPanel',
  '<SubscriptionOrdersPanel',
  '<SubscriptionNextDeliveryRegion',
  '<SubscriptionUpcomingAmountRegion',
  '<SubscriptionLifecycleActionsPanel',
  '<SubscriptionBillingHistoryPanel',
  '<SubscriptionPaymentPanel',
]) {
  requireText(canonicalPage, signature, 'production canonical composition');
}

for (const signature of [
  '!pageData?.details?.subscription',
  'notFound()',
]) {
  requireText(canonicalState, signature, 'source-owned not-found condition');
}

for (const signature of [
  'min-h-screen bg-bg-base text-text-base',
  'max-w-[1440px]',
  'lg:grid-cols-12',
  'lg:col-span-7',
  'lg:col-span-5',
  '<SubscriptionItems subscription={subscription} />',
  '<ModifySubscriptionButton subscription={subscription} />',
  '<SubscriptionOrdersList',
  '<NextDeliveryCard subscription={subscription} />',
  '<UpcomingAmountCard upcomingBilling={upcomingBilling} />',
  '{showPause ? pause : null}',
  '{showResume ? resume : null}',
  '{showSkip ? skip : null}',
  '{showCancel ? cancel : null}',
  '<FailedPaymentAlert attempts={attempts} />',
  'showHeader={false}',
  '<UpdatePaymentButton subscriptionId={subscriptionId} />',
  '<BillingPortalButton returnUrl="/account/subscriptions" />',
]) {
  requireText(canonicalSections, signature, 'production JSX parity signature');
}

for (const signature of [
  'getSubscriptionDetails(id)',
  'getSubscriptionOrders(id, 1, 10)',
  'getBillingHistory(id, 1, 10)',
  'const canModify = canModifySubscription(subscription)',
  'showPause: canModify && isActive',
  'showResume: canModify && isPaused',
]) {
  requireText(canonicalRuntime, signature, 'production runtime/action contract');
}

const copiedRoot = path.join(dndRoot, 'enigma-components', 'subscriptions', 'canonical');
for (const file of ['SubscriptionDetailsPage.tsx', 'SubscriptionDetailsPageState.tsx', 'subscriptionDetailsRuntime.ts']) {
  requireEqual(read(path.join(copiedRoot, file)).trim(), read(path.join(canonicalRoot, file)).trim(), `${file} drifted from production source`);
}
const copiedSections = read(path.join(copiedRoot, 'SubscriptionDetailsPageSections.tsx')
).replaceAll('@/enigma-components/subscriptions/', '@/components/subscriptions/');
requireEqual(copiedSections.trim(), canonicalSections.trim(), 'SubscriptionDetailsPageSections.tsx drifted from production source');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'subscriptions', 'canonical');
const delegates: Array<[string, string, string]> = [
  ['SubscriptionDetailsPageStateView.tsx', 'SubscriptionDetailsPageState', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageState'],
  ['SubscriptionDetailsPageLayoutView.tsx', 'SubscriptionDetailsPageLayout', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionDetailsBreadcrumbsView.tsx', 'SubscriptionDetailsBreadcrumbs', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionDetailHeaderRegionView.tsx', 'SubscriptionDetailHeaderRegion', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionDetailContentLayoutView.tsx', 'SubscriptionDetailContentLayout', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionItemsPanelView.tsx', 'SubscriptionItemsPanel', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionModifyPanelView.tsx', 'SubscriptionModifyPanel', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionOrdersPanelView.tsx', 'SubscriptionOrdersPanel', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionNextDeliveryRegionView.tsx', 'SubscriptionNextDeliveryRegion', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionUpcomingAmountRegionView.tsx', 'SubscriptionUpcomingAmountRegion', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionLifecycleActionsPanelView.tsx', 'SubscriptionLifecycleActionsPanel', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionPauseActionView.tsx', 'SubscriptionPauseAction', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionResumeActionView.tsx', 'SubscriptionResumeAction', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionSkipDeliveryActionView.tsx', 'SubscriptionSkipDeliveryAction', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionCancelActionView.tsx', 'SubscriptionCancelAction', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionBillingHistoryPanelView.tsx', 'SubscriptionBillingHistoryPanel', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionFailedPaymentAlertView.tsx', 'SubscriptionFailedPaymentAlert', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionBillingHistoryView.tsx', 'SubscriptionBillingHistory', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionPaymentPanelView.tsx', 'SubscriptionPaymentPanel', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionUpdatePaymentActionView.tsx', 'SubscriptionUpdatePaymentAction', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  ['SubscriptionBillingPortalActionView.tsx', 'SubscriptionBillingPortalAction', '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections'],
];
for (const [file, componentName, importPath] of delegates) {
  const source = read(path.join(adapterRoot, file));
  requireText(source, importPath, `${file} production delegate import`);
  requireText(source, `<${componentName}`, `${file} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=')) {
    throw new Error(`${file} contains replacement layout markup instead of a thin adapter.`);
  }
}

for (const file of ['SubscriptionDetailsPageStateView.tsx', 'SubscriptionDetailsPageLayoutView.tsx', 'SubscriptionDetailContentLayoutView.tsx', 'SubscriptionLifecycleActionsPanelView.tsx', 'SubscriptionBillingHistoryPanelView.tsx', 'SubscriptionPaymentPanelView.tsx']) {
  const source = read(path.join(adapterRoot, file));
  requireText(source, 'puckTransparentSlotProps', `${file} transparent slot rendering`);
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as {
  components: Array<{ type: string; ast?: { role?: string } }>;
};
const expectedRoles = [
  'subscription-details-page-state', 'subscription-details-page-layout', 'subscription-details-breadcrumbs',
  'subscription-details-header', 'subscription-details-content-layout', 'subscription-details-items-panel',
  'subscription-details-modify-panel', 'subscription-details-orders-panel', 'subscription-details-next-delivery',
  'subscription-details-upcoming-amount', 'subscription-details-lifecycle-actions', 'subscription-details-pause-action',
  'subscription-details-resume-action', 'subscription-details-skip-action', 'subscription-details-cancel-action',
  'subscription-details-billing-history-panel', 'subscription-details-failed-payment-alert',
  'subscription-details-billing-history', 'subscription-details-payment-panel',
  'subscription-details-update-payment', 'subscription-details-billing-portal',
];
for (const role of expectedRoles) {
  if (!manifest.components.some((component) => component.ast?.role === role)) {
    throw new Error(`Puck AST manifest is missing subscription-detail role: ${role}`);
  }
}
if (manifest.components.some((component) => component.type === 'SubscriptionDetailStateSection')) {
  throw new Error('Legacy SubscriptionDetailStateSection remains in the Puck manifest.');
}
if (fs.existsSync(path.join(dndRoot, 'components', 'account', 'SubscriptionDetailStateSectionView.tsx'))) {
  throw new Error('Legacy SubscriptionDetailStateSectionView.tsx remains in the DnD component tree.');
}

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-subscription-detail.json'))) as { content: SeedNode[] };
requireEqual(seed.content.map((node) => node.type), ['SubscriptionDetailsPageState'], 'top-level seed structure differs');
const state = seed.content[0];
const layout = slot(state, 'content')[0];
requireEqual(layout.type, 'SubscriptionDetailsPageLayout', 'state content does not contain the canonical layout');
requireEqual(slot(layout, 'breadcrumbs').map((node) => node.type), ['SubscriptionDetailsBreadcrumbs'], 'breadcrumbs slot differs');
requireEqual(slot(layout, 'header').map((node) => node.type), ['SubscriptionDetailHeaderRegion'], 'header slot differs');
const content = slot(layout, 'content')[0];
requireEqual(content.type, 'SubscriptionDetailContentLayout', 'layout content is not the canonical two-column layout');
requireEqual(slot(content, 'primary').map((node) => node.type), ['SubscriptionItemsPanel', 'SubscriptionModifyPanel', 'SubscriptionOrdersPanel'], 'primary source order differs');
requireEqual(slot(content, 'sidebar').map((node) => node.type), ['SubscriptionNextDeliveryRegion', 'SubscriptionUpcomingAmountRegion', 'SubscriptionLifecycleActionsPanel', 'SubscriptionBillingHistoryPanel', 'SubscriptionPaymentPanel'], 'sidebar source order differs');
const lifecycle = slot(content, 'sidebar')[2];
requireEqual(slot(lifecycle, 'pause').map((node) => node.type), ['SubscriptionPauseAction'], 'pause action slot differs');
requireEqual(slot(lifecycle, 'resume').map((node) => node.type), ['SubscriptionResumeAction'], 'resume action slot differs');
requireEqual(slot(lifecycle, 'skip').map((node) => node.type), ['SubscriptionSkipDeliveryAction'], 'skip action slot differs');
requireEqual(slot(lifecycle, 'cancel').map((node) => node.type), ['SubscriptionCancelAction'], 'cancel action slot differs');

const serializedSeed = JSON.stringify(seed);
for (const forbidden of ['SubscriptionDetailStateSection', 'pageData', 'subscriptionId', 'preview']) {
  if (serializedSeed.includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);
}

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-subscription-detail.report.json'))) as {
  warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }>;
};
requireEqual(report.warnings, [], 'parser report contains warnings');
requireEqual(report.droppedComponents, [], 'parser report contains dropped components');
requireEqual(report.unmatchedHtml, [], 'parser report contains unmatched HTML');
for (const owner of [
  'SubscriptionDetailsPageState',
  'SubscriptionLifecycleActionsPanel',
  'SubscriptionFailedPaymentAlert',
]) {
  if (!report.runtimeConditionals.some((condition) => condition.handledBy === owner)) {
    throw new Error(`Parser report is missing source owner: ${owner}`);
  }
}

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'subscriptions', '[id]', 'page.tsx'));
requireText(publishedRoute, 'slug="account-subscription-detail"', 'published subscription-detail slug bridge');
requireText(publishedRoute, "routeParams={{ slug: 'account-subscription-detail', id }}", 'published subscription-detail id metadata bridge');

// The parser must read source siblings rather than emit a fixed manual order.
const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-subscription-detail-order-'));
try {
  const fixturePath = path.join(temporaryDir, 'SubscriptionDetailsPage.tsx');
  const outputPath = path.join(temporaryDir, 'account-subscription-detail.json');
  const original = canonicalPage.replace(/\r\n/g, '\n');
  const before = '                  <SubscriptionItemsPanel subscription={subscription} />\n                  <SubscriptionModifyPanel subscription={subscription} />';
  const after = '                  <SubscriptionModifyPanel subscription={subscription} />\n                  <SubscriptionItemsPanel subscription={subscription} />';
  if (!original.includes(before)) throw new Error('Unable to create reordered subscription-detail parser fixture.');
  fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  const parserCommand = `npx tsx ast-parser.ts "app/account/subscriptions/[id]/page.tsx" "${outputPath}"`;
  childProcess.execSync(parserCommand, {
    cwd: templateRoot,
    env: { ...process.env, SUBSCRIPTION_DETAILS_CANONICAL_SOURCE: fixturePath },
    stdio: 'pipe',
    shell: process.platform === 'win32' ? process.env.ComSpec : undefined,
  });
  const reordered = JSON.parse(read(outputPath)) as { content: SeedNode[] };
  const reorderedLayout = slot(reordered.content[0], 'content')[0];
  const reorderedContent = slot(reorderedLayout, 'content')[0];
  requireEqual(slot(reorderedContent, 'primary').map((node) => node.type), ['SubscriptionModifyPanel', 'SubscriptionItemsPanel', 'SubscriptionOrdersPanel'], 'parser did not retain reordered source siblings');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

console.log('Account subscription-detail source-first canonical parity checks passed.');
