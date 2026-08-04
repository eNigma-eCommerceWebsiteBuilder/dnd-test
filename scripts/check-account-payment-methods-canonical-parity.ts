import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type SeedNode = { type: string; props: Record<string, unknown> };
const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const read = (filePath: string) => fs.readFileSync(filePath, 'utf8');
const requireText = (source: string, expected: string, description: string) => { if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`); };
const requireEqual = (actual: unknown, expected: unknown, description: string) => { if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${description}. Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`); };
function slot(node: SeedNode, name: string): SeedNode[] { const value = node.props[name]; if (!Array.isArray(value)) throw new Error(`${node.type}.${name} is not a Puck slot array.`); return value as SeedNode[]; }

const route = read(path.join(templateRoot, 'app', 'account', 'payment-methods', 'page.tsx'));
for (const signature of [
  "import { PaymentMethodsPage as PaymentMethodsCanonicalPage } from '@/components/payment-methods/canonical/PaymentMethodsPage';",
  'fetchPaymentMethodsPageData()',
  '<PaymentMethodsCanonicalPage pageData={await fetchPaymentMethodsPageData()} />',
]) requireText(route, signature, 'production payment-methods route signature');

const canonicalRoot = path.join(templateRoot, 'components', 'payment-methods', 'canonical');
const canonicalPage = read(path.join(canonicalRoot, 'PaymentMethodsPage.tsx'));
const canonicalState = read(path.join(canonicalRoot, 'PaymentMethodsPageState.tsx'));
const canonicalSections = read(path.join(canonicalRoot, 'PaymentMethodsPageSections.tsx'));
const canonicalRuntime = read(path.join(canonicalRoot, 'paymentMethodsRuntime.ts'));
for (const signature of ['<PaymentMethodsPageState', '<PaymentMethodsPageLayout', '<PaymentMethodsHeaderLayout', '<PaymentMethodsAddCardAction', '<PaymentMethodsStripeConfigCondition', '<PaymentMethodsStripeCardForm', '<PaymentMethodsSavedCardsSection', '<PaymentMethodsListState', '<PaymentMethodsListRegion', '<PaymentMethodsEmptyStateRegion', '<PaymentMethodsHelpFooter']) requireText(canonicalPage, signature, 'production canonical composition');
for (const signature of [
  'return <>{content}</>;',
  'min-h-screen bg-bg-base text-text-base',
  'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12',
  'return pageData.stripeConfig ? <div className="mb-8">{content}</div> : null;',
  'return pageData.paymentMethods.length > 0 ? <>{list}</> : <>{empty}</>;',
  '<AddCardButton />',
  '<StripeCardForm stripeConfig={pageData.stripeConfig} />',
  '<PaymentMethodList paymentMethods={pageData.paymentMethods} />',
  '<EmptyPaymentMethods />',
  'Need help with your payments?',
]) requireText(`${canonicalState}\n${canonicalSections}`, signature, 'source JSX parity signature');
for (const signature of ['Promise.all([', 'getPaymentMethods()', 'getStripeConfig()', 'paymentMethods = methodsData || []', "console.error('Error fetching payment data:'"]) requireText(canonicalRuntime, signature, 'source payment runtime signature');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'payment-methods', 'canonical');
for (const file of ['PaymentMethodsPage.tsx', 'PaymentMethodsPageState.tsx', 'paymentMethodsRuntime.ts']) requireEqual(read(path.join(copiedRoot, file)).trim(), read(path.join(canonicalRoot, file)).trim(), `${file} drifted from production source`);
const copiedSections = read(path.join(copiedRoot, 'PaymentMethodsPageSections.tsx')).replaceAll('@/enigma-components/payment-methods/', '@/components/payment-methods/');
requireEqual(copiedSections.trim(), canonicalSections.trim(), 'PaymentMethodsPageSections.tsx drifted from production source');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'payment-methods', 'canonical');
const delegates = ['PaymentMethodsPageState', 'PaymentMethodsPageLayout', 'PaymentMethodsHeaderLayout', 'PaymentMethodsAddCardAction', 'PaymentMethodsStripeConfigCondition', 'PaymentMethodsStripeCardForm', 'PaymentMethodsSavedCardsSection', 'PaymentMethodsListState', 'PaymentMethodsListRegion', 'PaymentMethodsEmptyStateRegion', 'PaymentMethodsHelpFooter'];
for (const componentName of delegates) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  requireText(source, '@/enigma-components/payment-methods/canonical/', `${componentName} production delegate import`);
  requireText(source, `<${componentName}`, `${componentName} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=')) throw new Error(`${componentName}View contains replacement layout markup.`);
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> };
const roles = ['payment-methods-page-state', 'payment-methods-page-layout', 'payment-methods-header-layout', 'payment-methods-add-card-action', 'payment-methods-stripe-config-condition', 'payment-methods-stripe-card-form', 'payment-methods-saved-cards-section', 'payment-methods-list-state', 'payment-methods-list-region', 'payment-methods-empty-state-region', 'payment-methods-help-footer'];
for (const role of roles) if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Manifest is missing payment-methods role: ${role}`);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-payment-methods.json'))) as { content: SeedNode[] };
requireEqual(seed.content.map((node) => node.type), ['PaymentMethodsPageState'], 'top-level seed structure differs');
const pageLayout = slot(seed.content[0], 'content')[0]; requireEqual(pageLayout.type, 'PaymentMethodsPageLayout', 'payment-methods layout differs');
const header = slot(pageLayout, 'header')[0]; requireEqual(header.type, 'PaymentMethodsHeaderLayout', 'header layout differs'); requireEqual(slot(header, 'addCard').map((node) => node.type), ['PaymentMethodsAddCardAction'], 'add-card action differs');
const stripeCondition = slot(pageLayout, 'cardForm')[0]; requireEqual(stripeCondition.type, 'PaymentMethodsStripeConfigCondition', 'Stripe condition differs'); requireEqual(slot(stripeCondition, 'content').map((node) => node.type), ['PaymentMethodsStripeCardForm'], 'Stripe form differs');
const savedCards = slot(pageLayout, 'savedCards')[0]; requireEqual(savedCards.type, 'PaymentMethodsSavedCardsSection', 'saved-cards section differs'); const listState = slot(savedCards, 'state')[0]; requireEqual(listState.type, 'PaymentMethodsListState', 'list-state condition differs'); requireEqual(slot(listState, 'list').map((node) => node.type), ['PaymentMethodsListRegion'], 'list branch differs'); requireEqual(slot(listState, 'empty').map((node) => node.type), ['PaymentMethodsEmptyStateRegion'], 'empty branch differs');
requireEqual(slot(pageLayout, 'help').map((node) => node.type), ['PaymentMethodsHelpFooter'], 'help footer differs');
for (const forbidden of ['PageWrapper', 'PageHeader', 'SectionHeading', 'CalloutCard', 'paymentMethodsPreview']) if (JSON.stringify(seed).includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-payment-methods.report.json'))) as { warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }> };
requireEqual(report.warnings, [], 'parser report contains warnings'); requireEqual(report.droppedComponents, [], 'parser report contains dropped components'); requireEqual(report.unmatchedHtml, [], 'parser report contains unmatched HTML');
for (const owner of ['PaymentMethodsStripeConfigCondition', 'PaymentMethodsListState']) if (!report.runtimeConditionals.some((item) => item.handledBy === owner)) throw new Error(`Parser report is missing source owner: ${owner}`);

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'payment-methods', 'page.tsx')); requireText(publishedRoute, 'slug="account-payment-methods"', 'published payment-methods slug bridge');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-payment-methods-order-'));
try {
  const fixturePath = path.join(temporaryDir, 'PaymentMethodsPage.tsx'); const outputPath = path.join(temporaryDir, 'account-payment-methods.json'); const original = canonicalPage.replace(/\r\n/g, '\n');
  const before = '                  list={<PaymentMethodsListRegion pageData={pageData} />}\n                  empty={<PaymentMethodsEmptyStateRegion />}';
  const after = '                  list={<PaymentMethodsEmptyStateRegion />}\n                  empty={<PaymentMethodsListRegion pageData={pageData} />}';
  if (!original.includes(before)) throw new Error('Unable to create remapped payment-methods parser fixture.'); fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  let rejected = false;
  try {
    childProcess.execSync(`npx tsx ast-parser.ts "app/account/payment-methods/page.tsx" "${outputPath}"`, { cwd: templateRoot, env: { ...process.env, PAYMENT_METHODS_CANONICAL_SOURCE: fixturePath }, stdio: 'pipe', shell: process.platform === 'win32' ? process.env.ComSpec : undefined });
  } catch {
    rejected = true;
  }
  const rejectedReport = JSON.parse(read(path.join(temporaryDir, '_reports', 'account-payment-methods.report.json'))) as { fatal: boolean; errors: string[] };
  if (!rejected || fs.existsSync(outputPath) || !rejectedReport.fatal || rejectedReport.errors.length === 0) throw new Error('Parser did not reject an invalid cross-slot payment-methods composition.');
} finally { fs.rmSync(temporaryDir, { recursive: true, force: true }); }

console.log('Account payment-methods source-first canonical parity checks passed.');
