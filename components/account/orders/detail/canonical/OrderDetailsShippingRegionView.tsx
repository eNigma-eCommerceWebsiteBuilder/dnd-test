import type { Order } from '@/lib/api/types';
import { OrderDetailsShippingRegion } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderDetailsShippingRegion';
export const puckLabel = 'Order Shipping Address';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['OrderDetailsShippingRegion', 'ShippingAddress'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-shipping-region', slotTarget: 'sidebar', runtimeSignals: ['params.id', 'order.shippingAddress'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsShippingRegionView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return order ? <OrderDetailsShippingRegion address={order.shippingAddress} /> : null;
}
