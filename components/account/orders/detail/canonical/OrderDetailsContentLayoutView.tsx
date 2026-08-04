import { OrderDetailsContentLayout } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { puckTransparentSlotProps, type OrderDetailsSlot } from './types';

interface Props { primary?: OrderDetailsSlot; sidebar?: OrderDetailsSlot; }

export const puckComponentName = 'OrderDetailsContentLayout';
export const puckLabel = 'Order Details Content Layout';
export const puckCategory = 'Account';
export const puckFields = {
  primary: { type: 'slot' as const, allow: ['OrderDetailsItemsRegion', 'OrderDetailsFinancialRegion'] },
  sidebar: { type: 'slot' as const, allow: ['OrderDetailsShippingRegion', 'OrderDetailsBillingAddressCondition', 'OrderDetailsPaymentRegion'] },
};
export const puckDefaults = { primary: [], sidebar: [] };
export const puckAst = {
  kind: 'static', slots: ['primary', 'sidebar'], sourceJsxNames: ['OrderDetailsContentLayout'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-content-layout', slotTarget: 'content', parentSignature: 'OrderDetailsPageLayout > OrderDetailsContentLayout',
  requiredClasses: ['lg:grid-cols-12', 'lg:col-span-7', 'lg:col-span-5'],
};
export function OrderDetailsContentLayoutView({ primary, sidebar }: Props) {
  return <OrderDetailsContentLayout primary={primary?.(puckTransparentSlotProps)} sidebar={sidebar?.(puckTransparentSlotProps)} />;
}
