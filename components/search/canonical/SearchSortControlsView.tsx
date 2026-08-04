import { SearchSortControls } from './SearchSortControls';
import { loadSearchRuntime } from './searchRuntime';
import { puckTransparentSlotProps, type SearchSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { totalItems?: number; content?: SearchSlot; }
export const puckComponentName = 'SearchSortControls';
export const puckLabel = 'Search Sort Controls';
export const puckCategory = 'Search';
export const puckFields = { content: { type: 'slot' as const, allow: ['SearchSortDropdown'] } };
export const puckDefaults = { totalItems: 0, content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['SearchSortControls', 'SortDropdown'], sourceImportPaths: ['@/components/search/canonical/SearchSortControls', '@/components/products/SortDropdown'], role: 'search-sort-controls', slotTarget: 'controls', runtimeSignals: ['search.totalItems'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadSearchRuntime(context); return { totalItems: runtime.totalItems }; }
export function SearchSortControlsView({ totalItems, content }: Props) { return <SearchSortControls totalItems={totalItems} content={content?.(puckTransparentSlotProps)} />; }
