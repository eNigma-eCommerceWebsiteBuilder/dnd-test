import { CategoryCatalogPaginationCondition } from './CategoryCatalogPaginationCondition';
import { loadCategoryCatalogRuntime } from './categoryCatalogRuntime';
import { puckTransparentSlotProps, type CategoriesSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { hasPagination?: boolean; previewMode?: 'visible' | 'hidden'; content?: CategoriesSlot; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'CategoryCatalogPaginationCondition';
export const puckLabel = 'Category Pagination Condition';
export const puckCategory = 'Categories';
export const puckFields = { previewMode: { type: 'select' as const, options: [{ label: 'Visible', value: 'visible' }, { label: 'Hidden', value: 'hidden' }] }, content: { type: 'slot' as const, allow: ['CategoryCatalogPaginationBlock'] } };
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['CategoryCatalogPaginationCondition', 'Pagination'], sourceImportPaths: ['@/components/categories/canonical/CategoryCatalogPaginationCondition', '@/components/products/Pagination'], role: 'category-catalog-pagination-condition', slotTarget: 'results', conditional: 'totalPages > 1', runtimeSignals: ['category.totalPages'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadCategoryCatalogRuntime(context); return runtime ? { hasPagination: runtime.totalPages > 1 } : {}; }
export function CategoryCatalogPaginationConditionView(props: Props) {
  const hasPagination = props.hasPagination ?? (props.puck?.isEditing ? props.previewMode !== 'hidden' : false);
  return <CategoryCatalogPaginationCondition hasPagination={hasPagination} content={props.content?.(puckTransparentSlotProps)} />;
}
