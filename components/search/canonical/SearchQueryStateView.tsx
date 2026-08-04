import { SearchQueryState } from './SearchQueryState';
import { loadSearchRuntime } from './searchRuntime';
import { puckTransparentSlotProps, type SearchSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { query?: string; hasResults?: boolean; previewMode?: 'start' | 'results' | 'no-results'; results?: SearchSlot; noResults?: SearchSlot; start?: SearchSlot; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SearchQueryState';
export const puckLabel = 'Search Query State';
export const puckCategory = 'Search';
export const puckFields = { previewMode: { type: 'select' as const, options: [{ label: 'Start', value: 'start' }, { label: 'Results', value: 'results' }, { label: 'No Results', value: 'no-results' }] }, results: { type: 'slot' as const, allow: ['SearchResultsBlock'] }, noResults: { type: 'slot' as const, allow: ['NoResults'] }, start: { type: 'slot' as const, allow: ['SearchStartPrompt'] } };
export const puckDefaults = { previewMode: 'start', results: [], noResults: [], start: [] };
export const puckAst = { kind: 'runtime', slots: ['results', 'noResults', 'start'], sourceJsxNames: ['SearchQueryState', 'NoResults', 'ProductGrid'], sourceImportPaths: ['@/components/search/canonical/SearchQueryState', '@/components/search/NoResults', '@/components/products/ProductGrid'], role: 'search-query-state', slotTarget: 'results', conditional: 'query ? products.length > 0 ? results : noResults : start', runtimeSignals: ['searchParams.q', 'searchProducts'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadSearchRuntime(context); return { query: runtime.query, hasResults: runtime.products.length > 0 }; }
export function SearchQueryStateView({ query, hasResults, previewMode = 'start', results, noResults, start, puck }: Props) {
  const isEditing = puck?.isEditing === true;
  const resolvedQuery = query ?? (isEditing && previewMode !== 'start' ? 'preview' : '');
  const resolvedHasResults = hasResults ?? (isEditing && previewMode === 'results');
  return <SearchQueryState query={resolvedQuery} hasResults={resolvedHasResults} results={results?.(puckTransparentSlotProps)} noResults={noResults?.(puckTransparentSlotProps)} start={start?.(puckTransparentSlotProps)} />;
}
