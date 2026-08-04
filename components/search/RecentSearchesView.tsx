import { RecentSearches } from '@/enigma-components/search/RecentSearches';
import { getSearchParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';
interface Props { query?: string; }
export const puckComponentName = 'RecentSearches'; export const puckLabel = 'Recent Searches'; export const puckCategory = 'Search'; export const puckFields = { query: { type: 'text' as const, label: 'Current query' } }; export const puckDefaults = { query: '' };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['RecentSearches'], sourceImportPaths: ['@/components/search/RecentSearches'], role: 'search-recent-searches', slotTarget: 'content', runtimeSignals: ['searchParams.q'] };
export async function puckDataFetcher(props: Props, context?: PuckFetcherContext) { return { query: getSearchParam(context, 'q') || props.query || '' }; }
export function RecentSearchesView({ query = '' }: Props) { return <RecentSearches currentQuery={query} />; }
