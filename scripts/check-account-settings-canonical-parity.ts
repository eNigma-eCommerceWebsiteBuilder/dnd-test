import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');

function read(filePath: string): string {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireText(source: string, expected: string, description: string): void {
  if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`);
}

function requireEqual(actual: unknown, expected: unknown, description: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${description}. Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}

const route = read(path.join(templateRoot, 'app', 'account', 'settings', 'page.tsx'));
for (const signature of [
  'const session = await auth()',
  "[session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(' ')",
  'session?.user?.name ||',
  '<AccountSettingsLayout',
  'breadcrumbs={<AccountSettingsBreadcrumbs />}',
  '<AccountIdentitySettingsCard',
  'explanation={<AccountIdentityExplanation />}',
  '<AccountIdentitySessionDetails',
  'emailVerified={session?.user?.emailVerified}',
]) {
  requireText(route, signature, 'production account-settings route signature');
}

const sourceComponents = [
  'AccountSettingsLayout',
  'AccountSettingsBreadcrumbs',
  'AccountIdentitySettingsCard',
  'AccountIdentityExplanation',
  'AccountIdentitySessionDetails',
];
for (const component of sourceComponents) {
  const production = read(path.join(templateRoot, 'components', 'account', `${component}.tsx`));
  const testbed = read(path.join(dndRoot, 'enigma-components', 'account', `${component}.tsx`));
  if (production.trim() !== testbed.trim()) {
    throw new Error(`${component} has drifted between TemplateFrontend and the DnD source-compatible copy.`);
  }
}

const details = read(path.join(templateRoot, 'components', 'account', 'AccountIdentitySessionDetails.tsx'));
requireText(details, 'emailVerified', 'source-owned verification condition');
requireText(details, 'Your identity provider has marked this email as verified.', 'verified branch');
requireText(details, 'Verification is controlled by the identity provider', 'externally managed branch');

const canonicalRoot = path.join(dndRoot, 'components', 'account', 'canonical');
const delegates = [
  ['AccountSettingsLayoutView.tsx', '@/enigma-components/account/AccountSettingsLayout', '<AccountSettingsLayout'],
  ['AccountSettingsBreadcrumbsView.tsx', '@/enigma-components/account/AccountSettingsBreadcrumbs', '<AccountSettingsBreadcrumbs'],
  ['AccountIdentitySettingsCardView.tsx', '@/enigma-components/account/AccountIdentitySettingsCard', '<AccountIdentitySettingsCard'],
  ['AccountIdentityExplanationView.tsx', '@/enigma-components/account/AccountIdentityExplanation', '<AccountIdentityExplanation'],
  ['AccountIdentitySessionDetailsView.tsx', '@/enigma-components/account/AccountIdentitySessionDetails', '<AccountIdentitySessionDetails'],
];
for (const [file, importPath, invocation] of delegates) {
  const view = read(path.join(canonicalRoot, file));
  requireText(view, importPath, `${file} source delegate import`);
  requireText(view, invocation, `${file} source delegate invocation`);
}

for (const file of [
  'AccountSettingsStateView.tsx',
  'AccountSettingsLayoutView.tsx',
  'AccountIdentitySettingsCardView.tsx',
]) {
  const view = read(path.join(canonicalRoot, file));
  requireText(view, 'puckTransparentSlotProps', `${file} transparent slot handling`);
  requireText(view, '?.(puckTransparentSlotProps)', `${file} source-direct slot rendering`);
}

const sessionDetailsView = read(path.join(canonicalRoot, 'AccountIdentitySessionDetailsView.tsx'));
requireText(sessionDetailsView, "import { auth } from '@/auth'", 'published session loader');
requireText(sessionDetailsView, 'const session = await auth()', 'source session lookup');
requireText(sessionDetailsView, "'Customer'", 'source display-name fallback');
requireText(sessionDetailsView, 'runtimeSession ?? { fullName, email, emailVerified }', 'editor-only session preview fallback');

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as {
  components: Array<{ type: string; ast?: { role?: string } }>;
};
const expectedRoles = [
  'account-settings-layout',
  'account-settings-breadcrumbs',
  'account-identity-settings-card',
  'account-identity-explanation',
  'account-identity-session-details',
];
for (const role of expectedRoles) {
  if (!manifest.components.some((component) => component.ast?.role === role)) {
    throw new Error(`Puck AST manifest is missing account-settings role: ${role}`);
  }
}

type SeedNode = { type: string; props: Record<string, unknown> };
const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-settings.json'))) as {
  content: SeedNode[];
};
requireEqual(seed.content.map((node) => node.type), ['AccountSettingsLayout'], 'top-level seed structure differs');
const layout = seed.content[0];
requireEqual((layout.props.breadcrumbs as SeedNode[]).map((node) => node.type), ['AccountSettingsBreadcrumbs'], 'breadcrumb slot differs');
const card = (layout.props.content as SeedNode[])[0];
requireEqual(card.type, 'AccountIdentitySettingsCard', 'layout content is not the identity card');
requireEqual((card.props.explanation as SeedNode[]).map((node) => node.type), ['AccountIdentityExplanation'], 'explanation slot differs');
requireEqual((card.props.details as SeedNode[]).map((node) => node.type), ['AccountIdentitySessionDetails'], 'details slot differs');

const serializedSeed = JSON.stringify(seed);
for (const forbidden of ['AccountSettingsStateSection', 'AccountSettingsViews']) {
  if (serializedSeed.includes(forbidden)) throw new Error(`Seed contains obsolete replacement component: ${forbidden}`);
}

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-settings.report.json'))) as {
  warnings: unknown[];
  droppedComponents: unknown[];
  unmatchedHtml: unknown[];
};
requireEqual(report.warnings, [], 'parser report contains warnings');
requireEqual(report.droppedComponents, [], 'parser report contains dropped components');
requireEqual(report.unmatchedHtml, [], 'parser report contains unmatched HTML');

console.log('Account settings canonical parity checks passed.');
