import { CheckoutReviewSection } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';

export const puckComponentName = 'CheckoutReviewSection';
export const puckLabel = 'Checkout Review';
export const puckCategory = 'Checkout';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['CheckoutReviewSection', 'OrderReview', 'PlaceOrderButton', 'SecureBadges'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-review-section',
  runtimeSignals: ['checkout.orderData', 'checkout.selectedShippingMethod'],
};

export function CheckoutReviewSectionView() {
  return <CheckoutReviewSection />;
}
