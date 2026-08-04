import { PaymentMethodsAddCardAction } from '@/enigma-components/payment-methods/canonical/PaymentMethodsPageSections';

export const puckComponentName = 'PaymentMethodsAddCardAction'; export const puckLabel = 'Add Card Action'; export const puckCategory = 'Account';
export const puckFields = {}; export const puckDefaults = {}; export const puckAst = { kind: 'runtime', sourceJsxNames: ['PaymentMethodsAddCardAction', 'AddCardButton'], sourceImportPaths: ['@/components/payment-methods/canonical/PaymentMethodsPageSections'], role: 'payment-methods-add-card-action', slotTarget: 'addCard' };
export function PaymentMethodsAddCardActionView() { return <PaymentMethodsAddCardAction />; }
