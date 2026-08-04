import { PaymentMethodsPageLayout } from '@/enigma-components/payment-methods/canonical/PaymentMethodsPageSections';
import { puckTransparentSlotProps, type PaymentMethodsSlot } from './types';

interface Props { header?: PaymentMethodsSlot; cardForm?: PaymentMethodsSlot; savedCards?: PaymentMethodsSlot; help?: PaymentMethodsSlot; }
export const puckComponentName = 'PaymentMethodsPageLayout'; export const puckLabel = 'Payment Methods Page Layout'; export const puckCategory = 'Account';
export const puckFields = { header: { type: 'slot' as const, allow: ['PaymentMethodsHeaderLayout'] }, cardForm: { type: 'slot' as const, allow: ['PaymentMethodsStripeConfigCondition'] }, savedCards: { type: 'slot' as const, allow: ['PaymentMethodsSavedCardsSection'] }, help: { type: 'slot' as const, allow: ['PaymentMethodsHelpFooter'] } };
export const puckDefaults = { header: [], cardForm: [], savedCards: [], help: [] };
export const puckAst = { kind: 'static', slots: ['header', 'cardForm', 'savedCards', 'help'], sourceJsxNames: ['PaymentMethodsPageLayout'], sourceImportPaths: ['@/components/payment-methods/canonical/PaymentMethodsPageSections'], role: 'payment-methods-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'sm:px-6', 'lg:px-12'] };
export function PaymentMethodsPageLayoutView({ header, cardForm, savedCards, help }: Props) { return <PaymentMethodsPageLayout header={header?.(puckTransparentSlotProps)} cardForm={cardForm?.(puckTransparentSlotProps)} savedCards={savedCards?.(puckTransparentSlotProps)} help={help?.(puckTransparentSlotProps)} />; }
