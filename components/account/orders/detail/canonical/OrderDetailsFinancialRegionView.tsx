import type { Order } from '@/lib/api/types';
import { OrderDetailsFinancialRegion } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderDetailsFinancialRegion';
export const puckLabel = 'Order Financial Details';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['OrderDetailsFinancialRegion', 'OrderDetails'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-financial-region', slotTarget: 'primary', runtimeSignals: ['params.id', 'order.subtotal', 'order.total'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsFinancialRegionView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return order ? <OrderDetailsFinancialRegion order={order} /> : null;
}
