import { Pagination } from '@/components/products/Pagination';
import { loadSearchRuntime } from './canonical/searchRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';
interface Props { currentPage?: number; totalPages?: number; }
export const puckComponentName = 'SearchPagination'; export const puckLabel = 'Search Pagination'; export const puckCategory = 'Search'; export const puckFields = {}; export const puckDefaults = { currentPage: 1, totalPages: 0 };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['Pagination'], sourceImportPaths: ['@/components/products/Pagination'], role: 'search-pagination', slotTarget: 'content', runtimeSignals: ['page', 'totalPages'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadSearchRuntime(context); return { currentPage: runtime.page, totalPages: runtime.totalPages }; }
export function SearchPaginationView({ currentPage = 1, totalPages = 0 }: Props) { return <Pagination currentPage={currentPage} totalPages={totalPages} className="mt-16 md:mt-20" />; }
