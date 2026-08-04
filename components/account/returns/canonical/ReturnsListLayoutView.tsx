import { ReturnsListLayout as ReturnsListLayoutRenderer } from '@/enigma-components/returns/canonical/ReturnsPageSections';
import { puckTransparentSlotProps, type AccountReturnsSlot } from './types';

interface Props { filter?: AccountReturnsSlot; notice?: AccountReturnsSlot; results?: AccountReturnsSlot; pagination?: AccountReturnsSlot; }
export const puckComponentName = 'ReturnsListLayout'; export const puckLabel = 'Returns List Layout'; export const puckCategory = 'Account';
export const puckFields = { filter: { type: 'slot' as const, allow: ['ReturnsStatusFilterRegion'] }, notice: { type: 'slot' as const, allow: ['ReturnsProcessingNotice'] }, results: { type: 'slot' as const, allow: ['ReturnsResultsState'] }, pagination: { type: 'slot' as const, allow: ['ReturnsPaginationRegion'] } };
export const puckDefaults = { filter: [], notice: [], results: [], pagination: [] };
export const puckAst = { kind: 'static', slots: ['filter', 'notice', 'results', 'pagination'], sourceJsxNames: ['ReturnsListLayout'], sourceImportPaths: ['@/components/returns/canonical/ReturnsPageSections'], role: 'returns-list-layout', slotTarget: 'content', requiredClasses: ['@container', 'flex', 'gap-6'] };
export function ReturnsListLayout({ filter, notice, results, pagination }: Props) { return <ReturnsListLayoutRenderer filter={filter?.(puckTransparentSlotProps)} notice={notice?.(puckTransparentSlotProps)} results={results?.(puckTransparentSlotProps)} pagination={pagination?.(puckTransparentSlotProps)} />; }
