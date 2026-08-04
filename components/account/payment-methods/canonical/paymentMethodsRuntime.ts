import { cache } from 'react';
import { fetchPaymentMethodsPageData, type PaymentMethodsPageData } from '@/enigma-components/payment-methods/canonical/paymentMethodsRuntime';

export interface PaymentMethodsRuntime { pageData: PaymentMethodsPageData; }

const load = cache(async (): Promise<PaymentMethodsRuntime> => ({ pageData: await fetchPaymentMethodsPageData() }));

export function loadPaymentMethodsRuntime(): Promise<PaymentMethodsRuntime> { return load(); }
