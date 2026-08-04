import { SubscriptionCheckoutHeader } from '@/enigma-components/checkout/subscription/SubscriptionCheckoutSections';
export const puckComponentName = 'SubscriptionCheckoutHeader'; export const puckLabel = 'Subscription Checkout Header'; export const puckCategory = 'Checkout'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['SubscriptionCheckoutHeader'], sourceImportPaths: ['@/components/checkout/subscription/SubscriptionCheckoutSections'], role: 'subscription-checkout-header', requiredClasses: ['space-y-2', 'text-2xl', '@md:text-3xl'] };
export function SubscriptionCheckoutHeaderView() { return <SubscriptionCheckoutHeader />; }
