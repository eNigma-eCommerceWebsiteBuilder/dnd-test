import { CategoryCatalogFilterSidebar } from './CategoryCatalogFilterSidebar';
import { puckTransparentSlotProps, type CategoriesSlot } from './types';

interface Props { filters?: CategoriesSlot; }
export const puckComponentName = 'CategoryCatalogFilterSidebar';
export const puckLabel = 'Category Filter Sidebar';
export const puckCategory = 'Categories';
export const puckFields = { filters: { type: 'slot' as const, allow: ['CategoryProductFiltersBlock'] } };
export const puckDefaults = { filters: [] };
export const puckAst = { kind: 'runtime', slots: ['filters'], sourceJsxNames: ['CategoryCatalogFilterSidebar', 'ProductFilters'], sourceImportPaths: ['@/components/categories/canonical/CategoryCatalogFilterSidebar', '@/components/products/ProductFilters'], role: 'category-catalog-filter-sidebar', slotTarget: 'sidebar', suspenseFallback: 'category-filter-skeleton', requiredClasses: ['w-full', 'lg:w-[280px]', 'flex-shrink-0'] };
export function CategoryCatalogFilterSidebarView({ filters }: Props) { return <CategoryCatalogFilterSidebar filters={filters?.(puckTransparentSlotProps)} />; }
