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
const dndAliases = (source: string) => source.replaceAll('@/enigma-components/wishlist/', '@/components/wishlist/');

const route = read(path.join(templateRoot, 'app', 'account', 'wishlist', 'page.tsx'));
for (const signature of ["import { WishlistPage } from '@/components/wishlist/canonical/WishlistPage';", 'fetchWishlistPageData()', '<WishlistPage data={await fetchWishlistPageData()} />']) text(route, signature, 'production account-wishlist route signature');

const sourceRoot = path.join(templateRoot, 'components', 'wishlist');
const canonicalRoot = path.join(sourceRoot, 'canonical');
const sourcePage = read(path.join(canonicalRoot, 'WishlistPage.tsx'));
const sourceSections = read(path.join(canonicalRoot, 'WishlistPageSections.tsx'));
const sourceRuntime = read(path.join(canonicalRoot, 'wishlistPageRuntime.ts'));
const sourceGrid = read(path.join(sourceRoot, 'WishlistGrid.tsx'));
const sourceGridClient = read(path.join(sourceRoot, 'WishlistGridClient.tsx'));
const sourceItem = read(path.join(sourceRoot, 'WishlistItem.tsx'));
for (const signature of ['<AccountWishlistPageLayout', '<WishlistPageHeaderLayout', '<WishlistPageIntro', '<WishlistSavingsRegion', '<WishlistItemsState', '<WishlistEmptyRegion', '<WishlistGridRegion', '<WishlistRecommendationsFooter']) text(sourcePage, signature, 'production canonical composition');
for (const signature of ['min-h-screen bg-bg-base text-text-base', 'max-w-[1440px]', 'My Wishlist', 'return hasItems ? grid : empty;', '<WishlistSavingsCard wishlist={wishlist} />', '<WishlistGrid wishlist={wishlist} />', '<WishlistEmpty />', 'Curated for your style']) text(sourceSections, signature, 'production source JSX region');
for (const signature of ['const cookies = await getServerCookies();', 'Promise.all([', 'getWishlist({ cookies })', 'getWishlistCount({ cookies })', "console.error('Error fetching wishlist:', error)", 'throw error;']) text(sourceRuntime, signature, 'production wishlist runtime contract');
for (const signature of ['<WishlistBulkActionsBar', 'filteredItems.length === 0 ? (', 'filteredItems.map((item) => (', '<WishlistItem']) text(sourceGridClient, signature, 'production grid behavior');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'wishlist', 'canonical');
equal(read(path.join(copiedRoot, 'wishlistPageRuntime.ts')), sourceRuntime, 'wishlistPageRuntime.ts');
equal(dndAliases(read(path.join(copiedRoot, 'WishlistPageSections.tsx'))), sourceSections, 'WishlistPageSections.tsx');
equal(read(path.join(copiedRoot, 'WishlistPage.tsx')), sourcePage, 'WishlistPage.tsx');
equal(dndAliases(read(path.join(dndRoot, 'enigma-components', 'wishlist', 'WishlistGrid.tsx'))), sourceGrid, 'WishlistGrid.tsx');
equal(dndAliases(read(path.join(dndRoot, 'enigma-components', 'wishlist', 'WishlistGridClient.tsx'))), sourceGridClient, 'WishlistGridClient.tsx');
equal(dndAliases(read(path.join(dndRoot, 'enigma-components', 'wishlist', 'WishlistItem.tsx'))), sourceItem, 'WishlistItem.tsx');

