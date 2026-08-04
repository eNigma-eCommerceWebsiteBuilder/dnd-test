import type { Category } from '@/lib/api/types';
import { SubcategoryNav } from '@/enigma-components/categories/SubcategoryNav';
import { loadCategoryCatalogRuntime } from './canonical/categoryCatalogRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface SubcategoryItem {
  name: string;
  slug: string;
  productCount?: number;
}

interface SubcategoryNavViewProps {
  items?: SubcategoryItem[];
  categories?: Category[];
  runtimeCategories?: Category[];
  currentSlug?: string;
}

export const puckComponentName = 'SubcategoryNav';
export const puckLabel = 'Subcategory Navigation';
export const puckCategory = 'Categories';

export const puckFields = {
  items: {
    type: 'array' as const,
    label: 'Subcategories',
    arrayFields: {
      name: { type: 'text' as const, label: 'Name' },
      slug: { type: 'text' as const, label: 'Slug' },
      productCount: { type: 'number' as const, label: 'Product Count' },
    },
    defaultItemProps: {
      name: 'New Subcategory',
      slug: 'new-subcategory',
      productCount: 0,
    },
    getItemSummary: (item: SubcategoryItem) => item.name,
  },
  currentSlug: { type: 'text' as const, label: 'Current Slug (highlight)' },
};

export const puckDefaults = {
  items: [
    { name: 'Jackets', slug: 'jackets', productCount: 15 },
    { name: 'Coats', slug: 'coats', productCount: 12 },
    { name: 'Vests', slug: 'vests', productCount: 8 },
  ],
  currentSlug: '',
};


export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['SubcategoryNav'], sourceImportPaths: ['@/components/categories/SubcategoryNav'],
  role: 'category-subcategory-nav', slotTarget: 'subcategories', runtimeSignals: ['category.siblings', 'params.categorySlug'],
};

export async function puckDataFetcher(_props: Record<string, never>, context?: PuckFetcherContext) {
  const runtime = await loadCategoryCatalogRuntime(context);
  return runtime ? {
    runtimeCategories: runtime.siblingCategories,
    currentSlug: runtime.category.slug,
  } : {};
}

export function SubcategoryNavView({ items, categories, runtimeCategories, currentSlug }: SubcategoryNavViewProps) {
  const previewCategories: Category[] = categories || (items || []).map((item) => ({
    _id: item.slug, name: item.name, slug: item.slug, productCount: item.productCount,
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  }));
  return <SubcategoryNav categories={runtimeCategories ?? previewCategories} currentSlug={currentSlug} />;
}
