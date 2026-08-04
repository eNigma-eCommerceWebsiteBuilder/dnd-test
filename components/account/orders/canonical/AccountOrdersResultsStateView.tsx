import { AccountOrdersResultsState } from '@/enigma-components/orders/AccountOrdersResultsState';
import { loadAccountOrdersRuntime } from './ordersRuntime';
import { puckTransparentSlotProps, type AccountOrdersSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props {
  hasOrders?: boolean;
  previewMode?: 'runtime' | 'results' | 'empty';
  results?: AccountOrdersSlot;
  empty?: AccountOrdersSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'AccountOrdersResultsState';
export const puckLabel = 'Account Orders Results State';
export const puckCategory = 'Account';
export const puckFields = {
  previewMode: {
    type: 'select' as const,
    label: 'Editor preview state',
    options: [
      { label: 'Orders', value: 'results' },
      { label: 'Empty', value: 'empty' },
    ],
  },
  results: { type: 'slot' as const, allow: ['AccountOrdersList'] },
  empty: { type: 'slot' as const, allow: ['AccountOrdersEmpty'] },
};
export const puckDefaults = { previewMode: 'results', results: [], empty: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['results', 'empty'],
  sourceJsxNames: ['AccountOrdersResultsState', 'OrderList', 'OrderEmpty'],
  sourceImportPaths: [
    '@/components/orders/AccountOrdersResultsState',
    '@/components/orders/OrderList',
    '@/components/orders/OrderEmpty',
  ],
  role: 'account-orders-results-state',
  slotTarget: 'content',
  conditional: 'orders.length > 0',
  runtimeSignals: ['orders.data'],
};

export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) {
  const runtime = await loadAccountOrdersRuntime(context);
  return { hasOrders: runtime.orders.length > 0 };
}

export function AccountOrdersResultsStateView({
  hasOrders,
  previewMode = 'results',
  results,
  empty,
  puck,
}: Props) {
  const resolvedHasOrders = hasOrders ?? (puck?.isEditing ? previewMode === 'results' : false);
  return <AccountOrdersResultsState hasOrders={resolvedHasOrders} results={results?.(puckTransparentSlotProps)} empty={empty?.(puckTransparentSlotProps)} />;
}
