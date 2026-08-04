import type { Order } from '@/lib/api/types';
import { OrderList } from '@/enigma-components/orders/OrderList';
import { accountOrdersPreview, loadAccountOrdersRuntime, resolveAccountOrdersPath } from './ordersRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props {
  initialOrders?: Order[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statusFilter?: string;
  basePath?: string;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'AccountOrdersList';
export const puckLabel = 'Account Orders List';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {
  initialOrders: [],
  initialPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  statusFilter: undefined,
  basePath: '/page/account-orders',
};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['OrderList'],
  sourceImportPaths: ['@/components/orders/OrderList'],
  role: 'account-orders-list',
  slotTarget: 'results',
  conditional: 'pagination.totalPages > 1',
  runtimeSignals: ['orders.data', 'orders.pagination', 'searchParams.status', 'searchParams.page'],
};

export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) {
  const runtime = await loadAccountOrdersRuntime(context);
  return {
    initialOrders: runtime.orders,
    initialPagination: runtime.pagination,
    statusFilter: runtime.status,
    basePath: resolveAccountOrdersPath(context),
  };
}

export function AccountOrdersListView({
  initialOrders,
  initialPagination,
  statusFilter,
  basePath = '/page/account-orders',
  puck,
}: Props) {
  const usingEditorPreview = puck?.isEditing === true;
  return (
    <OrderList
      initialOrders={usingEditorPreview ? accountOrdersPreview.orders : initialOrders ?? []}
      initialPagination={usingEditorPreview ? accountOrdersPreview.pagination : initialPagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 }}
      statusFilter={statusFilter}
      basePath={basePath}
    />
  );
}
