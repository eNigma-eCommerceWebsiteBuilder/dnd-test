import { CheckoutPaymentStepRegion } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';

export const puckComponentName = 'CheckoutPaymentStepRegion';
export const puckLabel = 'Checkout Payment Step';
export const puckCategory = 'Checkout';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['CheckoutPaymentStepRegion', 'CheckoutPaymentStep'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-payment-step',
  runtimeSignals: ['checkout.loading', 'checkout.orderData.email'],
};

export function CheckoutPaymentStepRegionView() {
  return <CheckoutPaymentStepRegion />;
}
