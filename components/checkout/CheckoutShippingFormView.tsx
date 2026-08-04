import { CheckoutShippingForm } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';

export const puckComponentName = 'CheckoutShippingForm';
export const puckLabel = 'Checkout Shipping Form';
export const puckCategory = 'Checkout';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['CheckoutShippingForm', 'ShippingForm'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-shipping-form',
  runtimeSignals: ['checkout.shippingAddress', 'checkout.loading'],
};

export function CheckoutShippingFormView() {
  return <CheckoutShippingForm />;
}
