import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsActionsRegion } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { resolveReturnDetails } from './viewData';
interface Props { returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsActionsRegion'; export const puckLabel = 'Return Actions'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnDetailsActionsRegion', 'ReturnActionsPanel'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-actions', slotTarget: 'actions', runtimeSignals: ['params.id', 'returnDetails._id', 'returnDetails.status'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsActionsRegionView(props: Props) { const value = resolveReturnDetails(props); return value ? <ReturnDetailsActionsRegion returnRequest={value} /> : null; }
