import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsLabelRegion } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { resolveReturnDetails } from './viewData';
interface Props { returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsLabelRegion'; export const puckLabel = 'Return Label Download'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnDetailsLabelRegion', 'ReturnLabelDownload'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-label', slotTarget: 'sidebar', runtimeSignals: ['params.id', 'returnDetails._id'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsLabelRegionView(props: Props) { const value = resolveReturnDetails(props); return value ? <ReturnDetailsLabelRegion returnId={value._id} /> : null; }
