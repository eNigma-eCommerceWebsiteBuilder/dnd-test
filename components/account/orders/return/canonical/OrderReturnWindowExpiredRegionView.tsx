import type { OrderReturnPageData } from '@/enigma-components/returns/order-return-canonical/orderReturnRuntime';
import { OrderReturnWindowExpiredRegion } from '@/enigma-components/returns/order-return-canonical/OrderReturnPageSections';
import { loadOrderReturnRuntime } from './orderReturnRuntime'; import { resolveOrderReturnPageData } from './viewData';
interface Props { pageData?: OrderReturnPageData | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderReturnWindowExpiredRegion'; export const puckLabel = 'Order Return Window Expired'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['OrderReturnWindowExpiredRegion', 'ReturnWindowExpired'], sourceImportPaths: ['@/components/returns/canonical/OrderReturnPageSections'], role: 'order-return-window-expired', slotTarget: 'expired', runtimeSignals: ['params.id', 'order.orderNumber', 'order.deliveredAt'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderReturnRuntime>[0]) { return loadOrderReturnRuntime(context); }
export function OrderReturnWindowExpiredRegionView(props: Props) { const value = resolveOrderReturnPageData(props); return value ? <OrderReturnWindowExpiredRegion pageData={value} /> : null; }
