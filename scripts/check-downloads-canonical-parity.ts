import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');

function read(filePath: string): string {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireText(source: string, expected: string, description: string) {
  if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`);
}

function collectProps(value: unknown, props: Set<string>) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectProps(item, props));
    return;
  }

  if (!value || typeof value !== 'object') return;
  const record = value as Record<string, unknown>;
  if (record.props && typeof record.props === 'object' && !Array.isArray(record.props)) {
    Object.keys(record.props as Record<string, unknown>).forEach((key) => props.add(key));
  }
  Object.values(record).forEach((child) => collectProps(child, props));
}

const routePath = path.join(templateRoot, 'app', 'downloads', '[key]', 'page.tsx');
const productionPagePath = path.join(templateRoot, 'components', 'templates', 'downloads', 'DownloadPage.tsx');
const productionSectionsPath = path.join(templateRoot, 'components', 'templates', 'downloads', 'DownloadPageSections.tsx');
const parserPath = path.join(templateRoot, 'ast-parser.ts');
const canonicalRoot = path.join(dndRoot, 'components', 'downloads', 'canonical');
const seedPath = path.join(dndRoot, 'data', 'seeds', 'downloads.json');
const reportPath = path.join(dndRoot, 'data', 'seeds', '_reports', 'downloads.report.json');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const directRoutePath = path.join(dndRoot, 'app', 'downloads', '[key]', 'page.tsx');
const legacyViewPath = path.join(dndRoot, 'components', 'downloads', 'DownloadLicenseStateSectionView.tsx');

const route = read(routePath);
const productionPage = read(productionPagePath);
const productionSections = read(productionSectionsPath);

for (const signature of [
  'const licenseInfo = await fetchLicenseInfo(key)',
  '<DownloadPage licenseKey={key} licenseInfo={licenseInfo} />',
]) requireText(route, signature, 'production route signature');
for (const signature of [
  '<DownloadPageLayout',
  'header={<DownloadPageHeader />}',
  '<DownloadPageContentLayout',
  '<ExpirationNotice licenseInfo={licenseInfo} />',
  '<DownloadAssetState licenseInfo={licenseInfo} licenseKey={licenseKey} />',
  '<LicenseInfoPanel initialLicenseInfo={licenseInfo} licenseKey={licenseKey} />',
  '<DownloadTrustFooter />',
]) requireText(productionPage, signature, 'production page composition');
for (const signature of [
  'export function DownloadPageLayout',
  'export function DownloadPageHeader',
  'export function DownloadPageContentLayout',
  'export function DownloadAssetState',
  'export function DownloadTrustFooter',
  '!licenseInfo || !isValid || !hasRemaining',
  '<InvalidLicense licenseKey={licenseKey} />',
  '<LicenseValidation licenseInfo={licenseInfo} />',
  '<DownloadButton licenseKey={licenseKey} />',
]) requireText(productionSections, signature, 'production section signature');

const views = new Map([
  ['DownloadPageLayoutView.tsx', 'DownloadPageLayout'],
  ['DownloadPageHeaderView.tsx', 'DownloadPageHeader'],
  ['DownloadPageContentLayoutView.tsx', 'DownloadPageContentLayout'],
  ['DownloadAssetStateView.tsx', 'DownloadAssetState'],
  ['DownloadExpirationNoticeView.tsx', 'ExpirationNotice'],
  ['DownloadLicenseInfoPanelView.tsx', 'LicenseInfoPanel'],
  ['DownloadTrustFooterView.tsx', 'DownloadTrustFooter'],
]);
for (const [file, expected] of views) {
  requireText(read(path.join(canonicalRoot, file)), expected, `${file} direct source delegate`);
}

const runtime = read(path.join(canonicalRoot, 'downloadRuntime.ts'));
for (const expected of ['getRouteParam(context, \'key\')', 'getLicenseInfo(licenseKey)']) {
  requireText(runtime, expected, 'route-aware download runtime');
}
for (const forbidden of ['getSearchParam', 'puckPreview', 'downloadPreview']) {
  if (runtime.includes(forbidden)) {
    throw new Error(`Download runtime still contains prototype preview behavior: ${forbidden}`);
  }
}
for (const file of [
  'DownloadAssetStateView.tsx',
  'DownloadExpirationNoticeView.tsx',
  'DownloadLicenseInfoPanelView.tsx',
]) {
  const source = read(path.join(canonicalRoot, file));
  requireText(source, 'puck?.isEditing', `${file} editor-only fixture boundary`);
  requireText(source, 'downloadPreview', `${file} preview fixture use`);
}

if (fs.existsSync(legacyViewPath)) {
  throw new Error('Legacy DownloadLicenseStateSection replacement view must be removed.');
}

const parser = read(parserPath);
requireText(parser, 'runPuckAstParser', 'generic JSX parser entry point');
if (parser.includes('adaptDownloadPage')) throw new Error('Downloads must not use a fixed route emitter.');
if (parser.includes("download-asset-state', { previewMode")) {
  throw new Error('Downloads parser still persists a Puck preview mode.');
}

requireText(read(directRoutePath), 'slug="downloads"', 'direct downloads published route bridge');
requireText(read(directRoutePath), 'routeParams={{ slug: \'downloads\', key }}', 'direct downloads route metadata');

const manifest = JSON.parse(read(manifestPath)) as {
  components?: Array<{ type?: string; ast?: Record<string, unknown> }>;
};
for (const [component, sourceImport] of [
  ['DownloadPageLayout', '@/components/templates/downloads/DownloadPage'],
  ['DownloadAssetState', '@/components/templates/downloads/DownloadPageSections'],
] as Array<[string, string]>) {
  const entry = manifest.components?.find((candidate) => candidate.type === component);
  if (!entry) throw new Error(`Missing manifest component: ${component}`);
  const sourceImports = entry.ast?.sourceImportPaths;
  if (!Array.isArray(sourceImports) || !sourceImports.includes(sourceImport)) {
    throw new Error(`Manifest provenance mismatch for ${component}.`);
  }
}
if (manifest.components?.some((component) => component.type === 'DownloadLicenseStateSection')) {
  throw new Error('Manifest must not include the removed DownloadLicenseStateSection replacement.');
}

const seed = JSON.parse(read(seedPath));
const seedText = JSON.stringify(seed);
for (const type of [
  'DownloadPageLayout',
  'DownloadPageHeader',
  'DownloadPageContentLayout',
  'DownloadExpirationNotice',
  'DownloadAssetState',
  'DownloadLicenseInfoPanel',
  'DownloadTrustFooter',
]) requireText(seedText, `"type":"${type}"`, `seed ${type} region`);
const persistedProps = new Set<string>();
collectProps(seed, persistedProps);
for (const forbidden of ['previewMode', 'licenseKey', 'licenseInfo', 'state']) {
  if (persistedProps.has(forbidden)) {
    throw new Error(`Downloads seed must not persist preview or runtime data: ${forbidden}`);
  }
}
for (const forbidden of ['DownloadLicenseStateSection', 'PREVIEW-LICENSE-KEY-1001']) {
  if (seedText.includes(forbidden)) {
    throw new Error(`Downloads seed contains a replacement or preview fixture: ${forbidden}`);
  }
}

const report = JSON.parse(read(reportPath)) as {
  droppedComponents?: string[];
  warnings?: string[];
  unmatchedHtml?: string[];
  runtimeConditionals?: Array<{ source?: string; handledBy?: string }>;
};
if ((report.droppedComponents ?? []).length > 0 || (report.warnings ?? []).length > 0 || (report.unmatchedHtml ?? []).length > 0) {
  throw new Error(`Downloads parser diagnostics are not clean: ${JSON.stringify(report)}`);
}
if (!report.runtimeConditionals?.some((condition) =>
  condition.source === '!licenseInfo || !isValid || !hasRemaining'
  && condition.handledBy === 'DownloadAssetState'
)) {
  throw new Error('Downloads diagnostics do not record the production invalid-license condition.');
}

console.log('Downloads source-first canonical parity checks passed.');
