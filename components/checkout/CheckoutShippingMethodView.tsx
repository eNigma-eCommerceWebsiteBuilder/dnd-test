import { CheckoutShippingMethod } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';

export const puckComponentName = 'CheckoutShippingMethod';
export const puckLabel = 'Checkout Shipping Method';
export const puckCategory = 'Checkout';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['CheckoutShippingMethod', 'ShippingMethodSelector'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-shipping-method',
  runtimeSignals: ['checkout.shippingMethods', 'checkout.selectedShippingMethod'],
};

export function CheckoutShippingMethodView() {
  return <CheckoutShippingMethod />;
}
