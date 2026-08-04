import { SearchResultsBlock } from './SearchResultsBlock';
import { puckTransparentSlotProps, type SearchSlot } from './types';

interface Props { controls?: SearchSlot; grid?: SearchSlot; pagination?: SearchSlot; }
export const puckComponentName = 'SearchResultsBlock';
export const puckLabel = 'Search Results Block';
export const puckCategory = 'Search';
export const puckFields = { controls: { type: 'slot' as const, allow: ['SearchSortControls'] }, grid: { type: 'slot' as const, allow: ['SearchGridBoundary'] }, pagination: { type: 'slot' as const, allow: ['SearchPaginationCondition'] } };
export const puckDefaults = { controls: [], grid: [], pagination: [] };
export const puckAst = { kind: 'static', slots: ['controls', 'grid', 'pagination'], sourceJsxNames: ['SearchResultsBlock'], sourceImportPaths: ['@/components/search/canonical/SearchResultsBlock'], role: 'search-results-block', slotTarget: 'results' };
export function SearchResultsBlockView({ controls, grid, pagination }: Props) { return <SearchResultsBlock controls={controls?.(puckTransparentSlotProps)} grid={grid?.(puckTransparentSlotProps)} pagination={pagination?.(puckTransparentSlotProps)} />; }
