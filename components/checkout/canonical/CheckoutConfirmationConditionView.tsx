import { CheckoutConfirmationCondition } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';
import { puckTransparentSlotProps, type CheckoutSlot } from './types';

interface Props { content?: CheckoutSlot; }

export const puckComponentName = 'CheckoutConfirmationCondition';
export const puckLabel = 'Checkout Confirmation Condition';
export const puckCategory = 'Checkout';
export const puckFields = { content: { type: 'slot' as const } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['content'],
  sourceJsxNames: ['CheckoutConfirmationCondition', 'CheckoutConfirmation'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-confirmation-condition',
  conditional: 'checkout.currentStepId === CONFIRMATION',
  runtimeSignals: ['checkout.currentStepId', 'checkout.orderId'],
};

export function CheckoutConfirmationConditionView({ content }: Props) {
  return <CheckoutConfirmationCondition content={content?.(puckTransparentSlotProps)} />;
}
