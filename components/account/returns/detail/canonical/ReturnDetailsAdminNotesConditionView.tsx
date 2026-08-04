import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsAdminNotesCondition } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { puckTransparentSlotProps, type ReturnDetailsSlot } from './types'; import { resolveReturnDetails } from './viewData';
interface Props { content?: ReturnDetailsSlot; returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsAdminNotesCondition'; export const puckLabel = 'Return Admin Notes Condition'; export const puckCategory = 'Account'; export const puckFields = { content: { type: 'slot' as const, allow: ['ReturnDetailsAdminNotesRegion'] } }; export const puckDefaults = { content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['ReturnDetailsAdminNotesCondition'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-admin-notes-condition', slotTarget: 'primary', conditional: 'returnDetails.adminNotes', runtimeSignals: ['params.id', 'returnDetails.adminNotes'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsAdminNotesConditionView(props: Props) { const value = resolveReturnDetails(props); return value ? <ReturnDetailsAdminNotesCondition notes={value.adminNotes} content={props.content?.(puckTransparentSlotProps)} /> : null; }
