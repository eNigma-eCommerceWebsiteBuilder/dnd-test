import type { Order } from '@/lib/api/types'; import { OrderSummary } from '@/enigma-components/checkout/success/OrderSummary'; import { checkoutSuccessPreviewOrder } from './preview'; import { loadCheckoutSuccessRuntime } from './checkoutSuccessRuntime';
interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'CheckoutSuccessOrderSummary'; export const puckLabel = 'Checkout Success Order Summary'; export const puckCategory = 'Checkout'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['OrderSummary'], sourceImportPaths: ['@/components/checkout/success/OrderSummary'], role: 'checkout-success-order-summary', runtimeSignals: ['order'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadCheckoutSuccessRuntime>[0]) { const runtime = await loadCheckoutSuccessRuntime(context); return { order: runtime.order }; }
export function CheckoutSuccessOrderSummaryView({ order = null, puck }: Props) { const resolved = puck?.isEditing ? checkoutSuccessPreviewOrder : order; return resolved ? <OrderSummary order={resolved} /> : null; }
