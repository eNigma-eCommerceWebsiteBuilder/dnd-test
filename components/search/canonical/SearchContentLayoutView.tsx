import { SearchContentLayout } from './SearchContentLayout';
import { puckTransparentSlotProps, type SearchSlot } from './types';

interface Props { sidebar?: SearchSlot; results?: SearchSlot; }
export const puckComponentName = 'SearchContentLayout';
export const puckLabel = 'Search Content Layout';
export const puckCategory = 'Search';
export const puckFields = { sidebar: { type: 'slot' as const, allow: ['SearchFilterSidebar'] }, results: { type: 'slot' as const, allow: ['SearchQueryState'] } };
export const puckDefaults = { sidebar: [], results: [] };
export const puckAst = { kind: 'static', slots: ['sidebar', 'results'], sourceJsxNames: ['SearchContentLayout'], sourceImportPaths: ['@/components/search/canonical/SearchContentLayout'], role: 'search-content-layout', slotTarget: 'content', requiredClasses: ['flex', 'flex-col', 'lg:flex-row', 'gap-8', 'lg:gap-12', 'mt-10'] };
export function SearchContentLayoutView({ sidebar, results }: Props) { return <SearchContentLayout sidebar={sidebar?.(puckTransparentSlotProps)} results={results?.(puckTransparentSlotProps)} />; }
