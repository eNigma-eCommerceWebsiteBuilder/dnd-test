import type { PaymentMethodsPageData } from '@/enigma-components/payment-methods/canonical/paymentMethodsRuntime';
import { PaymentMethodsListRegion } from '@/enigma-components/payment-methods/canonical/PaymentMethodsPageSections';
import { loadPaymentMethodsRuntime } from './paymentMethodsRuntime';
import { resolvePaymentMethodsPageData } from './viewData';

interface Props { pageData?: PaymentMethodsPageData; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'PaymentMethodsListRegion'; export const puckLabel = 'Saved Payment Method List'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['PaymentMethodsListRegion', 'PaymentMethodList'], sourceImportPaths: ['@/components/payment-methods/canonical/PaymentMethodsPageSections'], role: 'payment-methods-list-region', slotTarget: 'list', runtimeSignals: ['customer.paymentMethods'] };
export async function puckDataFetcher() { return loadPaymentMethodsRuntime(); }
export function PaymentMethodsListRegionView(props: Props) { const pageData = resolvePaymentMethodsPageData(props); return pageData ? <PaymentMethodsListRegion pageData={pageData} /> : null; }
