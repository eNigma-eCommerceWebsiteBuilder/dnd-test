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

const route = read(path.join(templateRoot, 'app', 'account', 'orders', 'page.tsx'));
for (const signature of [
  'const params = await searchParams',
  "const statusFilter = params.status || undefined",
  "const page = parseInt(params.page || '1', 10)",
  "const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const",
  'ordersData = await getMyOrders({',
  'limit: 10,',
  'const orders = ordersData?.data || []',
  'const pagination = ordersData?.pagination ||',
  '<AccountOrdersLayout',
  'header={<AccountOrdersHeader />}',
  'filters={<OrderStatusFilter activeStatus={status} />}',
  '<AccountOrdersResultsState',
  'hasOrders={orders.length > 0}',
  '<OrderList',
  'empty={<OrderEmpty />}',
]) {
  requireText(route, signature, 'production account-orders route signature');
}

const componentNames = [
  'AccountOrdersLayout',
  'AccountOrdersHeader',
  'AccountOrdersResultsState',
  'OrderStatusFilter',
  'OrderList',
  'OrderEmpty',
  'OrderCard',
];
for (const component of componentNames) {
  const production = read(path.join(templateRoot, 'components', 'orders', `${component}.tsx`));
  const testbed = read(path.join(dndRoot, 'enigma-components', 'orders', `${component}.tsx`));
  if (production.trim() !== testbed.trim()) {
    throw new Error(`${component} has drifted between TemplateFrontend and the DnD source-compatible copy.`);
  }
}

const resultsState = read(path.join(templateRoot, 'components', 'orders', 'AccountOrdersResultsState.tsx'));
requireText(resultsState, 'return hasOrders ? <>{results}</> : <>{empty}</>;', 'source-owned results condition');

for (const component of ['OrderStatusFilter', 'OrderList']) {
  const source = read(path.join(templateRoot, 'components', 'orders', `${component}.tsx`));
  requireText(source, "basePath = '/account/orders'", `${component} production default route`);
  requireText(source, 'router.push(`${basePath}?${params.toString()}`)', `${component} Puck-compatible navigation`);
}
requireText(
  read(path.join(templateRoot, 'components', 'orders', 'OrderStatusFilter.tsx')),
  "params.delete('page')",
  'status filter page-reset behavior',
);
requireText(
  read(path.join(templateRoot, 'components', 'orders', 'OrderList.tsx')),
  'pagination.totalPages > 1',
  'list pagination condition',
);

const canonicalRoot = path.join(dndRoot, 'components', 'account', 'orders', 'canonical');
const delegates = [
  ['AccountOrdersLayoutView.tsx', '@/enigma-components/orders/AccountOrdersLayout', '<AccountOrdersLayout'],
  ['AccountOrdersHeaderView.tsx', '@/enigma-components/orders/AccountOrdersHeader', '<AccountOrdersHeader'],
  ['AccountOrdersStatusFilterView.tsx', '@/enigma-components/orders/OrderStatusFilter', '<OrderStatusFilter'],
  ['AccountOrdersResultsStateView.tsx', '@/enigma-components/orders/AccountOrdersResultsState', '<AccountOrdersResultsState'],
  ['AccountOrdersListView.tsx', '@/enigma-components/orders/OrderList', '<OrderList'],
  ['AccountOrdersEmptyView.tsx', '@/enigma-components/orders/OrderEmpty', '<OrderEmpty'],
];
for (const [file, importPath, invocation] of delegates) {
  const view = read(path.join(canonicalRoot, file));
  requireText(view, importPath, `${file} source delegate import`);
  requireText(view, invocation, `${file} source delegate invocation`);
}

for (const file of [
  'AccountOrdersStateView.tsx',
  'AccountOrdersLayoutView.tsx',
  'AccountOrdersResultsStateView.tsx',
]) {
  const view = read(path.join(canonicalRoot, file));
  requireText(view, 'puckTransparentSlotProps', `${file} transparent slot handling`);
  requireText(view, '?.(puckTransparentSlotProps)', `${file} source-direct slot rendering`);
}

const runtime = read(path.join(canonicalRoot, 'ordersRuntime.ts'));
for (const signature of [
  "['pending', 'processing', 'shipped', 'delivered', 'cancelled']",
  "Number.parseInt(getSearchParam(context, 'page') || '1', 10)",
  'getMyOrders(',
  '{ page, limit: 10, status:',
  '{ cookies: requestCookies }',
  'error.status === 401',
  'redirect(buildPublishedPuckAuthPath(resolveAccountOrdersReturnUrl(context)))',
]) {
  requireText(runtime, signature, 'Puck orders runtime signature');
}

const configGenerator = read(path.join(dndRoot, 'scripts', 'generate-puck-config.ts'));
requireText(
  configGenerator,
  "if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;",
  'Puck server redirect propagation',
);

const manifest = JSON.parse(read(path.join(dndRoot, 'lib', 'puck-ast-manifest.json'))) as {
  components: Array<{ type: string; ast?: { role?: string } }>;
};
const expectedRoles = [
  'account-orders-layout',
  'account-orders-header',
  'account-orders-status-filter',
  'account-orders-results-state',
  'account-orders-list',
  'account-orders-empty',
];
for (const role of expectedRoles) {
  if (!manifest.components.some((component) => component.ast?.role === role)) {
    throw new Error(`Puck AST manifest is missing account-orders role: ${role}`);
  }
}

type SeedNode = { type: string; props: Record<string, unknown> };
const seed = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', 'account-orders.json'))) as {
  content: SeedNode[];
};
requireEqual(seed.content.map((node) => node.type), ['AccountOrdersLayout'], 'top-level seed structure differs');
const layout = seed.content[0];
requireEqual((layout.props.header as SeedNode[]).map((node) => node.type), ['AccountOrdersHeader'], 'header slot differs');
requireEqual((layout.props.filters as SeedNode[]).map((node) => node.type), ['AccountOrdersStatusFilter'], 'filters slot differs');
const results = (layout.props.content as SeedNode[])[0];
requireEqual(results.type, 'AccountOrdersResultsState', 'layout content is not the source-owned results state');
requireEqual((results.props.results as SeedNode[]).map((node) => node.type), ['AccountOrdersList'], 'results slot differs');
requireEqual((results.props.empty as SeedNode[]).map((node) => node.type), ['AccountOrdersEmpty'], 'empty slot differs');

const serializedSeed = JSON.stringify(seed);
for (const forbidden of ['PageWrapper', 'PageHeader', 'AccountOrdersStateSection']) {
  if (serializedSeed.includes(`"type":"${forbidden}"`)) {
    throw new Error(`Seed contains obsolete generic or replacement component: ${forbidden}`);
  }
}

const report = JSON.parse(read(path.join(dndRoot, 'data', 'seeds', '_reports', 'account-orders.report.json'))) as {
  warnings: unknown[];
  droppedComponents: unknown[];
  unmatchedHtml: unknown[];
};
requireEqual(report.warnings, [], 'parser report contains warnings');
requireEqual(report.droppedComponents, [], 'parser report contains dropped components');
requireEqual(report.unmatchedHtml, [], 'parser report contains unmatched HTML');

console.log('Account orders canonical parity checks passed.');
