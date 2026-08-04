import type { ReactNode } from 'react';
import { CheckoutErrorCondition } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';
import { puckTransparentSlotProps, type CheckoutSlot } from './types';

interface Props { content?: CheckoutSlot; }

export const puckComponentName = 'CheckoutErrorCondition';
export const puckLabel = 'Checkout Error Condition';
export const puckCategory = 'Checkout';
export const puckFields = { content: { type: 'slot' as const } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['content'],
  sourceJsxNames: ['CheckoutErrorCondition', 'CheckoutErrorAlert'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-error-condition',
  conditional: 'Boolean(checkout.error)',
  runtimeSignals: ['checkout.error'],
};

export function CheckoutErrorConditionView({ content }: Props) {
  return <CheckoutErrorCondition content={content?.(puckTransparentSlotProps) as ReactNode} />;
}
