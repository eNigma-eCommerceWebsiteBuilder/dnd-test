import type { PaymentMethodsPageData } from '@/enigma-components/payment-methods/canonical/paymentMethodsRuntime';
import { paymentMethodsPreview } from './preview';

export interface PaymentMethodsRuntimeProps { pageData?: PaymentMethodsPageData; puck?: { isEditing?: boolean }; }

export function resolvePaymentMethodsPageData({ pageData, puck }: PaymentMethodsRuntimeProps): PaymentMethodsPageData | null {
  return puck?.isEditing ? paymentMethodsPreview : pageData ?? null;
}
