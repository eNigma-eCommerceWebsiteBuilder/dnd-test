import type { Category } from '@/lib/api/types';
import { CategoryHero } from '@/enigma-components/categories/CategoryHero';
import { loadCategoryCatalogRuntime } from './canonical/categoryCatalogRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CategoryHeroViewProps {
  category?: Category;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
  className?: string;
}

export const puckComponentName = 'CategoryHero';
export const puckLabel = 'Category Hero';
export const puckCategory = 'Categories';

export const puckFields = {
  categorySlug: { type: 'text' as const, label: 'Category Slug (auto-fill from category)' },
  name: { type: 'text' as const, label: 'Category Name' },
  description: { type: 'textarea' as const, label: 'Description' },
  image: { type: 'text' as const, label: 'Image URL' },
  productCount: { type: 'number' as const, label: 'Product Count' },
};

export const puckDefaults = {
  categorySlug: 'outerwear',
  name: 'Outerwear',
  description: 'Premium outerwear crafted from the finest materials for the discerning individual.',
  image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1600&q=80',
  productCount: 42,
};

export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['CategoryHero'], sourceImportPaths: ['@/components/categories/CategoryHero'],
  role: 'category-hero', slotTarget: 'hero', runtimeSignals: ['params.categorySlug', 'category.totalItems'],
};

export async function puckDataFetcher(props: { categorySlug?: string }, context?: PuckFetcherContext) {
  const runtime = await loadCategoryCatalogRuntime(context, props.categorySlug);
  return runtime ? { category: runtime.category, productCount: runtime.totalItems } : {};
}


export function CategoryHeroView({
  category,
  name,
  description,
  image,
  productCount = 0,
  className,
}: CategoryHeroViewProps) {
  const previewCategory: Category = category || {
    _id: 'category-preview', name, slug: 'category-preview', description,
    image, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  };
  return <CategoryHero category={previewCategory} productCount={productCount} className={className} />;
}
