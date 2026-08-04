import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsTimelineRegion } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { resolveReturnDetails } from './viewData';
interface Props { returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsTimelineRegion'; export const puckLabel = 'Return Status Timeline'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnDetailsTimelineRegion', 'ReturnStatusTimeline'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-timeline', slotTarget: 'timeline', runtimeSignals: ['params.id', 'returnDetails.status', 'returnDetails.requestedAt'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsTimelineRegionView(props: Props) { const value = resolveReturnDetails(props); return value ? <ReturnDetailsTimelineRegion returnRequest={value} /> : null; }
