import type { ReturnRequest } from '@/lib/api/types';
import { ReturnDetailsItemsRegion } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { getReturnOrder } from '@/enigma-components/returns/canonical/returnDetailsRuntime';
import { loadReturnDetailsRuntime } from './returnDetailsRuntime'; import { resolveReturnDetails } from './viewData';
interface Props { returnDetails?: ReturnRequest | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnDetailsItemsRegion'; export const puckLabel = 'Return Items'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnDetailsItemsRegion', 'ReturnItemList'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-items', slotTarget: 'primary', runtimeSignals: ['params.id', 'returnDetails.returnItems', 'returnDetails.orderId'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadReturnDetailsRuntime>[0]) { return loadReturnDetailsRuntime(context); }
export function ReturnDetailsItemsRegionView(props: Props) { const value = resolveReturnDetails(props); return value ? <ReturnDetailsItemsRegion returnRequest={value} order={getReturnOrder(value)} /> : null; }
