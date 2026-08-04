import { CheckoutSuccessPageLayout } from './CheckoutSuccessPageLayout';
import { puckTransparentSlotProps, type CheckoutSuccessSlot } from './types';

interface Props { tracker?: CheckoutSuccessSlot; header?: CheckoutSuccessSlot; content?: CheckoutSuccessSlot; actions?: CheckoutSuccessSlot; }

export const puckComponentName = 'CheckoutSuccessPageLayout';
export const puckLabel = 'Checkout Success Page Layout';
export const puckCategory = 'Checkout';
export const puckFields = { tracker: { type: 'slot' as const, allow: ['CheckoutSuccessPurchaseTracker'] }, header: { type: 'slot' as const, allow: ['CheckoutSuccessHeaderLayout'] }, content: { type: 'slot' as const, allow: ['CheckoutSuccessTwoColumnLayout'] }, actions: { type: 'slot' as const, allow: ['CheckoutSuccessActionsLayout'] } };
export const puckDefaults = { tracker: [], header: [], content: [], actions: [] };
export const puckAst = { kind: 'runtime', slots: ['tracker', 'header', 'content', 'actions'], sourceJsxNames: ['CheckoutSuccessPageLayout'], sourceImportPaths: ['@/components/checkout/success/canonical/CheckoutSuccessPageLayout'], role: 'checkout-success-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1200px]', 'px-4', 'lg:py-16'] };
export function CheckoutSuccessPageLayoutView(props: Props) { return <CheckoutSuccessPageLayout tracker={props.tracker?.(puckTransparentSlotProps)} header={props.header?.(puckTransparentSlotProps)} content={props.content?.(puckTransparentSlotProps)} actions={props.actions?.(puckTransparentSlotProps)} />; }
