import { CatalogPaginationCondition } from './CatalogPaginationCondition';
import { loadCatalogRuntime } from './catalogRuntime';
import { puckTransparentSlotProps, type CatalogSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CatalogPaginationConditionViewProps {
  hasPagination?: boolean;
  previewMode?: 'visible' | 'hidden';
  content?: CatalogSlot;
  puck?: { isEditing?: boolean };
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
  kind: 'runtime', slots: ['content'], sourceJsxNames: ['CatalogPaginationCondition'],
  sourceImportPaths: ['@/components/products/canonical/CatalogPaginationCondition'], role: 'catalog-pagination-condition',
  slotTarget: 'results', conditional: 'totalPages > 1', runtimeSignals: ['products.totalPages'],
};
export async function puckDataFetcher(_props: CatalogPaginationConditionViewProps, context?: PuckFetcherContext) {
  const runtime = await loadCatalogRuntime(context);
  return { hasPagination: runtime.productsData.totalPages > 1 };
}
export function CatalogPaginationConditionView(props: CatalogPaginationConditionViewProps) {
  const hasPagination = props.hasPagination ?? (props.puck?.isEditing ? props.previewMode === 'visible' : false);
  return <CatalogPaginationCondition hasPagination={hasPagination} content={props.content?.(puckTransparentSlotProps)} />;
}
