import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsPageState } from '@/enigma-components/returns/canonical/ReturnDetailsPageState';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime';
import { puckTransparentSlotProps, type ReturnDetailsSlot } from './types';
import { resolveReturnDetails } from './viewData';

interface Props { notFound?: ReturnDetailsSlot; content?: ReturnDetailsSlot; returnDetails?: ReturnRequest | null; previewState?: 'details' | 'notFound'; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsPageState'; export const puckLabel = 'Return Details Page State'; export const puckCategory = 'Account';
export const puckFields = { previewState: { type: 'select' as const, options: [{ label: 'Return details', value: 'details' }, { label: 'Return not found', value: 'notFound' }] }, notFound: { type: 'slot' as const, allow: ['ReturnDetailsNotFoundLayout'] }, content: { type: 'slot' as const, allow: ['ReturnDetailsPageLayout'] } };
export const puckDefaults = { previewState: 'details', notFound: [], content: [] };
export const puckAst = { kind: 'runtime', topLevel: true, slots: ['notFound', 'content'], sourceJsxNames: ['ReturnDetailsPageState'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageState'], role: 'return-details-page-state', conditional: '!returnDetails', runtimeSignals: ['params.id'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsPageStateView(props: Props) { const returnDetails = resolveReturnDetails(props); return <ReturnDetailsPageState returnDetails={returnDetails} notFound={props.notFound?.(puckTransparentSlotProps)} content={props.content?.(puckTransparentSlotProps)} />; }
