import { SearchAnalytics } from '@/enigma-components/search/SearchAnalytics';
import { loadSearchRuntime } from './canonical/searchRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';
interface Props { query?: string; resultCount?: number; }
export const puckComponentName = 'SearchAnalytics'; export const puckLabel = 'Search Analytics'; export const puckCategory = 'Search'; export const puckFields = {}; export const puckDefaults = { query: '', resultCount: 0 };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SearchAnalytics'], sourceImportPaths: ['@/components/search/SearchAnalytics'], role: 'search-analytics', slotTarget: 'analytics', runtimeSignals: ['searchParams.q', 'totalItems'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadSearchRuntime(context); return { query: runtime.query, resultCount: runtime.totalItems }; }
export function SearchAnalyticsView({ query = '', resultCount = 0 }: Props) { return <SearchAnalytics query={query} resultCount={resultCount} />; }
