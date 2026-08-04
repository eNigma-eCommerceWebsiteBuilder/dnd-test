import type { Order } from '@/lib/api/types';
import { OrderDetailsPaymentRegion } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderDetailsPaymentRegion';
export const puckLabel = 'Order Payment Information';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['OrderDetailsPaymentRegion', 'PaymentInfo'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-payment-region', slotTarget: 'sidebar', runtimeSignals: ['params.id', 'order.paymentMethod', 'order.paymentStatus'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsPaymentRegionView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return order ? <OrderDetailsPaymentRegion order={order} /> : null;
}
