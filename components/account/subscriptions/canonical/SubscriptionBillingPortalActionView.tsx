import { SubscriptionBillingPortalAction } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
export const puckComponentName = 'SubscriptionBillingPortalAction'; export const puckLabel = 'Open Subscription Billing Portal'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SubscriptionBillingPortalAction', 'BillingPortalButton'], sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'], role: 'subscription-details-billing-portal', slotTarget: 'billingPortal', runtimeSignals: ['session.user'] };
export function SubscriptionBillingPortalActionView() { return <SubscriptionBillingPortalAction />; }
