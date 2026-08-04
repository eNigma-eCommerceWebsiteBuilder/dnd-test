import { CheckoutShippingSection } from '@/enigma-components/templates/checkout/canonical/CheckoutPageRegions';
import { puckTransparentSlotProps, type CheckoutSlot } from './types';

interface Props { form?: CheckoutSlot; shippingMethod?: CheckoutSlot; }

export const puckComponentName = 'CheckoutShippingSection';
export const puckLabel = 'Checkout Shipping Section';
export const puckCategory = 'Checkout';
export const puckFields = {
  form: { type: 'slot' as const, allow: ['CheckoutShippingForm'] },
  shippingMethod: { type: 'slot' as const, allow: ['CheckoutShippingMethodCondition'] },
};
export const puckDefaults = { form: [], shippingMethod: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['form', 'shippingMethod'],
  sourceJsxNames: ['CheckoutShippingSection', 'ShippingForm', 'ShippingMethodSelector'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageRegions'],
  role: 'checkout-shipping-section',
  conditional: 'checkout.currentStepId === CART || checkout.currentStepId === SHIPPING',
  runtimeSignals: ['checkout.currentStepId'],
};

export function CheckoutShippingSectionView({ form, shippingMethod }: Props) {
  return (
    <CheckoutShippingSection
      form={form?.(puckTransparentSlotProps)}
      shippingMethod={shippingMethod?.(puckTransparentSlotProps)}
    />
  );
}
