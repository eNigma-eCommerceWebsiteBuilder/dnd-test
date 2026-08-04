import { SearchFilterSidebar } from './SearchFilterSidebar';
import { puckTransparentSlotProps, type SearchSlot } from './types';

interface Props { filters?: SearchSlot; }
export const puckComponentName = 'SearchFilterSidebar';
export const puckLabel = 'Search Filter Sidebar';
export const puckCategory = 'Search';
export const puckFields = { filters: { type: 'slot' as const, allow: ['SearchFilters'] } };
export const puckDefaults = { filters: [] };
export const puckAst = { kind: 'runtime', slots: ['filters'], sourceJsxNames: ['SearchFilterSidebar', 'SearchFilters'], sourceImportPaths: ['@/components/search/canonical/SearchFilterSidebar', '@/components/search/SearchFilters'], role: 'search-filter-sidebar', slotTarget: 'sidebar', suspenseFallback: 'search-filter-skeleton', requiredClasses: ['w-full', 'lg:w-[280px]', 'flex-shrink-0'] };
export function SearchFilterSidebarView({ filters }: Props) { return <SearchFilterSidebar filters={filters?.(puckTransparentSlotProps)} />; }
