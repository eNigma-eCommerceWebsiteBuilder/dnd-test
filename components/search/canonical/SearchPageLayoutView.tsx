import { SearchPageLayout } from './SearchPageLayout';
import { puckTransparentSlotProps, type SearchSlot } from './types';

interface Props { breadcrumbs?: SearchSlot; header?: SearchSlot; analytics?: SearchSlot; recentSearches?: SearchSlot; content?: SearchSlot; }

export const puckComponentName = 'SearchPageLayout';
export const puckLabel = 'Search Page Layout';
export const puckCategory = 'Search';
export const puckFields = {
  breadcrumbs: { type: 'slot' as const, allow: ['SearchBreadcrumbs'] },
  header: { type: 'slot' as const, allow: ['SearchHeader'] },
  analytics: { type: 'slot' as const, allow: ['SearchAnalytics'] },
  recentSearches: { type: 'slot' as const, allow: ['SearchRecentSearchesBoundary'] },
  content: { type: 'slot' as const, allow: ['SearchContentLayout'] },
};
export const puckDefaults = { breadcrumbs: [], header: [], analytics: [], recentSearches: [], content: [] };
export const puckAst = { kind: 'static', topLevel: true, slots: ['breadcrumbs', 'header', 'analytics', 'recentSearches', 'content'], sourceJsxNames: ['SearchPageLayout'], sourceImportPaths: ['@/components/search/canonical/SearchPageLayout'], role: 'search-page-layout', requiredClasses: ['min-h-screen', 'bg-bg-base', 'text-text-base', 'max-w-[1440px]', 'px-6', 'lg:px-12', 'py-8'] };

export function SearchPageLayoutView(props: Props) {
  return <SearchPageLayout breadcrumbs={props.breadcrumbs?.(puckTransparentSlotProps)} header={props.header?.(puckTransparentSlotProps)} analytics={props.analytics?.(puckTransparentSlotProps)} recentSearches={props.recentSearches?.(puckTransparentSlotProps)} content={props.content?.(puckTransparentSlotProps)} />;
}
