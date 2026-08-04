import { ReturnsPageLayout as ReturnsPageLayoutRenderer } from '@/enigma-components/returns/canonical/ReturnsPageSections';
import { puckTransparentSlotProps, type AccountReturnsSlot } from './types';

interface Props { header?: AccountReturnsSlot; content?: AccountReturnsSlot; }
export const puckComponentName = 'ReturnsPageLayout'; export const puckLabel = 'Returns Page Layout'; export const puckCategory = 'Account';
export const puckFields = { header: { type: 'slot' as const, allow: ['ReturnsPageHeader'] }, content: { type: 'slot' as const, allow: ['ReturnsListLayout'] } };
export const puckDefaults = { header: [], content: [] };
export const puckAst = { kind: 'static', topLevel: true, slots: ['header', 'content'], sourceJsxNames: ['ReturnsPageLayout'], sourceImportPaths: ['@/components/returns/canonical/ReturnsPageSections'], role: 'returns-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'md:py-12'] };
export function ReturnsPageLayout({ header, content }: Props) { return <ReturnsPageLayoutRenderer header={header?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} />; }
