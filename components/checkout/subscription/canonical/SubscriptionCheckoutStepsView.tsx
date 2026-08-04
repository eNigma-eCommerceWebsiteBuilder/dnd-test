'use client'; import { SubscriptionCheckoutSteps } from '@/enigma-components/checkout/subscription/SubscriptionCheckoutSections';
export const puckComponentName = 'SubscriptionCheckoutSteps'; export const puckLabel = 'Subscription Checkout Steps'; export const puckCategory = 'Checkout'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['SubscriptionCheckoutSteps', 'CheckoutSteps'], sourceImportPaths: ['@/components/checkout/subscription/SubscriptionCheckoutSections', '@/components/checkout/subscription/SubscriptionCheckoutClient'], role: 'subscription-checkout-steps' };
export function SubscriptionCheckoutStepsView() { return <SubscriptionCheckoutSteps />; }
