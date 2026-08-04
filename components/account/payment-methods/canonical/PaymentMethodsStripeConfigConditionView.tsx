import type { PaymentMethodsPageData } from '@/enigma-components/payment-methods/canonical/paymentMethodsRuntime';
import { PaymentMethodsStripeConfigCondition } from '@/enigma-components/payment-methods/canonical/PaymentMethodsPageSections';
import { loadPaymentMethodsRuntime } from './paymentMethodsRuntime';
import { puckTransparentSlotProps, type PaymentMethodsSlot } from './types';
import { resolvePaymentMethodsPageData } from './viewData';

interface Props { previewVisible?: boolean; content?: PaymentMethodsSlot; pageData?: PaymentMethodsPageData; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'PaymentMethodsStripeConfigCondition'; export const puckLabel = 'Stripe Card Form Condition'; export const puckCategory = 'Account';
export const puckFields = { previewVisible: { type: 'radio' as const, options: [{ label: 'Configuration available', value: true }, { label: 'Configuration unavailable', value: false }] }, content: { type: 'slot' as const, allow: ['PaymentMethodsStripeCardForm'] } }; export const puckDefaults = { previewVisible: true, content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['PaymentMethodsStripeConfigCondition'], sourceImportPaths: ['@/components/payment-methods/canonical/PaymentMethodsPageSections'], role: 'payment-methods-stripe-config-condition', slotTarget: 'cardForm', conditional: 'stripeConfig', runtimeSignals: ['stripe.config'] };
export async function puckDataFetcher() { return loadPaymentMethodsRuntime(); }
export function PaymentMethodsStripeConfigConditionView(props: Props) { const value = resolvePaymentMethodsPageData(props); if (!value) return null; const pageData = props.puck?.isEditing ? { ...value, stripeConfig: props.previewVisible === false ? null : value.stripeConfig } : value; return <PaymentMethodsStripeConfigCondition pageData={pageData} content={props.content?.(puckTransparentSlotProps)} />; }
