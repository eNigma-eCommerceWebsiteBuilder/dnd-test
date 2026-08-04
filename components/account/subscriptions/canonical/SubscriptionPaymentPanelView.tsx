import { SubscriptionPaymentPanel } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { puckTransparentSlotProps, type SubscriptionDetailSlot } from './types';
interface Props { updatePayment?: SubscriptionDetailSlot; billingPortal?: SubscriptionDetailSlot; }
export const puckComponentName = 'SubscriptionPaymentPanel'; export const puckLabel = 'Subscription Payment Panel'; export const puckCategory = 'Account';
export const puckFields = { updatePayment: { type: 'slot' as const, allow: ['SubscriptionUpdatePaymentAction'] }, billingPortal: { type: 'slot' as const, allow: ['SubscriptionBillingPortalAction'] } };
export const puckDefaults = { updatePayment: [], billingPortal: [] };
export const puckAst = { kind: 'static', slots: ['updatePayment', 'billingPortal'], sourceJsxNames: ['SubscriptionPaymentPanel', 'UpdatePaymentButton', 'BillingPortalButton'], sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'], role: 'subscription-details-payment-panel', slotTarget: 'sidebar' };
export function SubscriptionPaymentPanelView({ updatePayment, billingPortal }: Props) { return <SubscriptionPaymentPanel updatePayment={updatePayment?.(puckTransparentSlotProps)} billingPortal={billingPortal?.(puckTransparentSlotProps)} />; }
