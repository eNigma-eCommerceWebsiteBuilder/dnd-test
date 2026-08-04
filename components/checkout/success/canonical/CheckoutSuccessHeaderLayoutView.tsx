import { CheckoutSuccessHeaderLayout } from './CheckoutSuccessHeaderLayout';
import { puckTransparentSlotProps, type CheckoutSuccessSlot } from './types';
interface Props { header?: CheckoutSuccessSlot; orderNumber?: CheckoutSuccessSlot; }
export const puckComponentName = 'CheckoutSuccessHeaderLayout'; export const puckLabel = 'Checkout Confirmation Header'; export const puckCategory = 'Checkout';
export const puckFields = { header: { type: 'slot' as const, allow: ['CheckoutSuccessHeader'] }, orderNumber: { type: 'slot' as const, allow: ['CheckoutSuccessOrderNumber'] } }; export const puckDefaults = { header: [], orderNumber: [] };
export const puckAst = { kind: 'runtime', slots: ['header', 'orderNumber'], sourceJsxNames: ['CheckoutSuccessHeaderLayout'], sourceImportPaths: ['@/components/checkout/success/canonical/CheckoutSuccessHeaderLayout'], role: 'checkout-success-header-layout', requiredClasses: ['items-center', 'text-center', 'mb-12', 'md:mb-16'] };
export function CheckoutSuccessHeaderLayoutView(props: Props) { return <CheckoutSuccessHeaderLayout header={props.header?.(puckTransparentSlotProps)} orderNumber={props.orderNumber?.(puckTransparentSlotProps)} />; }
