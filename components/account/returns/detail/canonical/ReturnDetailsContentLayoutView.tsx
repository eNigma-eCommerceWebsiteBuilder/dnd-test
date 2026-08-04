import { ReturnDetailsContentLayout } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { puckTransparentSlotProps, type ReturnDetailsSlot } from './types';
interface Props { primary?: ReturnDetailsSlot; sidebar?: ReturnDetailsSlot; }
export const puckComponentName = 'ReturnDetailsContentLayout'; export const puckLabel = 'Return Details Content Layout'; export const puckCategory = 'Account';
export const puckFields = { primary: { type: 'slot' as const, allow: ['ReturnDetailsItemsRegion', 'ReturnDetailsReasonRegion', 'ReturnDetailsAdminNotesCondition'] }, sidebar: { type: 'slot' as const, allow: ['ReturnDetailsTrackingRegion', 'ReturnDetailsLabelRegion', 'ReturnDetailsRefundSummaryRegion', 'ReturnDetailsRefundBreakdownRegion'] } };
export const puckDefaults = { primary: [], sidebar: [] };
export const puckAst = { kind: 'static', slots: ['primary', 'sidebar'], sourceJsxNames: ['ReturnDetailsContentLayout'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-content-layout', slotTarget: 'content', parentSignature: 'ReturnDetailsPageLayout > ReturnDetailsContentLayout', requiredClasses: ['lg:grid-cols-12', 'lg:col-span-7', 'lg:col-span-5'] };
export function ReturnDetailsContentLayoutView({ primary, sidebar }: Props) { return <ReturnDetailsContentLayout primary={primary?.(puckTransparentSlotProps)} sidebar={sidebar?.(puckTransparentSlotProps)} />; }
