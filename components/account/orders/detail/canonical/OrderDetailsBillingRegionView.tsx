import type { Order } from '@/lib/api/types';
import { OrderDetailsBillingRegion } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderDetailsBillingRegion';
export const puckLabel = 'Order Billing Address';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['OrderDetailsBillingRegion', 'BillingAddress'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-billing-region', slotTarget: 'content', runtimeSignals: ['params.id', 'order.billingAddress'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsBillingRegionView(props: Props) {
  const address = resolveOrderDetailsOrder(props)?.billingAddress;
  return address ? <OrderDetailsBillingRegion address={address} /> : null;
}
