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

const route = read(path.join(templateRoot, 'app', 'account', 'returns', 'page.tsx'));
for (const signature of ["import { ReturnsPage } from '@/components/returns/canonical/ReturnsPage';", 'fetchReturnsPageData(await searchParams)', '<ReturnsPage data={await fetchReturnsPageData(await searchParams)} />']) text(route, signature, 'production account-returns route signature');

const sourceRoot = path.join(templateRoot, 'components', 'returns');
const canonicalRoot = path.join(sourceRoot, 'canonical');
const sourcePage = read(path.join(canonicalRoot, 'ReturnsPage.tsx'));
const sourceSections = read(path.join(canonicalRoot, 'ReturnsPageSections.tsx'));
const sourceRuntime = read(path.join(canonicalRoot, 'returnsPageRuntime.ts'));
const sourceList = read(path.join(sourceRoot, 'ReturnsList.tsx'));
for (const signature of ['<ReturnsPageLayout', '<ReturnsPageHeader />', '<ReturnsList returns={data.returns} status={data.status} page={data.page} limit={10} />', '<ReturnsListLayout', '<ReturnsStatusFilterRegion', '<ReturnsResultsState', '<ReturnsCardsList', '<ReturnsEmptyRegion', '<ReturnsPaginationRegion']) text(`${sourcePage}\n${sourceList}`, signature, 'production canonical composition');
for (const signature of ['min-h-screen bg-bg-base text-text-base', 'max-w-[1440px]', 'Track return requests and refund status', 'return hasReturns ? results : empty;', 'returns.map((returnRequest) => (', '<ReturnCard', '<CancelReturnButton', '<ReturnsPagination']) text(sourceSections, signature, 'production source JSX region');
for (const signature of ["parseInt(params.page || '1', 10)", 'Object.values(ReturnRequestStatus)', 'getMyReturns(status, page, 10)', "console.error('Error fetching returns:', error)", 'throw error;']) text(sourceRuntime, signature, 'production returns runtime contract');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'returns', 'canonical');
equal(read(path.join(copiedRoot, 'returnsPageRuntime.ts')), sourceRuntime, 'returnsPageRuntime.ts');
equal(read(path.join(copiedRoot, 'ReturnsPageSections.tsx')).replaceAll('@/enigma-components/returns/', '@/components/returns/'), sourceSections, 'ReturnsPageSections.tsx');
equal(read(path.join(copiedRoot, 'ReturnsPage.tsx')).replaceAll('@/enigma-components/returns/', '@/components/returns/'), sourcePage, 'ReturnsPage.tsx');
equal(read(path.join(dndRoot, 'enigma-components', 'returns', 'ReturnsList.tsx')).replaceAll('@/enigma-components/returns/canonical/', '@/components/returns/canonical/'), sourceList, 'ReturnsList.tsx');
const sourceCard = read(path.join(sourceRoot, 'ReturnCard.tsx')); const copiedCard = read(path.join(dndRoot, 'enigma-components', 'returns', 'ReturnCard.tsx')); equal(copiedCard.replaceAll('@/enigma-components/returns/', '@/components/returns/'), sourceCard, 'ReturnCard.tsx');
equal(read(path.join(dndRoot, 'lib', 'hooks', 'returns', 'useReturns.ts')), read(path.join(templateRoot, 'lib', 'hooks', 'returns', 'useReturns.ts')), 'useReturns.ts');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'returns', 'canonical');
const delegates = ['ReturnsPageLayout', 'ReturnsPageHeader', 'ReturnsListLayout', 'ReturnsStatusFilterRegion', 'ReturnsProcessingNotice', 'ReturnsResultsState', 'ReturnsCardsList', 'ReturnsEmptyRegion', 'ReturnsPaginationRegion'];
for (const componentName of delegates) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  text(source, '@/enigma-components/returns/canonical/', `${componentName} production delegate import`);
  text(source, `<${componentName}`, `${componentName} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=') || source.includes('<div className=')) throw new Error(`${componentName}View contains replacement layout markup.`);
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> };
const roles = ['returns-page-layout', 'returns-page-header', 'returns-list-layout', 'returns-status-filter-region', 'returns-processing-notice', 'returns-results-state', 'returns-cards-list', 'returns-empty-region', 'returns-pagination-region'];
for (const role of roles) if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Manifest is missing account-returns role: ${role}`);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-returns.json'))) as { content: SeedNode[] };
if (seed.content.map((node) => node.type).join() !== 'ReturnsPageLayout') throw new Error('Top-level account-returns seed differs.');
const page = seed.content[0];
if (slot(page, 'header')[0]?.type !== 'ReturnsPageHeader') throw new Error('Account returns header differs.');
const list = slot(page, 'content')[0];
if (list.type !== 'ReturnsListLayout' || slot(list, 'filter')[0]?.type !== 'ReturnsStatusFilterRegion' || slot(list, 'notice')[0]?.type !== 'ReturnsProcessingNotice' || slot(list, 'pagination')[0]?.type !== 'ReturnsPaginationRegion') throw new Error('Account returns list regions differ.');
const state = slot(list, 'results')[0];
if (state.type !== 'ReturnsResultsState' || slot(state, 'results')[0]?.type !== 'ReturnsCardsList' || slot(state, 'empty')[0]?.type !== 'ReturnsEmptyRegion') throw new Error('Account returns results state differs.');
for (const forbidden of ['PageWrapper', 'PageHeader', 'AccountReturnsStateSection']) if (containsType(seed.content, forbidden)) throw new Error(`Seed must not emit legacy ${forbidden}.`);
for (const forbidden of ['puck-return-preview', 'requestNumber']) if (JSON.stringify(seed).includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-returns.report.json'))) as { warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }> };
if (report.warnings.length || report.droppedComponents.length || report.unmatchedHtml.length) throw new Error('Parser report has diagnostics.');
for (const owner of ['ReturnsResultsState', 'ReturnsPaginationRegion']) if (!report.runtimeConditionals.some((item) => item.handledBy === owner)) throw new Error(`Parser report is missing ${owner}.`);

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'returns', 'page.tsx'));
text(publishedRoute, 'slug="account-returns"', 'published account-returns slug bridge');
text(publishedRoute, "routeParams={{ slug: 'account-returns' }}", 'published account-returns route metadata bridge');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-account-returns-order-'));
try {
  const fixturePath = path.join(temporaryDir, 'ReturnsList.tsx');
  const outputPath = path.join(temporaryDir, 'account-returns.json');
  const original = normalize(sourceList);
  const before = 'results={<ReturnsCardsList returns={returns} />}\n                    empty={<ReturnsEmptyRegion />}';
  const after = 'results={<ReturnsEmptyRegion />}\n                    empty={<ReturnsCardsList returns={returns} />}';
  if (!original.includes(before)) throw new Error('Unable to create remapped account-returns parser fixture.');
  fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  let rejected = false;
  try {
    childProcess.execSync(`npx tsx ast-parser.ts "app/account/returns/page.tsx" "${outputPath}"`, { cwd: templateRoot, env: { ...process.env, ACCOUNT_RETURNS_LIST_SOURCE: fixturePath }, stdio: 'pipe', shell: process.platform === 'win32' ? process.env.ComSpec : undefined });
  } catch {
    rejected = true;
  }
  const rejectedReport = JSON.parse(read(path.join(temporaryDir, '_reports', 'account-returns.report.json'))) as { fatal: boolean; errors: string[] };
  if (!rejected || fs.existsSync(outputPath) || !rejectedReport.fatal || rejectedReport.errors.length === 0) throw new Error('Parser did not reject an invalid cross-slot returns composition.');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

console.log('Account returns source-first canonical parity checks passed.');
