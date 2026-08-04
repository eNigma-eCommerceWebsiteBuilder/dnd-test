import { CheckoutPaymentCondition } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';
import { puckTransparentSlotProps, type CheckoutSlot } from './types';

interface Props { content?: CheckoutSlot; }

export const puckComponentName = 'CheckoutPaymentCondition';
export const puckLabel = 'Checkout Payment Condition';
export const puckCategory = 'Checkout';
export const puckFields = { content: { type: 'slot' as const, allow: ['CheckoutPaymentStepRegion'] } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['content'],
  sourceJsxNames: ['CheckoutPaymentCondition', 'CheckoutPaymentStep'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-payment-condition',
  conditional: 'checkout.currentStepId === PAYMENT',
  runtimeSignals: ['checkout.currentStepId'],
};

export function CheckoutPaymentConditionView({ content }: Props) {
  return <CheckoutPaymentCondition content={content?.(puckTransparentSlotProps)} />;
}
