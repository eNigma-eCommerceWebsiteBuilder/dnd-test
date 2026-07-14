import type { ReactNode } from 'react';
import { searchProducts } from '@/lib/api/services/products';
import { getSearchParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

interface SearchStateSectionViewProps {
  query?: string;
  totalItems?: number;
  state?: string;
  results?: (props?: Record<string, unknown>) => ReactNode;
  noResults?: (props?: Record<string, unknown>) => ReactNode;
  start?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'SearchStateSection';
export const puckLabel = 'Search State Section';
export const puckCategory = 'Search';

export const puckFields = {
  query: { type: 'text' as const, label: 'Search Query' },
  totalItems: { type: 'number' as const, label: 'Total Items' },
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Start', value: 'start' },
      { label: 'Results', value: 'results' },
      { label: 'No Results', value: 'no-results' },
    ],
  },
  results: { type: 'slot' as const },
  noResults: { type: 'slot' as const },
  start: { type: 'slot' as const },
};

export const puckDefaults = {
  query: '',
  totalItems: 0,
  state: 'start',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['results', 'noResults', 'start'],
  runtimeSignals: ['searchParams', 'query', 'products'],
  matches: [
    { pageIncludes: ['app/search/page.tsx'], component: 'SearchStateSection' },
  ],
};

export async function puckDataFetcher(
  props: { query?: string },
  context?: PuckFetcherContext,
) {
  const query = props.query || getSearchParam(context, 'q') || getSearchParam(context, 'search');
  if (!query) return { state: 'start', totalItems: 0 };

  const result = await searchProducts(query, { pageSize: 1 });
  return {
    query: result.searchQuery || query,
    totalItems: result.totalItems || 0,
    state: result.totalItems > 0 ? 'results' : 'no-results',
  };
}

export function SearchStateSectionView({ state = 'start', results, noResults, start }: SearchStateSectionViewProps) {
  if (state === 'results') return <>{results?.()}</>;
  if (state === 'no-results') return <>{noResults?.()}</>;

  return (
    <>
      {start?.() || (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-6xl text-text-muted">search</span>
          <h2 className="mb-2 text-2xl font-bold text-text-base">Start Your Search</h2>
          <p className="mx-auto max-w-md text-text-muted">
            Enter a search term in the navigation bar to find products.
          </p>
        </div>
      )}
    </>
  );
}
