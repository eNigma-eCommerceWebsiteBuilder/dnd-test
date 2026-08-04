import { PaymentMethodsEmptyStateRegion } from '@/enigma-components/payment-methods/canonical/PaymentMethodsPageSections';

export const puckComponentName = 'PaymentMethodsEmptyStateRegion'; export const puckLabel = 'No Saved Payment Methods'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['PaymentMethodsEmptyStateRegion', 'EmptyPaymentMethods'], sourceImportPaths: ['@/components/payment-methods/canonical/PaymentMethodsPageSections'], role: 'payment-methods-empty-state-region', slotTarget: 'empty' };
export function PaymentMethodsEmptyStateRegionView() { return <PaymentMethodsEmptyStateRegion />; }
