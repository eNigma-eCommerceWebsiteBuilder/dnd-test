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

const route = read(path.join(templateRoot, 'app', 'account', 'downloads', 'page.tsx'));
for (const signature of ["import { DigitalLibraryPage } from '@/components/account/downloads/canonical/DigitalLibraryPage';", 'fetchDigitalLibraryPageData()', '<DigitalLibraryPage data={await fetchDigitalLibraryPageData()} />']) text(route, signature, 'production account-downloads route signature');

const sourceRoot = path.join(templateRoot, 'components', 'account', 'downloads');
const canonicalRoot = path.join(sourceRoot, 'canonical');
const sourcePage = read(path.join(canonicalRoot, 'DigitalLibraryPage.tsx'));
const sourceSections = read(path.join(canonicalRoot, 'DigitalLibrarySections.tsx'));
const sourceRuntime = read(path.join(canonicalRoot, 'digitalLibraryRuntime.ts'));
const sourceLibrary = read(path.join(sourceRoot, 'DigitalLibrary.tsx'));
for (const signature of ['<AccountDownloadsPageLayout>', '<DigitalLibrary currentTimeMs={data.currentTimeMs} entries={data.entries} />', '<DigitalLibraryLayout', '<DigitalLibraryHeader />', '<DigitalLibraryMetricsLayout>', '<DigitalLibraryAssetsState', '<DigitalLibraryHistoryRegion', '<DigitalLibraryBackground />']) text(`${sourcePage}\n${sourceLibrary}`, signature, 'production canonical composition');
for (const signature of ['min-h-screen bg-bg-base text-text-base', 'max-w-[1440px]', 'return entries.length === 0 ? empty : assets;', 'entries.map((entry) => (', '<DigitalProductCard', '<DownloadHistory', 'pointer-events-none absolute inset-0 -z-10 opacity-40']) text(sourceSections, signature, 'production source JSX region');
for (const signature of ['const ordersResponse = await getMyOrders();', 'getOrderDigitalAssets(order._id)', 'if (!response.isPaid)', 'getLicenseInfo(asset.licenseKey)', 'getDownloadStats(asset.licenseKey)']) text(sourceRuntime, signature, 'production digital-library runtime contract');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'account', 'downloads', 'canonical');
for (const file of ['digitalLibraryRuntime.ts', 'DigitalLibrarySections.tsx', 'DigitalLibraryPage.tsx']) equal(read(path.join(copiedRoot, file)), read(path.join(canonicalRoot, file)), file);
equal(read(path.join(dndRoot, 'components', 'account', 'downloads', 'DigitalLibrary.tsx')).replaceAll('@/enigma-components/account/downloads/canonical/', '@/components/account/downloads/canonical/'), sourceLibrary, 'DigitalLibrary.tsx');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'downloads', 'canonical');
const delegates = ['AccountDownloadsPageLayout', 'DigitalLibraryLayout', 'DigitalLibraryHeader', 'DigitalLibraryMetricsLayout', 'DigitalLibraryDownloadsMetric', 'DigitalLibraryAttentionMetric', 'DigitalLibraryAssetsMetric', 'DigitalLibraryAssetsState', 'DigitalLibraryEntriesGrid', 'DigitalLibraryEmptyRegion', 'DigitalLibraryHistoryRegion', 'DigitalLibraryBackground'];
for (const componentName of delegates) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  text(source, '@/enigma-components/account/downloads/canonical/', `${componentName} production delegate import`);
  text(source, `<${componentName}`, `${componentName} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=') || source.includes('<div className=')) throw new Error(`${componentName}View contains replacement layout markup.`);
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> };
const roles = ['account-downloads-page-layout', 'digital-library-layout', 'digital-library-header', 'digital-library-metrics-layout', 'digital-library-downloads-metric', 'digital-library-attention-metric', 'digital-library-assets-metric', 'digital-library-assets-state', 'digital-library-entries-grid', 'digital-library-empty-region', 'digital-library-history-region', 'digital-library-background'];
for (const role of roles) if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Manifest is missing account-downloads role: ${role}`);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-downloads.json'))) as { content: SeedNode[] };
if (seed.content.map((node) => node.type).join() !== 'AccountDownloadsPageLayout') throw new Error('Top-level account-downloads seed differs.');
const library = slot(seed.content[0], 'content')[0];
if (library.type !== 'DigitalLibraryLayout' || slot(library, 'header')[0]?.type !== 'DigitalLibraryHeader' || slot(library, 'history')[0]?.type !== 'DigitalLibraryHistoryRegion' || slot(library, 'background')[0]?.type !== 'DigitalLibraryBackground') throw new Error('Account-downloads source regions differ.');
const metrics = slot(library, 'metrics')[0];
if (metrics.type !== 'DigitalLibraryMetricsLayout' || slot(metrics, 'metrics').map((node) => node.type).join() !== 'DigitalLibraryDownloadsMetric,DigitalLibraryAttentionMetric,DigitalLibraryAssetsMetric') throw new Error('Account-downloads metrics structure differs.');
const assetsState = slot(library, 'assets')[0];
if (assetsState.type !== 'DigitalLibraryAssetsState' || slot(assetsState, 'assets')[0]?.type !== 'DigitalLibraryEntriesGrid' || slot(assetsState, 'empty')[0]?.type !== 'DigitalLibraryEmptyRegion') throw new Error('Account-downloads asset state differs.');
for (const forbidden of ['AccountDigitalLibraryStateSection', 'DigitalProductCard', 'PREVIEW-DIGITAL-ASSET', 'licenseKey']) if (JSON.stringify(seed).includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-downloads.report.json'))) as { warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }> };
if (report.warnings.length || report.droppedComponents.length || report.unmatchedHtml.length) throw new Error('Parser report has diagnostics.');
if (!report.runtimeConditionals.some((item) => item.handledBy === 'DigitalLibraryAssetsState')) throw new Error('Parser report is missing the digital-library state owner.');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-account-downloads-order-'));
try {
  const fixturePath = path.join(temporaryDir, 'DigitalLibrary.tsx');
  const outputPath = path.join(temporaryDir, 'account-downloads.json');
  const original = normalize(sourceLibrary);
  const before = '<DigitalLibraryDownloadsMetric metrics={getDigitalLibraryMetrics({ currentTimeMs, entries })} entriesCount={entries.length} />\n                    <DigitalLibraryAttentionMetric metrics={getDigitalLibraryMetrics({ currentTimeMs, entries })} entriesCount={entries.length} />';
  const after = '<DigitalLibraryAttentionMetric metrics={getDigitalLibraryMetrics({ currentTimeMs, entries })} entriesCount={entries.length} />\n                    <DigitalLibraryDownloadsMetric metrics={getDigitalLibraryMetrics({ currentTimeMs, entries })} entriesCount={entries.length} />';
  if (!original.includes(before)) throw new Error('Unable to create remapped account-downloads parser fixture.');
  fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  childProcess.execSync(`npx tsx ast-parser.ts "app/account/downloads/page.tsx" "${outputPath}"`, { cwd: templateRoot, env: { ...process.env, ACCOUNT_DOWNLOADS_LIBRARY_SOURCE: fixturePath }, stdio: 'pipe', shell: process.platform === 'win32' ? process.env.ComSpec : undefined });
  const remapped = JSON.parse(read(outputPath)) as { content: SeedNode[] };
  const remappedLibrary = slot(remapped.content[0], 'content')[0];
  const remappedMetrics = slot(slot(remappedLibrary, 'metrics')[0], 'metrics');
  if (remappedMetrics.slice(0, 2).map((node) => node.type).join() !== 'DigitalLibraryAttentionMetric,DigitalLibraryDownloadsMetric') throw new Error('Parser did not retain remapped source sibling order.');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

console.log('Account downloads source-first canonical parity checks passed.');
