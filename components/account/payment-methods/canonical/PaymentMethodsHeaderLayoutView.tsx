import { PaymentMethodsHeaderLayout } from '@/enigma-components/payment-methods/canonical/PaymentMethodsPageSections';
import { puckTransparentSlotProps, type PaymentMethodsSlot } from './types';

interface Props { addCard?: PaymentMethodsSlot; }
export const puckComponentName = 'PaymentMethodsHeaderLayout'; export const puckLabel = 'Payment Methods Header'; export const puckCategory = 'Account';
export const puckFields = { addCard: { type: 'slot' as const, allow: ['PaymentMethodsAddCardAction'] } }; export const puckDefaults = { addCard: [] };
export const puckAst = { kind: 'static', slots: ['addCard'], sourceJsxNames: ['PaymentMethodsHeaderLayout'], sourceImportPaths: ['@/components/payment-methods/canonical/PaymentMethodsPageSections'], role: 'payment-methods-header-layout', slotTarget: 'header', requiredClasses: ['md:flex-row', 'justify-between', 'font-heading'] };
export function PaymentMethodsHeaderLayoutView({ addCard }: Props) { return <PaymentMethodsHeaderLayout addCard={addCard?.(puckTransparentSlotProps)} />; }
