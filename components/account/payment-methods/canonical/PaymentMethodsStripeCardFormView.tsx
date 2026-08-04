import type { PaymentMethodsPageData } from '@/enigma-components/payment-methods/canonical/paymentMethodsRuntime';
import { PaymentMethodsStripeCardForm } from '@/enigma-components/payment-methods/canonical/PaymentMethodsPageSections';
import { loadPaymentMethodsRuntime } from './paymentMethodsRuntime';
import { resolvePaymentMethodsPageData } from './viewData';

interface Props { pageData?: PaymentMethodsPageData; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'PaymentMethodsStripeCardForm'; export const puckLabel = 'Stripe Card Form'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['PaymentMethodsStripeCardForm', 'StripeCardForm'], sourceImportPaths: ['@/components/payment-methods/canonical/PaymentMethodsPageSections'], role: 'payment-methods-stripe-card-form', slotTarget: 'content', runtimeSignals: ['stripe.config'] };
export async function puckDataFetcher() { return loadPaymentMethodsRuntime(); }
export function PaymentMethodsStripeCardFormView(props: Props) { const pageData = resolvePaymentMethodsPageData(props); return pageData ? <PaymentMethodsStripeCardForm pageData={pageData} /> : null; }
