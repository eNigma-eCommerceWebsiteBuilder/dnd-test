import { SearchPaginationCondition } from './SearchPaginationCondition';
import { loadSearchRuntime } from './searchRuntime';
import { puckTransparentSlotProps, type SearchSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props {
  hasPagination?: boolean;
  visible?: boolean;
  previewMode?: 'visible' | 'hidden';
  content?: SearchSlot;
  puck?: { isEditing?: boolean };
}
export const puckComponentName = 'SearchPaginationCondition';
export const puckLabel = 'Search Pagination Condition';
export const puckCategory = 'Search';
export const puckFields = { previewMode: { type: 'select' as const, options: [{ label: 'Visible', value: 'visible' }, { label: 'Hidden', value: 'hidden' }] }, content: { type: 'slot' as const, allow: ['SearchPagination'] } };
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['SearchPaginationCondition', 'Pagination'], sourceImportPaths: ['@/components/search/canonical/SearchPaginationCondition', '@/components/products/Pagination'], role: 'search-pagination-condition', slotTarget: 'pagination', conditional: 'totalPages > 1', runtimeSignals: ['search.totalPages'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadSearchRuntime(context); return { hasPagination: runtime.totalPages > 1 }; }
export function SearchPaginationConditionView({ hasPagination, visible, previewMode = 'visible', content, puck }: Props) {
  // Puck must render the nested slot while editing; published pages retain the source condition.
  const resolved = puck?.isEditing ? previewMode === 'visible' : hasPagination ?? visible ?? false;
  return <SearchPaginationCondition hasPagination={resolved} content={content?.(puckTransparentSlotProps)} />;
}
