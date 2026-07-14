import { CatalogActiveFiltersBoundary } from './CatalogActiveFiltersBoundary';
import type { CatalogSlot } from './types';

interface CatalogActiveFiltersBoundaryViewProps { content?: CatalogSlot; }

export const puckComponentName = 'CatalogActiveFiltersBoundary';
export const puckLabel = 'Catalog Active Filters Boundary';
export const puckCategory = 'Products';
export const puckFields = { content: { type: 'slot' as const, allow: ['ActiveFiltersBlock'] } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime', slots: ['content'], sourceJsxNames: ['Suspense', 'ActiveFilters'],
  sourceImportPaths: ['@/components/products/ActiveFilters'], role: 'catalog-active-filters-boundary',
  slotTarget: 'activeFilters', suspenseFallback: 'null', runtimeSignals: ['searchParams'],
};
export function CatalogActiveFiltersBoundaryView({ content }: CatalogActiveFiltersBoundaryViewProps) {
  return <CatalogActiveFiltersBoundary content={content?.()} />;
}
