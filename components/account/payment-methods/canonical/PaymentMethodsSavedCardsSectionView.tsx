import { PaymentMethodsSavedCardsSection } from '@/enigma-components/payment-methods/canonical/PaymentMethodsPageSections';
import { puckTransparentSlotProps, type PaymentMethodsSlot } from './types';

interface Props { state?: PaymentMethodsSlot; }
export const puckComponentName = 'PaymentMethodsSavedCardsSection'; export const puckLabel = 'Saved Cards Section'; export const puckCategory = 'Account'; export const puckFields = { state: { type: 'slot' as const, allow: ['PaymentMethodsListState'] } }; export const puckDefaults = { state: [] };
export const puckAst = { kind: 'static', slots: ['state'], sourceJsxNames: ['PaymentMethodsSavedCardsSection'], sourceImportPaths: ['@/components/payment-methods/canonical/PaymentMethodsPageSections'], role: 'payment-methods-saved-cards-section', slotTarget: 'savedCards', requiredClasses: ['font-heading', 'mb-4'] };
export function PaymentMethodsSavedCardsSectionView({ state }: Props) { return <PaymentMethodsSavedCardsSection state={state?.(puckTransparentSlotProps)} />; }
