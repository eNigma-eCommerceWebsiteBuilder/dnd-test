import type { Category } from '@/lib/api/types';
import { SearchFilters } from '@/enigma-components/search/SearchFilters';
import { loadSearchRuntime } from './canonical/searchRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';
interface Props { categories?: Category[]; }
export const puckComponentName = 'SearchFilters'; export const puckLabel = 'Search Filters'; export const puckCategory = 'Search'; export const puckFields = {}; export const puckDefaults = { categories: [] };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SearchFilters'], sourceImportPaths: ['@/components/search/SearchFilters'], role: 'search-filters', slotTarget: 'filters', runtimeSignals: ['categories', 'searchParams'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadSearchRuntime(context); return { categories: runtime.categories }; }
export function SearchFiltersView({ categories = [] }: Props) { return <SearchFilters categories={categories} />; }
