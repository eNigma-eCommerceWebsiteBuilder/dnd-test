import type { Category } from '@/lib/api/types';
import { ProductFilters } from './ProductFilters';
import { loadCatalogRuntime } from './canonical/catalogRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface ProductFiltersBlockViewProps {
  categories?: Category[];
}

const previewCategories: Category[] = [
  {
    _id: 'preview-outerwear',
    name: 'Outerwear',
    slug: 'outerwear',
    isActive: true,
    productCount: 24,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'preview-accessories',
    name: 'Accessories',
    slug: 'accessories',
    isActive: true,
    productCount: 18,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const puckComponentName = 'ProductFiltersBlock';
export const puckLabel = 'Product Filter Sidebar';
export const puckCategory = 'Products';

export const puckFields = {
  categories: {
    type: 'array' as const,
    label: 'Editor preview categories',
    arrayFields: {
      _id: { type: 'text' as const, label: 'ID' },
      name: { type: 'text' as const, label: 'Name' },
      slug: { type: 'text' as const, label: 'Slug' },
      productCount: { type: 'number' as const, label: 'Product count' },
    },
    defaultItemProps: {
      _id: 'preview-category',
      name: 'Preview Category',
      slug: 'preview-category',
      productCount: 12,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
};

export const puckDefaults = {
  categories: previewCategories,
};

export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['ProductFilters'],
  sourceImportPaths: ['@/components/products/ProductFilters'],
  role: 'catalog-desktop-filters',
  slotTarget: 'filters',
  runtimeSignals: ['categories', 'searchParams'],
  matches: [
    { pageIncludes: ['app/products/page.tsx'], componentName: 'ProductFilters' },
  ],
};

export async function puckDataFetcher(_props: ProductFiltersBlockViewProps, context?: PuckFetcherContext) {
  const runtime = await loadCatalogRuntime(context);
  return { categories: runtime.categories };
}

export function ProductFiltersBlockView({
  categories = previewCategories,
}: ProductFiltersBlockViewProps) {
  return <ProductFilters categories={categories} />;
}
