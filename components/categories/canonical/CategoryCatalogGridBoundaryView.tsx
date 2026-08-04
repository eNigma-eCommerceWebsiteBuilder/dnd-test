import { CategoryCatalogGridBoundary } from './CategoryCatalogGridBoundary';
import { loadCategoryCatalogRuntime } from './categoryCatalogRuntime';
import { puckTransparentSlotProps, type CategoriesSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { pageSize?: number; grid?: CategoriesSlot; }
export const puckComponentName = 'CategoryCatalogGridBoundary';
export const puckLabel = 'Category Grid Loading Boundary';
export const puckCategory = 'Categories';
export const puckFields = { grid: { type: 'slot' as const, allow: ['CategoryProductGridBlock'] } };
export const puckDefaults = { pageSize: 12, grid: [] };
export const puckAst = { kind: 'runtime', slots: ['grid'], sourceJsxNames: ['CategoryCatalogGridBoundary', 'ProductGrid'], sourceImportPaths: ['@/components/categories/canonical/CategoryCatalogGridBoundary', '@/components/products/ProductGrid'], role: 'category-catalog-grid-boundary', slotTarget: 'results', suspenseFallback: 'ProductGridSkeleton(count=pageSize)', runtimeSignals: ['category.pageSize'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadCategoryCatalogRuntime(context); return runtime ? { pageSize: runtime.pageSize } : {}; }
export function CategoryCatalogGridBoundaryView({ pageSize, grid }: Props) { return <CategoryCatalogGridBoundary pageSize={pageSize} grid={grid?.(puckTransparentSlotProps)} />; }
