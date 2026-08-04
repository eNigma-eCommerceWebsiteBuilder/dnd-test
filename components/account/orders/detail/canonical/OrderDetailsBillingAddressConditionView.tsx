import type { Order } from '@/lib/api/types';
import { OrderDetailsBillingAddressCondition } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { puckTransparentSlotProps, type OrderDetailsSlot } from './types';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { content?: OrderDetailsSlot; order?: Order | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderDetailsBillingAddressCondition';
export const puckLabel = 'Order Billing Address Condition';
export const puckCategory = 'Account';
export const puckFields = { content: { type: 'slot' as const, allow: ['OrderDetailsBillingRegion'] } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime', slots: ['content'], sourceJsxNames: ['OrderDetailsBillingAddressCondition'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-billing-condition', slotTarget: 'sidebar', conditional: 'order.billingAddress', runtimeSignals: ['params.id', 'order.billingAddress'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsBillingAddressConditionView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return order ? <OrderDetailsBillingAddressCondition billingAddress={order.billingAddress} content={props.content?.(puckTransparentSlotProps)} /> : null;
}
