import { SearchRecentSearchesBoundary } from './SearchRecentSearchesBoundary';
import { puckTransparentSlotProps, type SearchSlot } from './types';

interface Props { content?: SearchSlot; }
export const puckComponentName = 'SearchRecentSearchesBoundary';
export const puckLabel = 'Recent Searches Boundary';
export const puckCategory = 'Search';
export const puckFields = { content: { type: 'slot' as const, allow: ['RecentSearches'] } };
export const puckDefaults = { content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['SearchRecentSearchesBoundary', 'RecentSearches'], sourceImportPaths: ['@/components/search/canonical/SearchRecentSearchesBoundary', '@/components/search/RecentSearches'], role: 'search-recent-boundary', slotTarget: 'recentSearches', suspenseFallback: 'null' };
export function SearchRecentSearchesBoundaryView({ content }: Props) { return <SearchRecentSearchesBoundary content={content?.(puckTransparentSlotProps)} />; }
