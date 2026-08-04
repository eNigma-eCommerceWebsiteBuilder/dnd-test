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

const route = read(path.join(templateRoot, 'app', 'account', 'returns', '[id]', 'page.tsx'));
for (const signature of ["import { ReturnDetailsPage } from '@/components/returns/canonical/ReturnDetailsPage';", 'fetchReturnDetails(id)', '<ReturnDetailsPage returnDetails={returnDetails} />']) requireText(route, signature, 'production return-detail route signature');

const canonicalRoot = path.join(templateRoot, 'components', 'returns', 'canonical');
const canonicalPage = read(path.join(canonicalRoot, 'ReturnDetailsPage.tsx'));
const canonicalState = read(path.join(canonicalRoot, 'ReturnDetailsPageState.tsx'));
const canonicalSections = read(path.join(canonicalRoot, 'ReturnDetailsPageSections.tsx'));
const canonicalRuntime = read(path.join(canonicalRoot, 'returnDetailsRuntime.ts'));
for (const signature of ['<ReturnDetailsPageState', '<ReturnDetailsNotFoundLayout', '<ReturnDetailsPageLayout', '<ReturnDetailsHeaderRegion', '<ReturnDetailsTimelineRegion', '<ReturnDetailsContentLayout', '<ReturnDetailsItemsRegion', '<ReturnDetailsReasonRegion', '<ReturnDetailsAdminNotesCondition', '<ReturnDetailsAdminNotesRegion', '<ReturnDetailsTrackingRegion', '<ReturnDetailsLabelRegion', '<ReturnDetailsRefundSummaryRegion', '<ReturnDetailsRefundBreakdownRegion', '<ReturnDetailsActionsRegion']) requireText(canonicalPage, signature, 'production canonical composition');
for (const signature of ['return returnDetails ? <>{content}</> : <>{notFound}</>;', 'min-h-screen bg-bg-base text-text-base', 'max-w-[1440px]', 'lg:grid-cols-12', 'lg:col-span-7', 'lg:col-span-5', 'return notes ? <>{content}</> : null', '<ReturnDetailsHeader returnRequest={returnRequest} />', '<ReturnItemList returnItems={returnRequest.returnItems} order={order} />', '<ReturnActionsPanel returnId={returnRequest._id} status={returnRequest.status} />']) requireText(`${canonicalState}\n${canonicalSections}`, signature, 'source JSX parity signature');
requireText(canonicalRuntime, 'return await getReturnDetails(id)', 'source return data contract');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'returns', 'canonical');
for (const file of ['ReturnDetailsPage.tsx', 'ReturnDetailsPageState.tsx', 'returnDetailsRuntime.ts']) requireEqual(read(path.join(copiedRoot, file)).trim(), read(path.join(canonicalRoot, file)).trim(), `${file} drifted from production source`);
const copiedSections = read(path.join(copiedRoot, 'ReturnDetailsPageSections.tsx')).replaceAll('@/enigma-components/returns/', '@/components/returns/');
requireEqual(copiedSections.trim(), canonicalSections.trim(), 'ReturnDetailsPageSections.tsx drifted from production source');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'returns', 'detail', 'canonical');
const delegates = ['ReturnDetailsPageState', 'ReturnDetailsNotFoundLayout', 'ReturnDetailsPageLayout', 'ReturnDetailsHeaderRegion', 'ReturnDetailsTimelineRegion', 'ReturnDetailsContentLayout', 'ReturnDetailsItemsRegion', 'ReturnDetailsReasonRegion', 'ReturnDetailsAdminNotesCondition', 'ReturnDetailsAdminNotesRegion', 'ReturnDetailsTrackingRegion', 'ReturnDetailsLabelRegion', 'ReturnDetailsRefundSummaryRegion', 'ReturnDetailsRefundBreakdownRegion', 'ReturnDetailsActionsRegion'];
for (const componentName of delegates) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  requireText(source, '@/enigma-components/returns/canonical/', `${componentName} production delegate import`);
  requireText(source, `<${componentName}`, `${componentName} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=')) throw new Error(`${componentName}View contains replacement layout markup.`);
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> };
const roles = ['return-details-page-state', 'return-details-not-found-layout', 'return-details-page-layout', 'return-details-header', 'return-details-timeline', 'return-details-content-layout', 'return-details-items', 'return-details-reason', 'return-details-admin-notes-condition', 'return-details-admin-notes', 'return-details-tracking', 'return-details-label', 'return-details-refund-summary', 'return-details-refund-breakdown', 'return-details-actions'];
for (const role of roles) if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Manifest is missing return-detail role: ${role}`);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-return-detail.json'))) as { content: SeedNode[] };
requireEqual(seed.content.map((node) => node.type), ['ReturnDetailsPageState'], 'top-level seed structure differs');
const state = seed.content[0]; requireEqual(slot(state, 'notFound').map((node) => node.type), ['ReturnDetailsNotFoundLayout'], 'not-found source branch differs');
const layout = slot(state, 'content')[0]; requireEqual(layout.type, 'ReturnDetailsPageLayout', 'detail branch layout differs');
requireEqual(slot(layout, 'header').map((node) => node.type), ['ReturnDetailsHeaderRegion'], 'header slot differs'); requireEqual(slot(layout, 'timeline').map((node) => node.type), ['ReturnDetailsTimelineRegion'], 'timeline slot differs'); requireEqual(slot(layout, 'actions').map((node) => node.type), ['ReturnDetailsActionsRegion'], 'actions slot differs');
const content = slot(layout, 'content')[0]; requireEqual(slot(content, 'primary').map((node) => node.type), ['ReturnDetailsItemsRegion', 'ReturnDetailsReasonRegion', 'ReturnDetailsAdminNotesCondition'], 'primary source order differs'); requireEqual(slot(content, 'sidebar').map((node) => node.type), ['ReturnDetailsTrackingRegion', 'ReturnDetailsLabelRegion', 'ReturnDetailsRefundSummaryRegion', 'ReturnDetailsRefundBreakdownRegion'], 'sidebar source order differs'); requireEqual(slot(slot(content, 'primary')[2], 'content').map((node) => node.type), ['ReturnDetailsAdminNotesRegion'], 'admin-notes branch differs');
for (const forbidden of ['PageWrapper', 'ReturnNotFound', 'returnDetailsPreview', 'returnId']) if (JSON.stringify(seed).includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-return-detail.report.json'))) as { warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }> };
requireEqual(report.warnings, [], 'parser report contains warnings'); requireEqual(report.droppedComponents, [], 'parser report contains dropped components'); requireEqual(report.unmatchedHtml, [], 'parser report contains unmatched HTML');
for (const owner of ['ReturnDetailsPageState', 'ReturnDetailsAdminNotesCondition']) if (!report.runtimeConditionals.some((item) => item.handledBy === owner)) throw new Error(`Parser report is missing source owner: ${owner}`);

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'returns', '[id]', 'page.tsx')); requireText(publishedRoute, 'slug="account-return-detail"', 'published return-detail slug bridge'); requireText(publishedRoute, "routeParams={{ slug: 'account-return-detail', id }}", 'published return-detail id metadata bridge');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-return-detail-order-'));
try {
  const fixturePath = path.join(temporaryDir, 'ReturnDetailsPage.tsx'); const outputPath = path.join(temporaryDir, 'account-return-detail.json'); const original = canonicalPage.replace(/\r\n/g, '\n');
  const before = '                  <ReturnDetailsItemsRegion returnRequest={returnDetails} order={order} />\n                  <ReturnDetailsReasonRegion returnRequest={returnDetails} />'; const after = '                  <ReturnDetailsReasonRegion returnRequest={returnDetails} />\n                  <ReturnDetailsItemsRegion returnRequest={returnDetails} order={order} />';
  if (!original.includes(before)) throw new Error('Unable to create reordered return-detail parser fixture.'); fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  childProcess.execSync(`npx tsx ast-parser.ts "app/account/returns/[id]/page.tsx" "${outputPath}"`, { cwd: templateRoot, env: { ...process.env, RETURN_DETAILS_CANONICAL_SOURCE: fixturePath }, stdio: 'pipe', shell: process.platform === 'win32' ? process.env.ComSpec : undefined });
  const reordered = JSON.parse(read(outputPath)) as { content: SeedNode[] }; const reorderedContent = slot(slot(reordered.content[0], 'content')[0], 'content')[0]; requireEqual(slot(reorderedContent, 'primary').map((node) => node.type), ['ReturnDetailsReasonRegion', 'ReturnDetailsItemsRegion', 'ReturnDetailsAdminNotesCondition'], 'parser did not retain reordered source siblings');
} finally { fs.rmSync(temporaryDir, { recursive: true, force: true }); }
console.log('Account return-detail source-first canonical parity checks passed.');
