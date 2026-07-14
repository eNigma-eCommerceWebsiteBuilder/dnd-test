import { Pagination } from './Pagination';
import { loadCatalogRuntime } from './canonical/catalogRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CatalogPaginationBlockViewProps {
  currentPage?: number;
  totalPages?: number;
}

export const puckComponentName = 'CatalogPaginationBlock';
export const puckLabel = 'Catalog Pagination';
export const puckCategory = 'Products';

export const puckFields = {
  currentPage: { type: 'number' as const, label: 'Editor preview current page' },
  totalPages: { type: 'number' as const, label: 'Editor preview total pages' },
};

export const puckDefaults = {
  currentPage: 1,
  totalPages: 4,
};

export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['Pagination'],
  sourceImportPaths: ['@/components/products/Pagination'],
  role: 'catalog-pagination',
  slotTarget: 'results',
  runtimeSignals: ['products.totalPages', 'searchParams.page'],
  matches: [
    { pageIncludes: ['app/products/page.tsx'], componentName: 'Pagination' },
  ],
};

export async function puckDataFetcher(
  _props: CatalogPaginationBlockViewProps,
  context?: PuckFetcherContext,
) {
  const runtime = await loadCatalogRuntime(context);
  return {
    currentPage: runtime.page,
    totalPages: runtime.productsData.totalPages || 0,
  };
}

export function CatalogPaginationBlockView({
  currentPage = 1,
  totalPages = 0,
}: CatalogPaginationBlockViewProps) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      className="mt-16 md:mt-20"
    />
  );
}
