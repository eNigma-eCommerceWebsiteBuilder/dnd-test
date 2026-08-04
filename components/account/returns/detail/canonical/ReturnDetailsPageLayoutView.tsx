import { ReturnDetailsPageLayout } from '@/enigma-components/returns/canonical/ReturnDetailsPageSections';
import { puckTransparentSlotProps, type ReturnDetailsSlot } from './types';
interface Props { header?: ReturnDetailsSlot; timeline?: ReturnDetailsSlot; content?: ReturnDetailsSlot; actions?: ReturnDetailsSlot; }
export const puckComponentName = 'ReturnDetailsPageLayout'; export const puckLabel = 'Return Details Page Layout'; export const puckCategory = 'Account';
export const puckFields = { header: { type: 'slot' as const, allow: ['ReturnDetailsHeaderRegion'] }, timeline: { type: 'slot' as const, allow: ['ReturnDetailsTimelineRegion'] }, content: { type: 'slot' as const, allow: ['ReturnDetailsContentLayout'] }, actions: { type: 'slot' as const, allow: ['ReturnDetailsActionsRegion'] } };
export const puckDefaults = { header: [], timeline: [], content: [], actions: [] };
export const puckAst = { kind: 'static', slots: ['header', 'timeline', 'content', 'actions'], sourceJsxNames: ['ReturnDetailsPageLayout'], sourceImportPaths: ['@/components/returns/canonical/ReturnDetailsPageSections'], role: 'return-details-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'flex-col', 'gap-8'] };
export function ReturnDetailsPageLayoutView({ header, timeline, content, actions }: Props) { return <ReturnDetailsPageLayout header={header?.(puckTransparentSlotProps)} timeline={timeline?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} actions={actions?.(puckTransparentSlotProps)} />; }
