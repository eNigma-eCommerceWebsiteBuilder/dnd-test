import { Pagination } from '@/components/products/Pagination';
import { loadCategoryCatalogRuntime } from './categoryCatalogRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { currentPage?: number; totalPages?: number; }
export const puckComponentName = 'CategoryCatalogPaginationBlock';
export const puckLabel = 'Category Pagination';
export const puckCategory = 'Categories';
export const puckFields = {};
export const puckDefaults = { currentPage: 1, totalPages: 4 };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['Pagination'], sourceImportPaths: ['@/components/products/Pagination'], role: 'category-catalog-pagination', slotTarget: 'results', runtimeSignals: ['category.totalPages', 'searchParams.page'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadCategoryCatalogRuntime(context); return runtime ? { currentPage: runtime.page, totalPages: runtime.totalPages } : {}; }
export function CategoryCatalogPaginationBlockView({ currentPage = 1, totalPages = 0 }: Props) { return <Pagination currentPage={currentPage} totalPages={totalPages} className="mt-16 md:mt-20" />; }
