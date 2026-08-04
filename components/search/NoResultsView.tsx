import { NoResults } from '@/enigma-components/search/NoResults';
import { loadSearchRuntime } from './canonical/searchRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface NoResultsViewProps {
  query: string;
  className?: string;
}

export const puckComponentName = 'NoResults';
export const puckLabel = 'No Search Results';
export const puckCategory = 'Search';

export const puckFields = {
  query: { type: 'text' as const, label: 'Search Query' },
};

export const puckDefaults = {
  query: '',
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['NoResults'], sourceImportPaths: ['@/components/search/NoResults'], role: 'search-no-results', slotTarget: 'noResults', runtimeSignals: ['searchParams.q', 'searchProducts.items'] };

export async function puckDataFetcher(_props: NoResultsViewProps, context?: PuckFetcherContext) {
  const runtime = await loadSearchRuntime(context);
  return { query: runtime.query };
}

export function NoResultsView({ query, className }: NoResultsViewProps) {
  return <NoResults query={query} className={className} />;
}
