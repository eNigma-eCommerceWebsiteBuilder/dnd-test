import { CatalogPaginationCondition } from './CatalogPaginationCondition';
import { loadCatalogRuntime } from './catalogRuntime';
import type { CatalogSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CatalogPaginationConditionViewProps {
  hasPagination?: boolean;
  previewMode?: 'visible' | 'hidden';
  content?: CatalogSlot;
}

export const puckComponentName = 'CatalogPaginationCondition';
export const puckLabel = 'Catalog Pagination Condition';
export const puckCategory = 'Products';
export const puckFields = {
  previewMode: {
    type: 'select' as const, label: 'Editor preview state',
    options: [{ label: 'Visible', value: 'visible' }, { label: 'Hidden', value: 'hidden' }],
  },
  content: { type: 'slot' as const, allow: ['CatalogPaginationBlock'] },
};
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = {
  kind: 'runtime', slots: ['content'], sourceJsxNames: ['Pagination'],
  sourceImportPaths: ['@/components/products/Pagination'], role: 'catalog-pagination-condition',
  slotTarget: 'results', conditional: 'totalPages > 1', runtimeSignals: ['products.totalPages'],
};
export async function puckDataFetcher(_props: CatalogPaginationConditionViewProps, context?: PuckFetcherContext) {
  const runtime = await loadCatalogRuntime(context);
  return { hasPagination: runtime.productsData.totalPages > 1 };
}
export function CatalogPaginationConditionView(props: CatalogPaginationConditionViewProps) {
  return <CatalogPaginationCondition hasPagination={props.hasPagination} previewMode={props.previewMode} content={props.content?.()} />;
}
