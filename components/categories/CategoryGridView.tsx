import type { Category } from '@/lib/api/types';
import { CategoryGrid } from '@/enigma-components/categories/CategoryGrid';
import { loadCategoriesPageRuntimeData } from './canonical/categoriesPageRuntime';

interface CategoryGridViewProps {
  categories?: Category[];
  showConciergeCard?: boolean;
}

const previewCategories: Category[] = [
  { _id: 'department-preview-1', name: 'Accessories', slug: 'accessories', imageUrl: 'https://images.unsplash.com/photo-1506629905607-5328f19e2d26?w=600&q=80', productCount: 2, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { _id: 'department-preview-2', name: 'Footwear', slug: 'footwear', imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80', productCount: 1, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

export const puckComponentName = 'CategoryGrid';
export const puckLabel = 'Category Grid';
export const puckCategory = 'Categories';
export const puckFields = {};
export const puckDefaults = { categories: previewCategories, showConciergeCard: true };
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['CategoryGrid'], sourceImportPaths: ['@/components/categories/CategoryGrid'],
  role: 'categories-page-grid', slotTarget: 'grid', runtimeSignals: ['categories.main'],
};
export async function puckDataFetcher() {
  const runtime = await loadCategoriesPageRuntimeData();
  return { categories: runtime.mainCategories, showConciergeCard: runtime.mainCategories.length > 0 };
}

// Deliberately delegates to the production category grid rather than recreating cards in Puck.
export function CategoryGridView({ categories = previewCategories, showConciergeCard = true }: CategoryGridViewProps) {
  return <CategoryGrid categories={categories} showConciergeCard={showConciergeCard} hrefPrefix="/page/category-detail" />;
}
