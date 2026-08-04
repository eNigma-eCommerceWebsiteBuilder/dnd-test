import type { OrderReturnPageData } from '@/enigma-components/returns/order-return-canonical/orderReturnRuntime';
import { OrderReturnRequestFormRegion } from '@/enigma-components/returns/order-return-canonical/OrderReturnPageSections';
import { loadOrderReturnRuntime } from './orderReturnRuntime'; import { resolveOrderReturnPageData } from './viewData';
interface Props { pageData?: OrderReturnPageData | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderReturnRequestFormRegion'; export const puckLabel = 'Order Return Request Form'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['OrderReturnRequestFormRegion', 'ReturnRequestForm'], sourceImportPaths: ['@/components/returns/canonical/OrderReturnPageSections'], role: 'order-return-request-form', slotTarget: 'form', runtimeSignals: ['params.id', 'order.items', 'order.shipping'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderReturnRuntime>[0]) { return loadOrderReturnRuntime(context); }
export function OrderReturnRequestFormRegionView(props: Props) { const value = resolveOrderReturnPageData(props); return value ? <OrderReturnRequestFormRegion pageData={value} /> : null; }
