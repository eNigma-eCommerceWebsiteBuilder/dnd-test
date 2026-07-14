import { CategoryCatalogFilterSidebar } from './CategoryCatalogFilterSidebar';
import type { CatalogSlot } from '@/components/products/canonical/types';

interface Props { filters?: CatalogSlot; }
export const puckComponentName = 'CategoryCatalogFilterSidebar';
export const puckLabel = 'Category Filter Sidebar';
export const puckCategory = 'Categories';
export const puckFields = { filters: { type: 'slot' as const, allow: ['CategoryProductFiltersBlock'] } };
export const puckDefaults = { filters: [] };
export const puckAst = { kind: 'runtime', slots: ['filters'], sourceJsxNames: ['Suspense', 'ProductFilters'], sourceImportPaths: ['@/components/products/ProductFilters'], role: 'category-catalog-filter-sidebar', slotTarget: 'sidebar', suspenseFallback: 'category-filter-skeleton', requiredClasses: ['w-full', 'lg:w-[280px]', 'flex-shrink-0'] };
export function CategoryCatalogFilterSidebarView({ filters }: Props) { return <CategoryCatalogFilterSidebar filters={filters?.()} />; }
