import { CategoryCatalogBreadcrumbs } from './CategoryCatalogBreadcrumbs';
import { loadCategoryCatalogRuntime } from './categoryCatalogRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { categoryName?: string; }
export const puckComponentName = 'CategoryCatalogBreadcrumbs';
export const puckLabel = 'Category Breadcrumbs';
export const puckCategory = 'Categories';
export const puckFields = {};
export const puckDefaults = { categoryName: 'Outerwear' };
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['CategoryCatalogBreadcrumbs'], sourceImportPaths: ['@/components/categories/canonical/CategoryCatalogBreadcrumbs'],
  role: 'category-catalog-breadcrumbs', slotTarget: 'breadcrumbs', runtimeSignals: ['params.categorySlug'],
  requiredClasses: ['flex', 'items-center', 'gap-2', 'text-sm', 'text-text-muted', 'mb-6'],
};
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) {
  const runtime = await loadCategoryCatalogRuntime(context);
  return runtime ? { categoryName: runtime.category.name } : {};
}
export function CategoryCatalogBreadcrumbsView({ categoryName }: Props) { return <CategoryCatalogBreadcrumbs categoryName={categoryName} />; }
