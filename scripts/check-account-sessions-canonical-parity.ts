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

const route = read(path.join(templateRoot, 'app', 'account', 'sessions', 'page.tsx'));
for (const signature of ["import { AccountSessionsPage } from '@/components/account/sessions/canonical/AccountSessionsPage';", '<AccountSessionsPage />']) text(route, signature, 'production account-sessions route signature');

const sourceRoot = path.join(templateRoot, 'components', 'account', 'sessions', 'canonical');
const sourcePage = read(path.join(sourceRoot, 'AccountSessionsPage.tsx'));
const sourceSections = read(path.join(sourceRoot, 'AccountSessionsPageSections.tsx'));
for (const signature of ['<AccountSessionsPageLayout', '<AccountSessionsBreadcrumbs />', '<AccountSessionsIdentityNotice />']) text(sourcePage, signature, 'production canonical composition');
for (const signature of ['min-h-screen bg-bg-base text-text-base', 'max-w-[980px]', 'pt-[104px]', '<Link href={ROUTES.HOME}', '<Link href={ROUTES.ACCOUNT}', 'Identity migration', 'Session management moved to eNigma Identity.', 'hosted identity flow', 'rounded-card border border-border bg-bg-base/80 p-5']) text(sourceSections, signature, 'production source JSX region');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'account', 'sessions', 'canonical');
equal(read(path.join(copiedRoot, 'AccountSessionsPageSections.tsx')), sourceSections, 'AccountSessionsPageSections.tsx');
equal(read(path.join(copiedRoot, 'AccountSessionsPage.tsx')), sourcePage, 'AccountSessionsPage.tsx');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'sessions', 'canonical');
const delegates = ['AccountSessionsPageLayout', 'AccountSessionsBreadcrumbs', 'AccountSessionsIdentityNotice'];
for (const componentName of delegates) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  text(source, '@/enigma-components/account/sessions/canonical/', `${componentName} production delegate import`);
  text(source, `<${componentName}`, `${componentName} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=') || source.includes('<div className=')) throw new Error(`${componentName}View contains replacement layout markup.`);
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> };
const roles = ['account-sessions-page-layout', 'account-sessions-breadcrumbs', 'account-sessions-identity-notice'];
for (const role of roles) if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Manifest is missing account-sessions role: ${role}`);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-sessions.json'))) as { content: SeedNode[] };
if (seed.content.map((node) => node.type).join() !== 'AccountSessionsPageLayout') throw new Error('Top-level account-sessions seed differs.');
const page = seed.content[0];
if (slot(page, 'breadcrumbs')[0]?.type !== 'AccountSessionsBreadcrumbs' || slot(page, 'content')[0]?.type !== 'AccountSessionsIdentityNotice') throw new Error('Account sessions source slots differ.');
for (const forbidden of ['PageWrapper', 'PageHeader', 'CardSection', 'AccountSessions']) if (containsType(seed.content, forbidden)) throw new Error(`Seed must not emit legacy ${forbidden}.`);

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-sessions.report.json'))) as { warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: unknown[] };
if (report.warnings.length || report.droppedComponents.length || report.unmatchedHtml.length || report.runtimeConditionals.length) throw new Error('Parser report has diagnostics or unexpected runtime conditions.');

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'sessions', 'page.tsx'));
text(publishedRoute, 'slug="account-sessions"', 'published account-sessions slug bridge');
text(publishedRoute, "routeParams={{ slug: 'account-sessions' }}", 'published account-sessions route metadata bridge');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-account-sessions-signature-'));
try {
  const fixturePath = path.join(temporaryDir, 'AccountSessionsPage.tsx');
  const outputPath = path.join(temporaryDir, 'account-sessions.json');
  const reportPath = path.join(temporaryDir, '_reports', 'account-sessions.report.json');
  const original = normalize(sourcePage);
  const before = 'content={<AccountSessionsIdentityNotice />}';
  if (!original.includes(before)) throw new Error('Unable to create invalid account-sessions parser fixture.');
  fs.writeFileSync(fixturePath, original.replace(before, 'content={<AccountSessionsBreadcrumbs />}'), 'utf8');
  let rejected = false;
  try {
    childProcess.execSync(`npx tsx ast-parser.ts "app/account/sessions/page.tsx" "${outputPath}"`, { cwd: templateRoot, env: { ...process.env, ACCOUNT_SESSIONS_PAGE_SOURCE: fixturePath }, stdio: 'pipe', shell: process.platform === 'win32' ? process.env.ComSpec : undefined });
  } catch {
    rejected = true;
  }
  const invalidReport = JSON.parse(read(reportPath)) as { fatal: boolean; errors: string[] };
  if (!rejected || fs.existsSync(outputPath) || !invalidReport.fatal || invalidReport.errors.length === 0) throw new Error('Parser did not reject an invalid sessions source region.');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

console.log('Account sessions source-first canonical parity checks passed.');
