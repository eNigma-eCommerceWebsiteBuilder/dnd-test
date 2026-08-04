import { SubscriptionCheckoutPageLayout } from './SubscriptionCheckoutPageLayout';
import { puckTransparentSlotProps, type SubscriptionCheckoutSlot } from './types';
interface Props { content?: SubscriptionCheckoutSlot; }
export const puckComponentName = 'SubscriptionCheckoutPageLayout'; export const puckLabel = 'Subscription Checkout Page Layout'; export const puckCategory = 'Checkout'; export const puckFields = { content: { type: 'slot' as const, allow: ['SubscriptionCheckoutClientLayout'] } }; export const puckDefaults = { content: [] };
export const puckAst = { kind: 'static', slots: ['content'], sourceJsxNames: ['SubscriptionCheckoutPageLayout'], sourceImportPaths: ['@/components/checkout/subscription/canonical/SubscriptionCheckoutPageLayout'], role: 'subscription-checkout-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'lg:px-20'] };
export function SubscriptionCheckoutPageLayoutView(props: Props) { return <SubscriptionCheckoutPageLayout content={props.content?.(puckTransparentSlotProps)} />; }
