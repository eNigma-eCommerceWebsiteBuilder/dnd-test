import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type SeedNode = { type: string; props: Record<string, unknown> };
const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const read = (filePath: string) => fs.readFileSync(filePath, 'utf8');
const text = (source: string, expected: string, description: string) => { if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`); };
const normalize = (value: string) => value.replace(/\r\n/g, '\n');
const equal = (actual: string, expected: string, description: string) => { if (normalize(actual).trim() !== normalize(expected).trim()) throw new Error(`${description} drifted from production source.`); };
function slot(node: SeedNode, name: string): SeedNode[] { const value = node.props[name]; if (!Array.isArray(value)) throw new Error(`${node.type}.${name} is not a Puck slot array.`); return value as SeedNode[]; }
function containsType(nodes: SeedNode[], type: string): boolean { return nodes.some((node) => node.type === type || Object.values(node.props).some((value) => Array.isArray(value) && containsType(value as SeedNode[], type))); }

const route = read(path.join(templateRoot, 'app', 'account', 'subscriptions', 'page.tsx'));
for (const signature of ["import { SubscriptionsPage } from '@/components/subscriptions/canonical/SubscriptionsPage';", 'fetchSubscriptionsPageData()', '<SubscriptionsPage data={await fetchSubscriptionsPageData()} />']) text(route, signature, 'production account-subscriptions route signature');

const sourceRoot = path.join(templateRoot, 'components', 'subscriptions');
const canonicalRoot = path.join(sourceRoot, 'canonical');
const sourcePage = read(path.join(canonicalRoot, 'SubscriptionsPage.tsx'));
const sourceSections = read(path.join(canonicalRoot, 'SubscriptionsPageSections.tsx'));
const sourceRuntime = read(path.join(canonicalRoot, 'subscriptionsPageRuntime.ts'));
const sourceList = read(path.join(sourceRoot, 'SubscriptionList.tsx'));
for (const signature of ['<AccountSubscriptionsPageLayout', '<AccountSubscriptionsPageHeader />', '<SubscriptionList data={data} />', '<SubscriptionsListLayout', '<SubscriptionsListState', '<SubscriptionsListClientRegion', '<SubscriptionsCardsList', '<SubscriptionsEmptyRegion']) text(`${sourcePage}\n${sourceList}`, signature, 'production canonical composition');
for (const signature of ['min-h-screen bg-bg-base text-text-base', 'max-w-[1440px]', 'Manage your active and past subscriptions.', 'return hasSubscriptions ? subscriptions : empty;', 'subscriptions.map((subscription) => (', '<SubscriptionCardSlot', '<SubscriptionCard', '<SubscriptionsEmpty']) text(sourceSections, signature, 'production source JSX region');
for (const signature of ['return await getMySubscriptions();', "console.error('Error fetching subscriptions:', error)", 'throw error;']) text(sourceRuntime, signature, 'production subscriptions runtime contract');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'subscriptions', 'canonical');
equal(read(path.join(copiedRoot, 'subscriptionsPageRuntime.ts')), sourceRuntime, 'subscriptionsPageRuntime.ts');
equal(read(path.join(copiedRoot, 'SubscriptionsPageSections.tsx')).replaceAll('@/enigma-components/subscriptions/', '@/components/subscriptions/'), sourceSections, 'SubscriptionsPageSections.tsx');
equal(read(path.join(copiedRoot, 'SubscriptionsPage.tsx')).replaceAll('@/enigma-components/subscriptions/', '@/components/subscriptions/'), sourcePage, 'SubscriptionsPage.tsx');
equal(read(path.join(dndRoot, 'enigma-components', 'subscriptions', 'SubscriptionList.tsx')).replaceAll('@/enigma-components/subscriptions/canonical/', '@/components/subscriptions/canonical/'), sourceList, 'SubscriptionList.tsx');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'subscriptions', 'list', 'canonical');
const delegates = ['AccountSubscriptionsPageLayout', 'AccountSubscriptionsPageHeader', 'SubscriptionsListLayout', 'SubscriptionsListState', 'SubscriptionsListClientRegion', 'SubscriptionsCardsList', 'SubscriptionsEmptyRegion'];
for (const componentName of delegates) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  text(source, '@/enigma-components/subscriptions/canonical/', `${componentName} production delegate import`);
  text(source, `<${componentName}`, `${componentName} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=') || source.includes('<div className=')) throw new Error(`${componentName}View contains replacement layout markup.`);
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> };
const roles = ['account-subscriptions-page-layout', 'account-subscriptions-page-header', 'subscriptions-list-layout', 'subscriptions-list-state', 'subscriptions-list-client-region', 'subscriptions-cards-list', 'subscriptions-empty-region'];
for (const role of roles) if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Manifest is missing account-subscriptions role: ${role}`);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-subscriptions.json'))) as { content: SeedNode[] };
if (seed.content.map((node) => node.type).join() !== 'AccountSubscriptionsPageLayout') throw new Error('Top-level account-subscriptions seed differs.');
const page = seed.content[0];
if (slot(page, 'header')[0]?.type !== 'AccountSubscriptionsPageHeader') throw new Error('Account subscriptions header differs.');
const list = slot(page, 'content')[0];
if (list.type !== 'SubscriptionsListLayout') throw new Error('Account subscriptions list layout differs.');
const state = slot(list, 'content')[0];
if (state.type !== 'SubscriptionsListState' || slot(state, 'subscriptions')[0]?.type !== 'SubscriptionsListClientRegion' || slot(state, 'empty')[0]?.type !== 'SubscriptionsEmptyRegion') throw new Error('Account subscriptions state differs.');
if (slot(slot(state, 'subscriptions')[0], 'content')[0]?.type !== 'SubscriptionsCardsList') throw new Error('Account subscriptions dynamic cards list differs.');
for (const forbidden of ['PageWrapper', 'PageHeader', 'SubscriptionStateSection', 'SubscriptionsPageStateSection']) if (containsType(seed.content, forbidden)) throw new Error(`Seed must not emit legacy ${forbidden}.`);
for (const forbidden of ['puck-subscription-preview', 'contractNumber']) if (JSON.stringify(seed).includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-subscriptions.report.json'))) as { warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }> };
if (report.warnings.length || report.droppedComponents.length || report.unmatchedHtml.length) throw new Error('Parser report has diagnostics.');
for (const owner of ['SubscriptionsListClientRegion', 'SubscriptionsListState']) if (!report.runtimeConditionals.some((item) => item.handledBy === owner)) throw new Error(`Parser report is missing ${owner}.`);

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'subscriptions', 'page.tsx'));
text(publishedRoute, 'slug="account-subscriptions"', 'published account-subscriptions slug bridge');
text(publishedRoute, "routeParams={{ slug: 'account-subscriptions' }}", 'published account-subscriptions route metadata bridge');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-account-subscriptions-order-'));
try {
  const fixturePath = path.join(temporaryDir, 'SubscriptionList.tsx');
  const outputPath = path.join(temporaryDir, 'account-subscriptions.json');
  const original = normalize(sourceList);
  const before = 'subscriptions={\n            <SubscriptionsListClientRegion\n              subscriptions={data.subscriptions}\n              content={<SubscriptionsCardsList subscriptions={data.subscriptions} />}\n            />\n          }\n          empty={<SubscriptionsEmptyRegion />}';
  const after = 'subscriptions={<SubscriptionsEmptyRegion />}\n          empty={\n            <SubscriptionsListClientRegion\n              subscriptions={data.subscriptions}\n              content={<SubscriptionsCardsList subscriptions={data.subscriptions} />}\n            />\n          }';
  if (!original.includes(before)) throw new Error('Unable to create remapped account-subscriptions parser fixture.');
  fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  let rejected = false;
  try {
    childProcess.execSync(`npx tsx ast-parser.ts "app/account/subscriptions/page.tsx" "${outputPath}"`, { cwd: templateRoot, env: { ...process.env, ACCOUNT_SUBSCRIPTIONS_LIST_SOURCE: fixturePath }, stdio: 'pipe', shell: process.platform === 'win32' ? process.env.ComSpec : undefined });
  } catch {
    rejected = true;
  }
  const rejectedReport = JSON.parse(read(path.join(temporaryDir, '_reports', 'account-subscriptions.report.json'))) as { fatal: boolean; errors: string[] };
  if (!rejected || fs.existsSync(outputPath) || !rejectedReport.fatal || rejectedReport.errors.length === 0) throw new Error('Parser did not reject an invalid cross-slot subscriptions composition.');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

console.log('Account subscriptions source-first canonical parity checks passed.');
