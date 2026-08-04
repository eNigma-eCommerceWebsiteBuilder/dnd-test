import { CatalogFilterSidebar } from './CatalogFilterSidebar';
import { puckTransparentSlotProps, type CatalogSlot } from './types';

interface CatalogFilterSidebarViewProps { filters?: CatalogSlot; }

export const puckComponentName = 'CatalogFilterSidebar';
export const puckLabel = 'Catalog Filter Sidebar';
export const puckCategory = 'Products';
export const puckFields = { filters: { type: 'slot' as const, allow: ['ProductFiltersBlock'] } };
export const puckDefaults = { filters: [] };
export const puckAst = {
  kind: 'runtime', slots: ['filters'], sourceJsxNames: ['CatalogFilterSidebar'],
  sourceImportPaths: ['@/components/products/canonical/CatalogFilterSidebar'], role: 'catalog-filter-sidebar',
  slotTarget: 'sidebar', suspenseFallback: 'catalog-filter-skeleton', runtimeSignals: ['categories'],
  requiredClasses: ['hidden', 'lg:block', 'w-[280px]', 'flex-shrink-0'],
};
export function CatalogFilterSidebarView({ filters }: CatalogFilterSidebarViewProps) { return <CatalogFilterSidebar filters={filters?.(puckTransparentSlotProps)} />; }
