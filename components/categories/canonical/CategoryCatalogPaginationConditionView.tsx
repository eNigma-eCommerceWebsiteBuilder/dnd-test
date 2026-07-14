import { CategoryCatalogPaginationCondition } from './CategoryCatalogPaginationCondition';
import { loadCategoryCatalogRuntime } from './categoryCatalogRuntime';
import type { CatalogSlot } from '@/components/products/canonical/types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { hasPagination?: boolean; previewMode?: 'visible' | 'hidden'; content?: CatalogSlot; }
export const puckComponentName = 'CategoryCatalogPaginationCondition';
export const puckLabel = 'Category Pagination Condition';
export const puckCategory = 'Categories';
export const puckFields = { previewMode: { type: 'select' as const, options: [{ label: 'Visible', value: 'visible' }, { label: 'Hidden', value: 'hidden' }] }, content: { type: 'slot' as const, allow: ['CategoryCatalogPaginationBlock'] } };
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['Pagination'], sourceImportPaths: ['@/components/products/Pagination'], role: 'category-catalog-pagination-condition', slotTarget: 'results', conditional: 'totalPages > 1', runtimeSignals: ['category.totalPages'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadCategoryCatalogRuntime(context); return runtime ? { hasPagination: runtime.totalPages > 1 } : {}; }
export function CategoryCatalogPaginationConditionView(props: Props) { return <CategoryCatalogPaginationCondition hasPagination={props.hasPagination} previewMode={props.previewMode} content={props.content?.()} />; }
