import type { OrderReturnPageData } from '@/enigma-components/returns/order-return-canonical/orderReturnRuntime';
import { OrderReturnBreadcrumbs } from '@/enigma-components/returns/order-return-canonical/OrderReturnPageSections';
import { loadOrderReturnRuntime } from './orderReturnRuntime'; import { resolveOrderReturnPageData } from './viewData';
interface Props { pageData?: OrderReturnPageData | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderReturnBreadcrumbs'; export const puckLabel = 'Order Return Breadcrumbs'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['OrderReturnBreadcrumbs'], sourceImportPaths: ['@/components/returns/canonical/OrderReturnPageSections'], role: 'order-return-breadcrumbs', slotTarget: 'breadcrumbs', runtimeSignals: ['params.id', 'order.orderNumber'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderReturnRuntime>[0]) { return loadOrderReturnRuntime(context); }
export function OrderReturnBreadcrumbsView(props: Props) { const value = resolveOrderReturnPageData(props); return value ? <OrderReturnBreadcrumbs pageData={value} /> : null; }
