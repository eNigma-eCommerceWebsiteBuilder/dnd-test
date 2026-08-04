import type { Order } from '@/lib/api/types';
import { OrderDetailsCancelAction } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'OrderDetailsCancelAction';
export const puckLabel = 'Order Cancel Action';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['OrderDetailsCancelAction', 'CancelOrderButton'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-cancel-action', slotTarget: 'cancel', runtimeSignals: ['params.id', 'order._id'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsCancelActionView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return order ? <OrderDetailsCancelAction orderId={order._id} /> : null;
}
