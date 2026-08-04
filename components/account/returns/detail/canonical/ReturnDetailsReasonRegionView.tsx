import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsReasonRegion } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { resolveReturnDetails } from './viewData';
interface Props { returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsReasonRegion'; export const puckLabel = 'Return Reason'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnDetailsReasonRegion', 'ReturnReason'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-reason', slotTarget: 'primary', runtimeSignals: ['params.id', 'returnDetails.reason', 'returnDetails.reasonDetails'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsReasonRegionView(props: Props) { const value = resolveReturnDetails(props); return value ? <ReturnDetailsReasonRegion returnRequest={value} /> : null; }
