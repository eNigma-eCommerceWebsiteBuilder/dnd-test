import { CheckoutPageHeader } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';

export const puckComponentName = 'CheckoutPageHeader';
export const puckLabel = 'Checkout Header';
export const puckCategory = 'Checkout';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static',
  sourceJsxNames: ['CheckoutPageHeader'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-page-header',
};

export function CheckoutPageHeaderView() {
  return <CheckoutPageHeader />;
}
