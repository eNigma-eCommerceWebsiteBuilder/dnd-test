import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type SeedNode = { type: string; props: Record<string, unknown> };

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const read = (filePath: string) => fs.readFileSync(filePath, 'utf8');
const requireText = (source: string, expected: string, description: string) => {
  if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`);
};
const requireEqual = (actual: unknown, expected: unknown, description: string) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${description}. Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
};
function slot(node: SeedNode, name: string): SeedNode[] {
  const value = node.props[name];
  if (!Array.isArray(value)) throw new Error(`${node.type}.${name} is not a Puck slot array.`);
  return value as SeedNode[];
}

const route = read(path.join(templateRoot, 'app', 'account', 'orders', '[id]', 'return', 'page.tsx'));
for (const signature of [
  "import { OrderReturnPage } from '@/components/returns/canonical/OrderReturnPage';",
  'fetchOrderReturnPageData(id)',
  '<OrderReturnPage pageData={await fetchOrderReturnPageData(id)} />',
]) requireText(route, signature, 'production order-return route signature');

const canonicalRoot = path.join(templateRoot, 'components', 'returns', 'canonical');
const canonicalPage = read(path.join(canonicalRoot, 'OrderReturnPage.tsx'));
const canonicalState = read(path.join(canonicalRoot, 'OrderReturnPageState.tsx'));
const canonicalSections = read(path.join(canonicalRoot, 'OrderReturnPageSections.tsx'));
const canonicalRuntime = read(path.join(canonicalRoot, 'orderReturnRuntime.ts'));
for (const signature of [
  '<OrderReturnPageState',
  '<OrderReturnPageLayout',
  '<OrderReturnBreadcrumbs',
  '<OrderReturnHeader',
  '<OrderReturnEligibilityState',
  '<OrderReturnWindowExpiredRegion',
  '<OrderReturnNotEligibleRegion',
  '<OrderReturnEligibleLayout',
  '<OrderReturnRequestFormRegion',
  '<OrderReturnPolicyReminderRegion',
]) requireText(canonicalPage, signature, 'production canonical composition');
for (const signature of [
  'if (!pageData?.order) notFound()',
  'min-h-screen bg-bg-base text-text-base',
  'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12',
  'if (pageData.isWindowExpired) return <>{expired}</>;',
  'if (!pageData.eligibility.valid) return <>{ineligible}</>;',
  '<ReturnWindowExpired',
  '<NotEligibleMessage',
  '<ReturnRequestForm order={pageData.order} />',
  '<ReturnPolicyReminder />',
]) requireText(`${canonicalState}\n${canonicalSections}`, signature, 'source JSX parity signature');
for (const signature of [
  'RETURNS.WINDOW_DAYS',
  'calculateReturnDeadline(orderDate, returnWindowDays)',
  'validateReturnEligibility(order, itemsForValidation, returnWindowDays)',
  'new Date() > deadline',
]) requireText(canonicalRuntime, signature, 'source order-return runtime signature');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'returns', 'order-return-canonical');
for (const file of ['OrderReturnPage.tsx', 'OrderReturnPageState.tsx', 'orderReturnRuntime.ts']) {
  requireEqual(read(path.join(copiedRoot, file)).trim(), read(path.join(canonicalRoot, file)).trim(), `${file} drifted from production source`);
}
const copiedSections = read(path.join(copiedRoot, 'OrderReturnPageSections.tsx')).replaceAll('@/enigma-components/returns/', '@/components/returns/');
requireEqual(copiedSections.trim(), canonicalSections.trim(), 'OrderReturnPageSections.tsx drifted from production source');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'orders', 'return', 'canonical');
const delegates = [
  'OrderReturnPageState', 'OrderReturnPageLayout', 'OrderReturnBreadcrumbs',
  'OrderReturnHeader', 'OrderReturnEligibilityState', 'OrderReturnWindowExpiredRegion',
  'OrderReturnNotEligibleRegion', 'OrderReturnEligibleLayout', 'OrderReturnRequestFormRegion',
  'OrderReturnPolicyReminderRegion',
];
for (const componentName of delegates) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  requireText(source, '@/enigma-components/returns/order-return-canonical/', `${componentName} production delegate import`);
  requireText(source, `<${componentName}`, `${componentName} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=')) {
    throw new Error(`${componentName}View contains replacement layout markup.`);
  }
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> };
const roles = [
  'order-return-page-state', 'order-return-page-layout', 'order-return-breadcrumbs',
  'order-return-header', 'order-return-eligibility-state', 'order-return-window-expired',
  'order-return-not-eligible', 'order-return-eligible-layout', 'order-return-request-form',
  'order-return-policy-reminder',
];
for (const role of roles) {
  if (!manifest.components.some((component) => component.ast?.role === role)) {
    throw new Error(`Manifest is missing order-return role: ${role}`);
  }
}

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-order-return.json'))) as { content: SeedNode[] };
requireEqual(seed.content.map((node) => node.type), ['OrderReturnPageState'], 'top-level seed structure differs');
const state = seed.content[0];
const layout = slot(state, 'content')[0];
requireEqual(layout.type, 'OrderReturnPageLayout', 'content branch layout differs');
requireEqual(slot(layout, 'breadcrumbs').map((node) => node.type), ['OrderReturnBreadcrumbs'], 'breadcrumbs slot differs');
requireEqual(slot(layout, 'header').map((node) => node.type), ['OrderReturnHeader'], 'header slot differs');
const eligibility = slot(layout, 'state')[0];
requireEqual(eligibility.type, 'OrderReturnEligibilityState', 'eligibility state differs');
requireEqual(slot(eligibility, 'expired').map((node) => node.type), ['OrderReturnWindowExpiredRegion'], 'expired branch differs');
requireEqual(slot(eligibility, 'ineligible').map((node) => node.type), ['OrderReturnNotEligibleRegion'], 'ineligible branch differs');
const eligible = slot(eligibility, 'eligible')[0];
requireEqual(eligible.type, 'OrderReturnEligibleLayout', 'eligible branch layout differs');
requireEqual(slot(eligible, 'form').map((node) => node.type), ['OrderReturnRequestFormRegion'], 'request form slot differs');
requireEqual(slot(eligible, 'policy').map((node) => node.type), ['OrderReturnPolicyReminderRegion'], 'policy slot differs');
for (const forbidden of ['PageWrapper', 'OrderReturnStateSection', 'orderReturnPreview', 'orderId']) {
  if (JSON.stringify(seed).includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);
}

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-order-return.report.json'))) as {
  warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }>;
};
requireEqual(report.warnings, [], 'parser report contains warnings');
requireEqual(report.droppedComponents, [], 'parser report contains dropped components');
requireEqual(report.unmatchedHtml, [], 'parser report contains unmatched HTML');
for (const owner of ['OrderReturnPageState', 'OrderReturnEligibilityState']) {
  if (!report.runtimeConditionals.some((condition) => condition.handledBy === owner)) {
    throw new Error(`Parser report is missing source owner: ${owner}`);
  }
}

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'orders', '[id]', 'return', 'page.tsx'));
requireText(publishedRoute, 'slug="account-order-return"', 'published order-return slug bridge');
requireText(publishedRoute, "routeParams={{ slug: 'account-order-return', id }}", 'published order-return id metadata bridge');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-order-return-order-'));
try {
  const fixturePath = path.join(temporaryDir, 'OrderReturnPage.tsx');
  const outputPath = path.join(temporaryDir, 'account-order-return.json');
  const original = canonicalPage.replace(/\r\n/g, '\n');
  const before = '                  form={<OrderReturnRequestFormRegion pageData={pageData} />}\n                  policy={<OrderReturnPolicyReminderRegion />}';
  const after = '                  form={<OrderReturnPolicyReminderRegion />}\n                  policy={<OrderReturnRequestFormRegion pageData={pageData} />}';
  if (!original.includes(before)) throw new Error('Unable to create reordered order-return parser fixture.');
  fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  let rejected = false;
  try {
    childProcess.execSync(`npx tsx ast-parser.ts "app/account/orders/[id]/return/page.tsx" "${outputPath}"`, {
      cwd: templateRoot,
      env: { ...process.env, ORDER_RETURN_CANONICAL_SOURCE: fixturePath },
      stdio: 'pipe',
      shell: process.platform === 'win32' ? process.env.ComSpec : undefined,
    });
  } catch {
    rejected = true;
  }
  const rejectedReport = JSON.parse(read(path.join(temporaryDir, '_reports', 'account-order-return.report.json'))) as { fatal: boolean; errors: string[] };
  if (!rejected || fs.existsSync(outputPath) || !rejectedReport.fatal || rejectedReport.errors.length === 0) {
    throw new Error('Parser did not reject an invalid cross-slot order-return composition.');
  }
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

console.log('Account order-return source-first canonical parity checks passed.');
