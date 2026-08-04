import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsRefundSummaryRegion } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { getReturnOrder } from '@/enigma-components/returns/canonical/returnDetailsRuntime';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { resolveReturnDetails } from './viewData';
interface Props { returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsRefundSummaryRegion'; export const puckLabel = 'Return Refund Summary'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnDetailsRefundSummaryRegion', 'RefundSummary'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-refund-summary', slotTarget: 'sidebar', runtimeSignals: ['params.id', 'returnDetails.calculations', 'returnDetails.orderId'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsRefundSummaryRegionView(props: Props) { const value = resolveReturnDetails(props); return value ? <ReturnDetailsRefundSummaryRegion returnRequest={value} order={getReturnOrder(value)} /> : null; }
