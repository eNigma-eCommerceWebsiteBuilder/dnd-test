import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsRefundBreakdownRegion } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { getReturnOrder } from '@/enigma-components/returns/canonical/returnDetailsRuntime';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { resolveReturnDetails } from './viewData';
interface Props { returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsRefundBreakdownRegion'; export const puckLabel = 'Return Refund Breakdown'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnDetailsRefundBreakdownRegion', 'RefundBreakdown'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-refund-breakdown', slotTarget: 'sidebar', runtimeSignals: ['params.id', 'returnDetails.calculations', 'returnDetails.orderId'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsRefundBreakdownRegionView(props: Props) { const value = resolveReturnDetails(props); return value ? <ReturnDetailsRefundBreakdownRegion returnRequest={value} order={getReturnOrder(value)} /> : null; }
