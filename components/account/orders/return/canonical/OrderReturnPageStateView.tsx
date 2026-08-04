import type { OrderReturnPageData } from '@/enigma-components/returns/order-return-canonical/orderReturnRuntime';
import { OrderReturnPageState } from '@/enigma-components/returns/order-return-canonical/OrderReturnPageState';
import { loadOrderReturnRuntime } from './orderReturnRuntime'; import { puckTransparentSlotProps, type OrderReturnSlot } from './types'; import { resolveOrderReturnPageData } from './viewData';
interface Props { content?: OrderReturnSlot; pageData?: OrderReturnPageData | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'OrderReturnPageState'; export const puckLabel = 'Order Return Page State'; export const puckCategory = 'Account'; export const puckFields = { content: { type: 'slot' as const, allow: ['OrderReturnPageLayout'] } }; export const puckDefaults = { content: [] };
export const puckAst = { kind: 'runtime', topLevel: true, slots: ['content'], sourceJsxNames: ['OrderReturnPageState'], sourceImportPaths: ['@/components/returns/canonical/OrderReturnPageState'], role: 'order-return-page-state', conditional: '!pageData?.order => notFound()', runtimeSignals: ['params.id'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderReturnRuntime>[0]) { return loadOrderReturnRuntime(context); }
export function OrderReturnPageStateView(props: Props) { return <OrderReturnPageState pageData={resolveOrderReturnPageData(props)} content={props.content?.(puckTransparentSlotProps)} />; }
