import type { PaymentMethodsPageData } from '@/enigma-components/payment-methods/canonical/paymentMethodsRuntime';
import { PaymentMethodsPageState } from '@/enigma-components/payment-methods/canonical/PaymentMethodsPageState';
import { loadPaymentMethodsRuntime } from './paymentMethodsRuntime';
import { puckTransparentSlotProps, type PaymentMethodsSlot } from './types';
import { resolvePaymentMethodsPageData } from './viewData';

interface Props { content?: PaymentMethodsSlot; pageData?: PaymentMethodsPageData; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'PaymentMethodsPageState';
export const puckLabel = 'Payment Methods Page State';
export const puckCategory = 'Account';
export const puckFields = { content: { type: 'slot' as const, allow: ['PaymentMethodsPageLayout'] } };
export const puckDefaults = { content: [] };
export const puckAst = { kind: 'runtime', topLevel: true, slots: ['content'], sourceJsxNames: ['PaymentMethodsPageState'], sourceImportPaths: ['@/components/payment-methods/canonical/PaymentMethodsPageState'], role: 'payment-methods-page-state', runtimeSignals: ['customer.paymentMethods', 'stripe.config'] };
export async function puckDataFetcher() { return loadPaymentMethodsRuntime(); }
export function PaymentMethodsPageStateView(props: Props) {
  const pageData = resolvePaymentMethodsPageData(props);
  return pageData ? <PaymentMethodsPageState pageData={pageData} content={props.content?.(puckTransparentSlotProps)} /> : null;
}
