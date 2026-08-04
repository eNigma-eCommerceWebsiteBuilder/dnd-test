import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type SeedNode = { type: string; props: Record<string, unknown> };
const dndRoot = path.resolve(__dirname, '..'); const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend'); const read = (filePath: string) => fs.readFileSync(filePath, 'utf8');
const text = (source: string, expected: string, description: string) => { if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`); };
const normalize = (value: string) => value.replace(/\r\n/g, '\n'); const equal = (actual: string, expected: string, description: string) => { if (normalize(actual).trim() !== normalize(expected).trim()) throw new Error(`${description} drifted from production source.`); };
function slot(node: SeedNode, name: string): SeedNode[] { const value = node.props[name]; if (!Array.isArray(value)) throw new Error(`${node.type}.${name} is not a Puck slot array.`); return value as SeedNode[]; }

const route = read(path.join(templateRoot, 'app', 'account', 'orders', '[id]', 'downloads', 'page.tsx'));
for (const signature of ["import { OrderDownloadsPage } from '@/components/orders/canonical/OrderDownloadsPage';", 'fetchOrderDownloadsPageData(id, normalizeOrderDownloadsEmail(email))', '<OrderDownloadsPage data={await fetchOrderDownloadsPageData(id, normalizeOrderDownloadsEmail(email))} orderId={id} />']) text(route, signature, 'production order-downloads route signature');

const canonicalRoot = path.join(templateRoot, 'components', 'orders', 'canonical'); const canonicalPage = read(path.join(canonicalRoot, 'OrderDownloadsPage.tsx')); const canonicalState = read(path.join(canonicalRoot, 'OrderDownloadsPageState.tsx')); const canonicalSections = read(path.join(canonicalRoot, 'OrderDownloadsPageSections.tsx')); const canonicalRuntime = read(path.join(canonicalRoot, 'orderDownloadsRuntime.ts'));
for (const signature of ['<OrderDownloadsPageState', '<OrderDownloadsPageLayout', '<OrderDownloadsBreadcrumbs', '<OrderDownloadsHeader', '<OrderDownloadsPaymentPendingCondition', '<OrderDownloadsPaymentPendingNotice', '<OrderDownloadsAssetsState', '<OrderDownloadsAssetsLayout', '<OrderDownloadsListRegion', '<OrderDownloadsLicenseKeysRegion', '<OrderDownloadsEmptyRegion', '<OrderDownloadsBackLink']) text(canonicalPage, signature, 'production canonical composition');
for (const signature of ['if (!data) redirect(`/account/orders/${orderId}`);', 'min-h-screen bg-bg-base text-text-base', 'max-w-[1200px]', 'return !data.isPaid ? <>{content}</> : null;', 'return data.digitalAssets?.assets?.length ? <>{assets}</> : <>{empty}</>;', '<OrderDigitalDownloads assets={data.digitalAssets.assets} isPaid={data.isPaid} />', '<LicenseKeyDisplay', 'No Downloads Available']) text(`${canonicalState}\n${canonicalSections}`, signature, 'source JSX parity signature');
for (const signature of ['const order = await getOrder(id);', 'if (!hasDigitalItems(order)) return null;', 'getOrderDigitalAssets(id, email)', 'isPaid: digitalAssets?.isPaid ?? false']) text(canonicalRuntime, signature, 'source order-downloads runtime signature');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'orders', 'downloads-canonical');
for (const file of ['OrderDownloadsPage.tsx', 'OrderDownloadsPageState.tsx', 'orderDownloadsRuntime.ts']) equal(read(path.join(copiedRoot, file)), read(path.join(canonicalRoot, file)), file);
equal(read(path.join(copiedRoot, 'OrderDownloadsPageSections.tsx')).replaceAll('@/enigma-components/orders/', '@/components/orders/'), canonicalSections, 'OrderDownloadsPageSections.tsx');
for (const file of ['OrderDigitalDownloads.tsx', 'LicenseKeyDisplay.tsx', 'DigitalAssetCard.tsx']) equal(read(path.join(dndRoot, 'enigma-components', 'orders', file)), read(path.join(templateRoot, 'components', 'orders', file)), file);

const adapterRoot = path.join(dndRoot, 'components', 'account', 'orders', 'downloads', 'canonical'); const delegates = ['OrderDownloadsPageState', 'OrderDownloadsPageLayout', 'OrderDownloadsBreadcrumbs', 'OrderDownloadsHeader', 'OrderDownloadsPaymentPendingCondition', 'OrderDownloadsPaymentPendingNotice', 'OrderDownloadsAssetsState', 'OrderDownloadsAssetsLayout', 'OrderDownloadsListRegion', 'OrderDownloadsLicenseKeysRegion', 'OrderDownloadsEmptyRegion', 'OrderDownloadsBackLink'];
for (const componentName of delegates) { const source = read(path.join(adapterRoot, `${componentName}View.tsx`)); text(source, '@/enigma-components/orders/downloads-canonical/', `${componentName} production delegate import`); text(source, `<${componentName}`, `${componentName} production delegate invocation`); if (source.includes('<main className=') || source.includes('<section className=')) throw new Error(`${componentName}View contains replacement layout markup.`); }

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> }; const roles = ['order-downloads-page-state', 'order-downloads-page-layout', 'order-downloads-breadcrumbs', 'order-downloads-header', 'order-downloads-payment-pending-condition', 'order-downloads-payment-pending-notice', 'order-downloads-assets-state', 'order-downloads-assets-layout', 'order-downloads-list-region', 'order-downloads-license-keys-region', 'order-downloads-empty-region', 'order-downloads-back-link'];
for (const role of roles) if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Manifest is missing order-downloads role: ${role}`);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-order-downloads.json'))) as { content: SeedNode[] }; if (seed.content.map((node) => node.type).join() !== 'OrderDownloadsPageState') throw new Error('Top-level order-downloads seed differs.'); const layout = slot(seed.content[0], 'content')[0]; if (layout.type !== 'OrderDownloadsPageLayout') throw new Error('Order-downloads layout differs.'); if (slot(layout, 'breadcrumbs')[0]?.type !== 'OrderDownloadsBreadcrumbs' || slot(layout, 'header')[0]?.type !== 'OrderDownloadsHeader' || slot(layout, 'back')[0]?.type !== 'OrderDownloadsBackLink') throw new Error('Order-downloads source regions differ.'); const pending = slot(layout, 'paymentPending')[0]; if (pending.type !== 'OrderDownloadsPaymentPendingCondition' || slot(pending, 'content')[0]?.type !== 'OrderDownloadsPaymentPendingNotice') throw new Error('Payment-pending branch differs.'); const assetState = slot(layout, 'downloads')[0]; if (assetState.type !== 'OrderDownloadsAssetsState' || slot(assetState, 'empty')[0]?.type !== 'OrderDownloadsEmptyRegion') throw new Error('Assets empty branch differs.'); const assetsLayout = slot(assetState, 'assets')[0]; if (assetsLayout.type !== 'OrderDownloadsAssetsLayout' || slot(assetsLayout, 'downloads')[0]?.type !== 'OrderDownloadsListRegion' || slot(assetsLayout, 'licenses')[0]?.type !== 'OrderDownloadsLicenseKeysRegion') throw new Error('Assets source layout differs.'); for (const forbidden of ['PageWrapper', 'AccountDigitalLibraryStateSection', 'orderDownloadsPreview', 'digitalAssets']) if (JSON.stringify(seed).includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-order-downloads.report.json'))) as { warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }> }; if (report.warnings.length || report.droppedComponents.length || report.unmatchedHtml.length) throw new Error('Parser report has diagnostics.'); for (const owner of ['OrderDownloadsPageState', 'OrderDownloadsPaymentPendingCondition', 'OrderDownloadsAssetsState']) if (!report.runtimeConditionals.some((item) => item.handledBy === owner)) throw new Error(`Parser report is missing ${owner}.`);

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'orders', '[id]', 'downloads', 'page.tsx')); text(publishedRoute, 'slug="account-order-downloads"', 'published order-downloads slug bridge'); text(publishedRoute, "routeParams={{ slug: 'account-order-downloads', id }}", 'published order-downloads id metadata bridge');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-order-downloads-order-'));
try {
  const fixturePath = path.join(temporaryDir, 'OrderDownloadsPage.tsx');
  const outputPath = path.join(temporaryDir, 'account-order-downloads.json');
  const original = normalize(canonicalPage);
  const before = 'downloads={<OrderDownloadsListRegion data={data} />} licenses={<OrderDownloadsLicenseKeysRegion data={data} />}';
  const after = 'downloads={<OrderDownloadsLicenseKeysRegion data={data} />} licenses={<OrderDownloadsListRegion data={data} />}';
  if (!original.includes(before)) throw new Error('Unable to create remapped order-downloads parser fixture.');
  fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  let rejected = false;
  try {
    childProcess.execSync(`npx tsx ast-parser.ts "app/account/orders/[id]/downloads/page.tsx" "${outputPath}"`, { cwd: templateRoot, env: { ...process.env, ORDER_DOWNLOADS_CANONICAL_SOURCE: fixturePath }, stdio: 'pipe', shell: process.platform === 'win32' ? process.env.ComSpec : undefined });
  } catch {
    rejected = true;
  }
  const rejectedReport = JSON.parse(read(path.join(temporaryDir, '_reports', 'account-order-downloads.report.json'))) as { fatal: boolean; errors: string[] };
  if (!rejected || fs.existsSync(outputPath) || !rejectedReport.fatal || rejectedReport.errors.length === 0) throw new Error('Parser did not reject an invalid cross-slot order-downloads composition.');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

console.log('Account order-downloads source-first canonical parity checks passed.');
