import { CategoryCatalogResultsState } from './CategoryCatalogResultsState';
import { loadCategoryCatalogRuntime } from './categoryCatalogRuntime';
import type { CatalogSlot } from '@/components/products/canonical/types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { hasProducts?: boolean; previewMode?: 'results' | 'empty'; results?: CatalogSlot; empty?: CatalogSlot; }
export const puckComponentName = 'CategoryCatalogResultsState';
export const puckLabel = 'Category Results State';
export const puckCategory = 'Categories';
export const puckFields = { previewMode: { type: 'select' as const, options: [{ label: 'Results', value: 'results' }, { label: 'Empty', value: 'empty' }] }, results: { type: 'slot' as const, allow: ['CategoryCatalogResultsHeader', 'CategoryCatalogGridBoundary', 'CategoryCatalogPaginationCondition'] }, empty: { type: 'slot' as const, allow: ['EmptyCategory'] } };
export const puckDefaults = { previewMode: 'results', results: [], empty: [] };
export const puckAst = { kind: 'runtime', slots: ['results', 'empty'], sourceJsxNames: ['ProductGrid', 'EmptyCategory'], sourceImportPaths: ['@/components/products/ProductGrid', '@/components/categories/EmptyCategory'], role: 'category-catalog-results-state', slotTarget: 'results', conditional: 'products.length > 0', runtimeSignals: ['category.products'], requiredClasses: ['flex-1'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadCategoryCatalogRuntime(context); return runtime ? { hasProducts: runtime.products.length > 0 } : {}; }
export function CategoryCatalogResultsStateView(props: Props) { return <CategoryCatalogResultsState hasProducts={props.hasProducts} previewMode={props.previewMode} results={props.results?.()} empty={props.empty?.()} />; }
