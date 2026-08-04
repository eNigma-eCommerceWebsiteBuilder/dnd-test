import type { Order } from '@/lib/api/types';
import { OrderDetailsReorderAction } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'OrderDetailsReorderAction';
export const puckLabel = 'Order Buy Again Action';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['OrderDetailsReorderAction', 'ReorderButton'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-reorder-action', slotTarget: 'reorder', runtimeSignals: ['params.id', 'order.items'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsReorderActionView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return order ? <OrderDetailsReorderAction items={order.items} /> : null;
}
