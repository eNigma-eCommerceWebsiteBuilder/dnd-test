import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsTrackingRegion } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { resolveReturnDetails } from './viewData';
interface Props { returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsTrackingRegion'; export const puckLabel = 'Return Tracking'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnDetailsTrackingRegion', 'TrackingInfo'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-tracking', slotTarget: 'sidebar', runtimeSignals: ['params.id', 'returnDetails._id'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsTrackingRegionView(props: Props) { const value = resolveReturnDetails(props); return value ? <ReturnDetailsTrackingRegion returnId={value._id} /> : null; }
