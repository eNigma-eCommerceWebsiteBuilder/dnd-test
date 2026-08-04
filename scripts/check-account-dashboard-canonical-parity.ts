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

const route = read(path.join(templateRoot, 'app', 'account', 'page.tsx'));
for (const signature of ["import { AccountDashboardPage } from '@/components/account/dashboard/canonical/AccountDashboardPage';", 'fetchAccountDashboardData()', '<AccountDashboardPage data={await fetchAccountDashboardData()} />']) text(route, signature, 'production account dashboard route signature');

const sourceRoot = path.join(templateRoot, 'components', 'account', 'dashboard', 'canonical');
const sourcePage = read(path.join(sourceRoot, 'AccountDashboardPage.tsx'));
const sourceSections = read(path.join(sourceRoot, 'AccountDashboardPageSections.tsx'));
const sourceRuntime = read(path.join(sourceRoot, 'accountDashboardRuntime.ts'));
for (const signature of ['<AccountDashboardPageLayout', '<AccountDashboardHeroLayout', '<AccountDashboardWelcome', '<AccountDashboardIdentity', '<AccountDashboardLinks']) text(sourcePage, signature, 'production canonical composition');
for (const signature of ['min-h-screen bg-bg-base px-4 py-10 text-text-base', 'max-w-[1180px]', 'pt-[96px]', '@4xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]', 'Welcome back', 'Signed in as', 'accountDashboardLinks.map((link) => (', "href: '/account/orders'", "href: '/account/wishlist'", "href: '/account/addresses'", "href: '/account/settings'"]) text(sourceSections, signature, 'production source JSX region');
for (const signature of ['const session = await auth();', "session?.user?.firstName || session?.user?.name || 'there'", 'email: session?.user?.email']) text(sourceRuntime, signature, 'production account runtime contract');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'account', 'dashboard', 'canonical');
equal(read(path.join(copiedRoot, 'accountDashboardRuntime.ts')), sourceRuntime, 'accountDashboardRuntime.ts');
equal(read(path.join(copiedRoot, 'AccountDashboardPageSections.tsx')), sourceSections, 'AccountDashboardPageSections.tsx');
equal(read(path.join(copiedRoot, 'AccountDashboardPage.tsx')), sourcePage, 'AccountDashboardPage.tsx');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'dashboard', 'canonical');
const delegates = ['AccountDashboardPageLayout', 'AccountDashboardHeroLayout', 'AccountDashboardWelcome', 'AccountDashboardIdentity', 'AccountDashboardLinks'];
for (const componentName of delegates) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  text(source, '@/enigma-components/account/dashboard/canonical/', `${componentName} production delegate import`);
  text(source, `<${componentName}`, `${componentName} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=') || source.includes('<div className=')) throw new Error(`${componentName}View contains replacement layout markup.`);
}
for (const componentName of ['AccountDashboardWelcome', 'AccountDashboardIdentity']) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  text(source, 'puckServerDataFetcher', `${componentName} server-only Puck fetcher declaration`);
  text(source, 'accountDashboardFetcher.server', `${componentName} server-only Puck fetcher path`);
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> };
const roles = ['account-dashboard-page-layout', 'account-dashboard-hero-layout', 'account-dashboard-welcome', 'account-dashboard-identity', 'account-dashboard-links'];
for (const role of roles) if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Manifest is missing account-dashboard role: ${role}`);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account.json'))) as { content: SeedNode[] };
if (seed.content.map((node) => node.type).join() !== 'AccountDashboardPageLayout') throw new Error('Top-level account dashboard seed differs.');
const page = seed.content[0];
const hero = slot(page, 'hero')[0];
if (hero?.type !== 'AccountDashboardHeroLayout' || slot(hero, 'welcome')[0]?.type !== 'AccountDashboardWelcome' || slot(hero, 'identity')[0]?.type !== 'AccountDashboardIdentity') throw new Error('Account dashboard hero differs.');
if (slot(page, 'links')[0]?.type !== 'AccountDashboardLinks') throw new Error('Account dashboard links differ.');
for (const forbidden of ['PageWrapper', 'PageHeader', 'CardSection', 'AccountLinkGrid', 'AccountDashboard']) if (containsType(seed.content, forbidden)) throw new Error(`Seed must not emit legacy ${forbidden}.`);
for (const forbidden of ['alex@example.com', 'firstName', 'accountLinks']) if (JSON.stringify(seed).includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account.report.json'))) as { warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }> };
if (report.warnings.length || report.droppedComponents.length || report.unmatchedHtml.length) throw new Error('Parser report has diagnostics.');
if (!report.runtimeConditionals.some((item) => item.handledBy === 'AccountDashboardWelcome')) throw new Error('Parser report is missing the dashboard welcome owner.');

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'page.tsx'));
text(publishedRoute, 'slug="account"', 'published account slug bridge');
text(publishedRoute, "routeParams={{ slug: 'account' }}", 'published account route metadata bridge');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-account-dashboard-slots-'));
try {
  const fixturePath = path.join(temporaryDir, 'AccountDashboardPage.tsx');
  const outputPath = path.join(temporaryDir, 'account.json');
  const original = normalize(sourcePage);
  const before = 'welcome={<AccountDashboardWelcome firstName={data.firstName} />}\n          identity={<AccountDashboardIdentity email={data.email} />}';
  const after = 'welcome={<AccountDashboardIdentity email={data.email} />}\n          identity={<AccountDashboardWelcome firstName={data.firstName} />}';
  if (!original.includes(before)) throw new Error('Unable to create remapped account-dashboard parser fixture.');
  fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  let rejected = false;
  try {
    childProcess.execSync(`npx tsx ast-parser.ts "app/account/page.tsx" "${outputPath}"`, { cwd: templateRoot, env: { ...process.env, ACCOUNT_DASHBOARD_PAGE_SOURCE: fixturePath }, stdio: 'pipe', shell: process.platform === 'win32' ? process.env.ComSpec : undefined });
  } catch {
    rejected = true;
  }
  const rejectedReport = JSON.parse(read(path.join(temporaryDir, '_reports', 'account.report.json'))) as { fatal: boolean; errors: string[] };
  if (!rejected || fs.existsSync(outputPath) || !rejectedReport.fatal || rejectedReport.errors.length === 0) throw new Error('Parser did not reject an invalid cross-slot dashboard composition.');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

console.log('Account dashboard source-first canonical parity checks passed.');
