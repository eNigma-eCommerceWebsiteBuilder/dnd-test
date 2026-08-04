import { CategoryCatalogLayout } from './CategoryCatalogLayout';
import { puckTransparentSlotProps, type CategoriesSlot } from './types';

interface Props { breadcrumbs?: CategoriesSlot; hero?: CategoriesSlot; subcategories?: CategoriesSlot; activeFilters?: CategoriesSlot; content?: CategoriesSlot; }
export const puckComponentName = 'CategoryCatalogLayout';
export const puckLabel = 'Category Catalog Layout';
export const puckCategory = 'Categories';
export const puckFields = {
  breadcrumbs: { type: 'slot' as const, allow: ['CategoryCatalogBreadcrumbs'] },
  hero: { type: 'slot' as const, allow: ['CategoryHero'] },
  subcategories: { type: 'slot' as const, allow: ['CategorySubcategoryCondition'] },
  activeFilters: { type: 'slot' as const, allow: ['CatalogActiveFiltersBoundary'] },
  content: { type: 'slot' as const, allow: ['CatalogContentLayout'] },
};
export const puckDefaults = { breadcrumbs: [], hero: [], subcategories: [], activeFilters: [], content: [] };
export const puckAst = {
  kind: 'runtime', slots: ['breadcrumbs', 'hero', 'subcategories', 'activeFilters', 'content'],
  sourceJsxNames: ['CategoryCatalogLayout'], sourceImportPaths: ['@/components/categories/canonical/CategoryCatalogLayout'],
  role: 'category-catalog-layout', requiredClasses: ['min-h-screen', 'bg-bg-base', 'text-text-base', 'max-w-[1440px]', 'px-6', 'lg:px-12', 'py-8'],
};
export function CategoryCatalogLayoutView(props: Props) {
  return <CategoryCatalogLayout breadcrumbs={props.breadcrumbs?.(puckTransparentSlotProps)} hero={props.hero?.(puckTransparentSlotProps)} subcategories={props.subcategories?.(puckTransparentSlotProps)} activeFilters={props.activeFilters?.(puckTransparentSlotProps)} content={props.content?.(puckTransparentSlotProps)} />;
}
