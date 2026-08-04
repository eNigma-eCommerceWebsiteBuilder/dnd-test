import { CheckoutOrderSummaryPanel } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';

export const puckComponentName = 'CheckoutOrderSummaryPanel';
export const puckLabel = 'Checkout Order Summary';
export const puckCategory = 'Checkout';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['CheckoutOrderSummaryPanel', 'OrderSummary'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-order-summary',
  runtimeSignals: ['cart.items', 'checkout.selectedShippingMethod'],
};

export function CheckoutOrderSummaryPanelView() {
  return <CheckoutOrderSummaryPanel />;
}
