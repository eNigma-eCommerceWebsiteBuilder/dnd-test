import { CheckoutShippingMethodCondition } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';
import { puckTransparentSlotProps, type CheckoutSlot } from './types';

interface Props { content?: CheckoutSlot; }

export const puckComponentName = 'CheckoutShippingMethodCondition';
export const puckLabel = 'Shipping Method Condition';
export const puckCategory = 'Checkout';
export const puckFields = { content: { type: 'slot' as const, allow: ['CheckoutShippingMethod'] } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['content'],
  sourceJsxNames: ['CheckoutShippingMethodCondition', 'ShippingMethodSelector'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-shipping-method-condition',
  conditional: 'Boolean(checkout.shippingAddress)',
  runtimeSignals: ['checkout.shippingAddress'],
};

export function CheckoutShippingMethodConditionView({ content }: Props) {
  return <CheckoutShippingMethodCondition content={content?.(puckTransparentSlotProps)} />;
}
