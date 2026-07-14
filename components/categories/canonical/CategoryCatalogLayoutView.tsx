import { CategoryCatalogLayout } from './CategoryCatalogLayout';
import type { CatalogSlot } from '@/components/products/canonical/types';

interface Props { breadcrumbs?: CatalogSlot; hero?: CatalogSlot; subcategories?: CatalogSlot; activeFilters?: CatalogSlot; content?: CatalogSlot; }
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
  sourceJsxNames: ['main', 'CategoryHero'], sourceImportPaths: ['@/components/categories/CategoryHero'],
  role: 'category-catalog-layout', requiredClasses: ['min-h-screen', 'bg-bg-base', 'text-text-base', 'max-w-[1440px]', 'px-6', 'lg:px-12', 'py-8'],
};
export function CategoryCatalogLayoutView(props: Props) {
  return <CategoryCatalogLayout breadcrumbs={props.breadcrumbs?.()} hero={props.hero?.()} subcategories={props.subcategories?.()} activeFilters={props.activeFilters?.()} content={props.content?.()} />;
}
