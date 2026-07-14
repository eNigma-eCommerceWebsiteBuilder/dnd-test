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
  items: SubcategoryItem[];
  currentSlug?: string;
  parentSlug?: string;
  className?: string;
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
  parentSlug: { type: 'text' as const, label: 'Parent Slug (for "All" link)' },
};

export const puckDefaults = {
  items: [
    { name: 'Jackets', slug: 'jackets', productCount: 15 },
    { name: 'Coats', slug: 'coats', productCount: 12 },
    { name: 'Vests', slug: 'vests', productCount: 8 },
  ],
  currentSlug: '',
  parentSlug: '',
};


export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['SubcategoryNav'], sourceImportPaths: ['@/components/categories/SubcategoryNav'],
  role: 'category-subcategory-nav', slotTarget: 'subcategories', runtimeSignals: ['category.siblings', 'params.categorySlug'],
};

export async function puckDataFetcher(_props: { parentSlug?: string }, context?: PuckFetcherContext) {
  const runtime = await loadCategoryCatalogRuntime(context);
  return runtime ? {
    items: runtime.siblingCategories.map((category) => ({ name: category.name, slug: category.slug, productCount: category.productCount })),
    currentSlug: runtime.category.slug,
    parentSlug: runtime.category.parentCategory || '',
  } : {};
}

export function SubcategoryNavView({ items, currentSlug, parentSlug, className }: SubcategoryNavViewProps) {
  const categories: Category[] = (items || []).map((item) => ({
    _id: item.slug, name: item.name, slug: item.slug, productCount: item.productCount,
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  }));
  return <SubcategoryNav categories={categories} currentSlug={currentSlug} parentSlug={parentSlug} />;
}
