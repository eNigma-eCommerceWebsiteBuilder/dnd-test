import { PaymentMethodId, type PaymentMethod, type StripeConfig } from '@/lib/api/types';
import type { PaymentMethodsPageData } from '@/enigma-components/payment-methods/canonical/paymentMethodsRuntime';

const previewMethods: PaymentMethod[] = [{
  id: PaymentMethodId.STRIPE,
  name: 'Preview card',
  enabled: true,
  provider: 'Stripe',
}];

const previewStripeConfig: StripeConfig = { publishableKey: 'pk_test_puck_preview', mode: 'test' };

export const paymentMethodsPreview: PaymentMethodsPageData = {
  paymentMethods: previewMethods,
  stripeConfig: previewStripeConfig,
};
