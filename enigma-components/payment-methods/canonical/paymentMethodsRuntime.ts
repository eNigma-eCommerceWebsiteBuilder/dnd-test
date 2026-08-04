import { getPaymentMethods, getStripeConfig } from '@/lib/api/services/payments';
import type { PaymentMethod, StripeConfig } from '@/lib/api/types';

export interface PaymentMethodsPageData {
  paymentMethods: PaymentMethod[];
  stripeConfig: StripeConfig | null;
}

// Keep the route's parallel requests, fallback list, and error propagation intact.
export async function fetchPaymentMethodsPageData(): Promise<PaymentMethodsPageData> {
  let paymentMethods: PaymentMethod[] = [];
  let stripeConfig: StripeConfig | null = null;

  try {
    const [methodsData, configData] = await Promise.all([
      getPaymentMethods(),
      getStripeConfig(),
    ]);
    paymentMethods = methodsData || [];
    stripeConfig = configData;
  } catch (error) {
    console.error('Error fetching payment data:', error);
    throw error;
  }

  return { paymentMethods, stripeConfig };
}
