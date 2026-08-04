import { CheckoutReviewCondition } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';
import { puckTransparentSlotProps, type CheckoutSlot } from './types';

interface Props { content?: CheckoutSlot; }

export const puckComponentName = 'CheckoutReviewCondition';
export const puckLabel = 'Checkout Review Condition';
export const puckCategory = 'Checkout';
export const puckFields = { content: { type: 'slot' as const, allow: ['CheckoutReviewSection'] } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['content'],
  sourceJsxNames: ['CheckoutReviewCondition', 'OrderReview', 'PlaceOrderButton', 'SecureBadges'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-review-condition',
  conditional: 'checkout.currentStepId === REVIEW && Boolean(checkout.shippingAddress)',
  runtimeSignals: ['checkout.currentStepId', 'checkout.shippingAddress'],
};

export function CheckoutReviewConditionView({ content }: Props) {
  return <CheckoutReviewCondition content={content?.(puckTransparentSlotProps)} />;
}
