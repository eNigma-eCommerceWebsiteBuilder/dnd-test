import { SearchHeader } from '@/enigma-components/search/SearchHeader';
import { loadSearchRuntime } from './canonical/searchRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface SearchHeaderViewProps {
  query: string;
  totalItems: number;
  className?: string;
}

export const puckComponentName = 'SearchHeader';
export const puckLabel = 'Search Header';
export const puckCategory = 'Search';

export const puckFields = {
  query: { type: 'text' as const, label: 'Search Query' },
  totalItems: { type: 'number' as const, label: 'Total Items' },
};

export const puckDefaults = {
  query: 'wool coat',
  totalItems: 24,
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SearchHeader'], sourceImportPaths: ['@/components/search/SearchHeader'], role: 'search-header', slotTarget: 'header', runtimeSignals: ['searchParams.q', 'totalItems'] };

export async function puckDataFetcher(_props: { query?: string }, context?: PuckFetcherContext) {
  const result = await loadSearchRuntime(context);
  return {
    query: result.query,
    totalItems: result.totalItems,
  };
}

export function SearchHeaderView({ query, totalItems, className }: SearchHeaderViewProps) {
  return <SearchHeader query={query} totalItems={totalItems} className={className} />;
}
