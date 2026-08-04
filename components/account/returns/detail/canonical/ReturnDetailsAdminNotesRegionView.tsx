import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsAdminNotesRegion } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { resolveReturnDetails } from './viewData';
interface Props { returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsAdminNotesRegion'; export const puckLabel = 'Return Admin Notes'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnDetailsAdminNotesRegion', 'AdminNotes'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-admin-notes', slotTarget: 'content', runtimeSignals: ['params.id', 'returnDetails.adminNotes'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsAdminNotesRegionView(props: Props) { const notes = resolveReturnDetails(props)?.adminNotes; return notes ? <ReturnDetailsAdminNotesRegion notes={notes} /> : null; }