const adapterRoot = path.join(dndRoot, 'components', 'account', 'wishlist', 'canonical');
const delegates = ['AccountWishlistPageLayout', 'WishlistPageHeaderLayout', 'WishlistPageIntro', 'WishlistSavingsRegion', 'WishlistItemsState', 'WishlistGridRegion', 'WishlistEmptyRegion', 'WishlistRecommendationsFooter'];
for (const componentName of delegates) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  text(source, '@/enigma-components/wishlist/canonical/', `${componentName} production delegate import`);
  text(source, `<${componentName}`, `${componentName} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=') || source.includes('<div className=')) throw new Error(`${componentName}View contains replacement layout markup.`);
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> };
const roles = ['account-wishlist-page-layout', 'wishlist-page-header-layout', 'wishlist-page-intro', 'wishlist-savings-region', 'wishlist-items-state', 'wishlist-grid-region', 'wishlist-empty-region', 'wishlist-recommendations-footer'];
for (const role of roles) if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Manifest is missing account-wishlist role: ${role}`);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-wishlist.json'))) as { content: SeedNode[] };
if (seed.content.map((node) => node.type).join() !== 'AccountWishlistPageLayout') throw new Error('Top-level account-wishlist seed differs.');
const page = seed.content[0];
const header = slot(page, 'header')[0];
if (header?.type !== 'WishlistPageHeaderLayout' || slot(header, 'intro')[0]?.type !== 'WishlistPageIntro' || slot(header, 'savings')[0]?.type !== 'WishlistSavingsRegion') throw new Error('Account wishlist header differs.');
const state = slot(page, 'content')[0];
if (state?.type !== 'WishlistItemsState' || slot(state, 'empty')[0]?.type !== 'WishlistEmptyRegion' || slot(state, 'grid')[0]?.type !== 'WishlistGridRegion') throw new Error('Account wishlist items state differs.');
if (slot(page, 'recommendations')[0]?.type !== 'WishlistRecommendationsFooter') throw new Error('Account wishlist recommendations differ.');
for (const forbidden of ['PageWrapper', 'PageHeader', 'WishlistSavingsCard', 'SectionHeading', 'AccountWishlistStateSection']) if (containsType(seed.content, forbidden)) throw new Error(`Seed must not emit legacy ${forbidden}.`);
for (const forbidden of ['puck-account-wishlist-preview', 'wishlistCount']) if (JSON.stringify(seed).includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-wishlist.report.json'))) as { warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; runtimeConditionals: Array<{ source: string; handledBy?: string }> };
if (report.warnings.length || report.droppedComponents.length || report.unmatchedHtml.length) throw new Error('Parser report has diagnostics.');
for (const owner of ['WishlistItemsState', 'WishlistGridRegion']) if (!report.runtimeConditionals.some((item) => item.handledBy === owner)) throw new Error(`Parser report is missing ${owner}.`);

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'wishlist', 'page.tsx'));
text(publishedRoute, 'slug="account-wishlist"', 'published account-wishlist slug bridge');
text(publishedRoute, "routeParams={{ slug: 'account-wishlist' }}", 'published account-wishlist route metadata bridge');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-account-wishlist-slots-'));
try {
  const fixturePath = path.join(temporaryDir, 'WishlistPage.tsx');
  const outputPath = path.join(temporaryDir, 'account-wishlist.json');
  const original = normalize(sourcePage);
  const before = 'empty={<WishlistEmptyRegion />}\n          grid={<WishlistGridRegion wishlist={data.wishlist} />}';
  const after = 'empty={<WishlistGridRegion wishlist={data.wishlist} />}\n          grid={<WishlistEmptyRegion />}';
  if (!original.includes(before)) throw new Error('Unable to create remapped account-wishlist parser fixture.');
  fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  let rejected = false;
  try {
    childProcess.execSync(`npx tsx ast-parser.ts "app/account/wishlist/page.tsx" "${outputPath}"`, { cwd: templateRoot, env: { ...process.env, ACCOUNT_WISHLIST_PAGE_SOURCE: fixturePath }, stdio: 'pipe', shell: process.platform === 'win32' ? process.env.ComSpec : undefined });
  } catch {
    rejected = true;
  }
  const rejectedReport = JSON.parse(read(path.join(temporaryDir, '_reports', 'account-wishlist.report.json'))) as { fatal: boolean; errors: string[] };
  if (!rejected || fs.existsSync(outputPath) || !rejectedReport.fatal || rejectedReport.errors.length === 0) throw new Error('Parser did not reject an invalid cross-slot wishlist composition.');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

console.log('Account wishlist source-first canonical parity checks passed.');
