import type { Order } from '@/lib/api/types'; import { PurchaseTracker } from '@/enigma-components/checkout/success/PurchaseTracker'; import { loadCheckoutSuccessRuntime } from './checkoutSuccessRuntime';
interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'CheckoutSuccessPurchaseTracker'; export const puckLabel = 'Checkout Success Purchase Tracker'; export const puckCategory = 'Checkout'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['PurchaseTracker'], sourceImportPaths: ['@/components/checkout/success/PurchaseTracker'], role: 'checkout-success-purchase-tracker', runtimeSignals: ['order'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadCheckoutSuccessRuntime>[0]) { const runtime = await loadCheckoutSuccessRuntime(context); return { order: runtime.order }; }
export function CheckoutSuccessPurchaseTrackerView({ order = null, puck }: Props) { return puck?.isEditing || !order ? null : <PurchaseTracker order={order} />; }
