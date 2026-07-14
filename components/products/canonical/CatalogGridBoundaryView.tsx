import { CatalogGridBoundary } from './CatalogGridBoundary';
import { loadCatalogRuntime } from './catalogRuntime';
import type { CatalogSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CatalogGridBoundaryViewProps { pageSize?: number; grid?: CatalogSlot; }

export const puckComponentName = 'CatalogGridBoundary';
export const puckLabel = 'Catalog Grid Loading Boundary';
export const puckCategory = 'Products';
export const puckFields = { grid: { type: 'slot' as const, allow: ['ProductGrid'] } };
export const puckDefaults = { pageSize: 12, grid: [] };
export const puckAst = {
  kind: 'runtime', slots: ['grid'], sourceJsxNames: ['Suspense', 'ProductGrid', 'ProductGridSkeleton'],
  sourceImportPaths: ['@/components/products/ProductGrid', '@/components/products/ProductGridSkeleton'],
  role: 'catalog-grid-boundary', slotTarget: 'results', suspenseFallback: 'ProductGridSkeleton(count=pageSize)',
  runtimeSignals: ['products.pageSize'],
};
export async function puckDataFetcher(_props: CatalogGridBoundaryViewProps, context?: PuckFetcherContext) {
  const runtime = await loadCatalogRuntime(context);
  return { pageSize: runtime.pageSize };
}
export function CatalogGridBoundaryView({ pageSize, grid }: CatalogGridBoundaryViewProps) { return <CatalogGridBoundary pageSize={pageSize} grid={grid?.()} />; }
