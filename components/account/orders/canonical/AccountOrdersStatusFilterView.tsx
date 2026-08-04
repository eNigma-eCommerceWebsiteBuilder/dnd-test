import { OrderStatusFilter } from '@/enigma-components/orders/OrderStatusFilter';
import { resolveAccountOrdersPath, resolveAccountOrdersQuery } from './ordersRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props {
  activeStatus?: string;
  basePath?: string;
}

export const puckComponentName = 'AccountOrdersStatusFilter';
export const puckLabel = 'Account Orders Status Filter';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = { activeStatus: undefined, basePath: '/page/account-orders' };
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['OrderStatusFilter'],
  sourceImportPaths: ['@/components/orders/OrderStatusFilter'],
  role: 'account-orders-status-filter',
  slotTarget: 'filters',
  runtimeSignals: ['searchParams.status'],
};

export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) {
  return {
    activeStatus: resolveAccountOrdersQuery(context).status,
    basePath: resolveAccountOrdersPath(context),
  };
}

export function AccountOrdersStatusFilterView({
  activeStatus,
  basePath = '/page/account-orders',
}: Props) {
  return <OrderStatusFilter activeStatus={activeStatus} basePath={basePath} />;
}
