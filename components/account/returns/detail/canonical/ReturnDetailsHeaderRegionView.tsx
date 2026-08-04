import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsHeaderRegion } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { resolveReturnDetails } from './viewData';
interface Props { returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsHeaderRegion'; export const puckLabel = 'Return Details Header'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnDetailsHeaderRegion', 'ReturnDetailsHeader'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-header', slotTarget: 'header', runtimeSignals: ['params.id', 'returnDetails.requestNumber', 'returnDetails.status'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsHeaderRegionView(props: Props) { const value = resolveReturnDetails(props); return value ? <ReturnDetailsHeaderRegion returnRequest={value} /> : null; }
