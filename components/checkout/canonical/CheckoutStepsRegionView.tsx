import { CheckoutStepsRegion } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';

export const puckComponentName = 'CheckoutStepsRegion';
export const puckLabel = 'Checkout Steps';
export const puckCategory = 'Checkout';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['CheckoutStepsRegion', 'CheckoutSteps'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-steps',
  runtimeSignals: ['checkout.steps', 'checkout.currentStepId'],
};

export function CheckoutStepsRegionView() {
  return <CheckoutStepsRegion />;
}
