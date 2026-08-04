import type { Order } from '@/lib/api/types';
import { OrderDetailsBreadcrumbs } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'OrderDetailsBreadcrumbs';
export const puckLabel = 'Order Details Breadcrumbs';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['OrderDetailsBreadcrumbs'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-breadcrumbs', slotTarget: 'breadcrumbs', runtimeSignals: ['params.id', 'order.orderNumber'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsBreadcrumbsView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return order ? <OrderDetailsBreadcrumbs order={order} /> : null;
}
