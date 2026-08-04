import * as fs from 'fs';
import * as path from 'path';

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const read = (filePath: string) => {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
};
const requireText = (source: string, expected: string, description: string) => {
  if (!source.includes(expected)) throw new Error(`Missing ${description}: ${expected}`);
};

const route = read(path.join(templateRoot, 'app', 'auth', 'page.tsx'));
const layout = read(path.join(templateRoot, 'components', 'auth', 'AuthPageLayout.tsx'));
const state = read(path.join(templateRoot, 'components', 'auth', 'canonical', 'AuthPageState.tsx'));
for (const signature of [
  "import { AuthPageState } from '@/components/auth/canonical/AuthPageState';",
  'searchParams={searchParams}',
  '<AuthPageLayout content={<AuthEntryCard content={siteContent.auth} />} />',
]) requireText(route, signature, 'production auth route signature');
for (const signature of [
  'const session = await auth()',
  'normalizeReturnUrl(searchParams.returnUrl)',
  'redirectTo: session?.user ? returnUrl : null',
  'if (runtime.redirectTo)',
  'redirect(runtime.redirectTo)',
]) requireText(state, signature, 'production auth state signature');
for (const signature of ['min-h-screen bg-bg-base px-4 py-10 text-text-base pt-[112px] @container', 'max-w-[1180px]']) requireText(layout, signature, 'production auth layout signature');

const cardView = read(path.join(dndRoot, 'components', 'auth', 'AuthEntryCardView.tsx'));
requireText(cardView, "@/enigma-components/auth/AuthEntryCard", 'direct production card delegate');
requireText(cardView, '<AuthEntryCard content={siteContent.auth} />', 'production content invocation');
const canonicalRoot = path.join(dndRoot, 'components', 'auth', 'canonical');
requireText(read(path.join(canonicalRoot, 'AuthPageLayoutView.tsx')), 'AuthPageLayout', 'source layout delegate');
const stateView = read(path.join(canonicalRoot, 'AuthPageStateView.tsx'));
const runtime = read(path.join(canonicalRoot, 'authPageRuntime.ts'));
const copiedState = read(path.join(dndRoot, 'enigma-components', 'auth', 'canonical', 'AuthPageState.tsx'));
requireText(stateView, 'puckDataFetcher', 'server data-fetch registration');
requireText(stateView, 'enforceAuthPageRuntime(context)', 'runtime auth delegation');
requireText(stateView, 'return <>{content?.()}</>;', 'slot-only Puck adapter');
if (stateView.includes('previewMode') || stateView.includes('signed-out') || stateView.includes('redirected')) {
  throw new Error('Auth Puck state must not persist or simulate an auth preview state.');
}
for (const signature of [
  'resolveAuthPageRuntime',
  "getSearchParam(context, 'returnUrl')",
  'redirect(runtime.redirectTo)',
]) requireText(runtime, signature, 'Puck auth runtime signature');
for (const signature of [
  'const session = await auth()',
  'normalizeReturnUrl(searchParams.returnUrl)',
  'redirect(runtime.redirectTo)',
]) requireText(copiedState, signature, 'copied production auth state signature');
if (fs.existsSync(path.join(canonicalRoot, 'AuthPageState.tsx'))) {
  throw new Error('Legacy simulated AuthPageState must be removed.');
}

const directRoute = read(path.join(dndRoot, 'app', 'auth', 'page.tsx'));
for (const signature of [
  'AuthPageState',
  'AuthPageLayout',
  'AuthEntryCard',
  'searchParams={searchParams}',
]) requireText(directRoute, signature, 'direct DnD auth bridge signature');

const seed = read(path.join(dndRoot, 'data', 'seeds', 'auth.json'));
for (const type of ['AuthPageState', 'AuthPageLayout', 'AuthEntryCard']) requireText(seed, `"type": "${type}"`, 'canonical auth seed component');
if (seed.includes('"type": "PageWrapper"')) throw new Error('Auth seed must not contain the generic PageWrapper fallback.');
if (seed.includes('"previewMode"') || seed.includes('"signed-out"') || seed.includes('"redirected"')) {
  throw new Error('Auth seed must not persist a simulated auth state.');
}
console.log('Auth canonical parity checks passed.');
