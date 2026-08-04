import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type SeedNode = { type: string; props: Record<string, unknown> };
const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const read = (filePath: string) => fs.readFileSync(filePath, 'utf8');
const requireText = (source: string, expected: string, description: string) => { if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`); };
const normalizeLineEndings = (value: unknown) => typeof value === 'string' ? value.replace(/\r\n/g, '\n') : value;
const requireEqual = (actual: unknown, expected: unknown, description: string) => { const normalizedActual = normalizeLineEndings(actual); const normalizedExpected = normalizeLineEndings(expected); if (JSON.stringify(normalizedActual) !== JSON.stringify(normalizedExpected)) throw new Error(`${description}. Expected ${JSON.stringify(normalizedExpected)}, received ${JSON.stringify(normalizedActual)}.`); };
function slot(node: SeedNode, name: string): SeedNode[] { const value = node.props[name]; if (!Array.isArray(value)) throw new Error(`${node.type}.${name} is not a Puck slot array.`); return value as SeedNode[]; }

const route = read(path.join(templateRoot, 'app', 'account', 'addresses', 'page.tsx'));
for (const signature of ["import { AddressesPage as AddressesCanonicalPage } from '@/components/addresses/canonical/AddressesPage';", 'fetchAddressesPageData()', '<AddressesCanonicalPage pageData={await fetchAddressesPageData()} />']) requireText(route, signature, 'production addresses route signature');

const canonicalRoot = path.join(templateRoot, 'components', 'addresses', 'canonical');
const canonicalPage = read(path.join(canonicalRoot, 'AddressesPage.tsx'));
const canonicalState = read(path.join(canonicalRoot, 'AddressesPageState.tsx'));
const canonicalSections = read(path.join(canonicalRoot, 'AddressesPageSections.tsx'));
const canonicalRuntime = read(path.join(canonicalRoot, 'addressesRuntime.ts'));
for (const signature of ['<AddressesPageState', '<AddressesPageLayout', '<AddressesBreadcrumbs', '<AddressesAccountLayout', '<AddressesAccountSidebar', '<AddressesContentLayout', '<AddressesManagerRegion']) requireText(canonicalPage, signature, 'production canonical composition');
for (const signature of ['return <>{content}</>;', 'min-h-screen bg-bg-base text-text-base', 'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12', 'grid grid-cols-1 lg:grid-cols-12 gap-10', 'lg:col-span-3', 'lg:col-span-9', 'Shipping Addresses', '<AddressManager user={pageData.user} />']) requireText(`${canonicalState}\n${canonicalSections}`, signature, 'source JSX parity signature');
for (const signature of ['return { user: await getUserProfile() };', "console.error('Error fetching user profile:'"]) requireText(canonicalRuntime, signature, 'source address runtime signature');

const copiedRoot = path.join(dndRoot, 'enigma-components', 'addresses', 'canonical');
for (const file of ['AddressesPage.tsx', 'AddressesPageState.tsx', 'addressesRuntime.ts']) requireEqual(read(path.join(copiedRoot, file)).trim(), read(path.join(canonicalRoot, file)).trim(), `${file} drifted from production source`);
const copiedSections = read(path.join(copiedRoot, 'AddressesPageSections.tsx')).replaceAll('@/enigma-components/addresses/', '@/components/addresses/');
requireEqual(copiedSections.trim(), canonicalSections.trim(), 'AddressesPageSections.tsx drifted from production source');
for (const file of ['AddressManager.tsx', 'AddressList.tsx', 'AddressCard.tsx', 'AddAddressModal.tsx', 'AddressForm.tsx']) {
  const copied = read(path.join(dndRoot, 'enigma-components', 'addresses', file)).replaceAll('@/enigma-components/addresses/', '@/components/addresses/');
  requireEqual(copied.trim(), read(path.join(templateRoot, 'components', 'addresses', file)).trim(), `${file} drifted from its production delegate`);
}

const adapterRoot = path.join(dndRoot, 'components', 'account', 'addresses', 'canonical');
const delegates = ['AddressesPageState', 'AddressesPageLayout', 'AddressesBreadcrumbs', 'AddressesAccountLayout', 'AddressesAccountSidebar', 'AddressesContentLayout', 'AddressesManagerRegion'];
for (const componentName of delegates) {
  const source = read(path.join(adapterRoot, `${componentName}View.tsx`));
  requireText(source, '@/enigma-components/addresses/canonical/', `${componentName} production delegate import`);
  requireText(source, `<${componentName}`, `${componentName} production delegate invocation`);
  if (source.includes('<main className=') || source.includes('<section className=')) throw new Error(`${componentName}View contains replacement layout markup.`);
}

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as { components: Array<{ ast?: { role?: string } }> };
const roles = ['addresses-page-state', 'addresses-page-layout', 'addresses-breadcrumbs', 'addresses-account-layout', 'addresses-account-sidebar', 'addresses-content-layout', 'addresses-manager-region'];
for (const role of roles) if (!manifest.components.some((component) => component.ast?.role === role)) throw new Error(`Manifest is missing addresses role: ${role}`);

const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-addresses.json'))) as { content: SeedNode[] };
requireEqual(seed.content.map((node) => node.type), ['AddressesPageState'], 'top-level seed structure differs');
const layout = slot(seed.content[0], 'content')[0]; requireEqual(layout.type, 'AddressesPageLayout', 'addresses layout differs'); requireEqual(slot(layout, 'breadcrumbs').map((node) => node.type), ['AddressesBreadcrumbs'], 'breadcrumbs slot differs');
const account = slot(layout, 'account')[0]; requireEqual(account.type, 'AddressesAccountLayout', 'account layout differs'); requireEqual(slot(account, 'sidebar').map((node) => node.type), ['AddressesAccountSidebar'], 'sidebar slot differs'); const content = slot(account, 'content')[0]; requireEqual(content.type, 'AddressesContentLayout', 'content layout differs'); requireEqual(slot(content, 'addressManager').map((node) => node.type), ['AddressesManagerRegion'], 'manager region differs');
for (const forbidden of ['AccountAddressesStateSection', 'PageWrapper', 'addressesPreview', 'errorMessage']) if (JSON.stringify(seed).includes(forbidden)) throw new Error(`Seed must not persist ${forbidden}.`);

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-addresses.report.json'))) as { warnings: unknown[]; droppedComponents: unknown[]; unmatchedHtml: unknown[]; };
requireEqual(report.warnings, [], 'parser report contains warnings'); requireEqual(report.droppedComponents, [], 'parser report contains dropped components'); requireEqual(report.unmatchedHtml, [], 'parser report contains unmatched HTML');

const publishedRoute = read(path.join(dndRoot, 'app', 'account', 'addresses', 'page.tsx')); requireText(publishedRoute, 'slug="account-addresses"', 'published addresses slug bridge');

const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puck-addresses-order-'));
try {
  const fixturePath = path.join(temporaryDir, 'AddressesPage.tsx'); const outputPath = path.join(temporaryDir, 'account-addresses.json'); const original = canonicalPage.replace(/\r\n/g, '\n');
  const before = '              sidebar={<AddressesAccountSidebar />}\n              content={<AddressesContentLayout addressManager={<AddressesManagerRegion pageData={pageData} />} />}';
  const after = '              sidebar={<AddressesContentLayout addressManager={<AddressesManagerRegion pageData={pageData} />} />}\n              content={<AddressesAccountSidebar />}';
  if (!original.includes(before)) throw new Error('Unable to create remapped addresses parser fixture.'); fs.writeFileSync(fixturePath, original.replace(before, after), 'utf8');
  let rejected = false;
  try {
    childProcess.execSync(`npx tsx ast-parser.ts "app/account/addresses/page.tsx" "${outputPath}"`, { cwd: templateRoot, env: { ...process.env, ADDRESSES_CANONICAL_SOURCE: fixturePath }, stdio: 'pipe', shell: process.platform === 'win32' ? process.env.ComSpec : undefined });
  } catch {
    rejected = true;
  }
  const rejectedReport = JSON.parse(read(path.join(temporaryDir, '_reports', 'account-addresses.report.json'))) as { fatal: boolean; errors: string[] };
  if (!rejected || fs.existsSync(outputPath) || !rejectedReport.fatal || rejectedReport.errors.length === 0) throw new Error('Parser did not reject an invalid cross-slot addresses composition.');
} finally { fs.rmSync(temporaryDir, { recursive: true, force: true }); }

console.log('Account addresses source-first canonical parity checks passed.');
