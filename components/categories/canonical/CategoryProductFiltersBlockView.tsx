import type { Category } from '@/lib/api/types';
import { ProductFilters } from '@/components/products/ProductFilters';
import { loadCategoryCatalogRuntime } from './categoryCatalogRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { categories?: Category[]; }
export const puckComponentName = 'CategoryProductFiltersBlock';
export const puckLabel = 'Category Product Filters';
export const puckCategory = 'Categories';
export const puckFields = {};
export const puckDefaults = { categories: [] };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ProductFilters'], sourceImportPaths: ['@/components/products/ProductFilters'], role: 'category-catalog-filters', slotTarget: 'filters', runtimeSignals: ['category.categories', 'searchParams'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadCategoryCatalogRuntime(context); return runtime ? { categories: runtime.categories } : {}; }
export function CategoryProductFiltersBlockView({ categories = [] }: Props) { return <ProductFilters categories={categories} />; }
