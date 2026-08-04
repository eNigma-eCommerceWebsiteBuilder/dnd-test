import type { Order } from '@/lib/api/types';
import { OrderDetailsItemsRegion } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderDetailsItemsRegion';
export const puckLabel = 'Order Items Region';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['OrderDetailsItemsRegion', 'OrderItemList'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-items-region', slotTarget: 'primary', runtimeSignals: ['params.id', 'order.items'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsItemsRegionView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return order ? <OrderDetailsItemsRegion items={order.items} /> : null;
}
