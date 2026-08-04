import type { OrderReturnPageData } from '@/enigma-components/returns/order-return-canonical/orderReturnRuntime';
import { OrderReturnNotEligibleRegion } from '@/enigma-components/returns/order-return-canonical/OrderReturnPageSections';
import { loadOrderReturnRuntime } from './orderReturnRuntime'; import { resolveOrderReturnPageData } from './viewData';
interface Props { pageData?: OrderReturnPageData | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderReturnNotEligibleRegion'; export const puckLabel = 'Order Return Not Eligible'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['OrderReturnNotEligibleRegion', 'NotEligibleMessage'], sourceImportPaths: ['@/components/returns/canonical/OrderReturnPageSections'], role: 'order-return-not-eligible', slotTarget: 'ineligible', runtimeSignals: ['params.id', 'order.orderNumber', 'eligibility.error'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderReturnRuntime>[0]) { return loadOrderReturnRuntime(context); }
export function OrderReturnNotEligibleRegionView(props: Props) { const value = resolveOrderReturnPageData(props); return value ? <OrderReturnNotEligibleRegion pageData={value} /> : null; }
