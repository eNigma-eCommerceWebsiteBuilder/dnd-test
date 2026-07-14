import type { Category } from '@/lib/api/types';
import { TrendingCategoryCard } from '@/enigma-components/categories/TrendingCategoryCard';
import { loadCategoriesPageRuntimeData } from './canonical/categoriesPageRuntime';

interface TrendingCategoryCardViewProps {
  category?: Category;
  position?: number;
  badge?: string;
}

const previewCategory: Category = {
  _id: 'trending-preview', name: 'Seasonal Favorites', slug: 'seasonal-favorites',
  imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200&q=80',
  description: 'Discover this season\'s most sought-after pieces, handpicked by our style team.',
  isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
};

export const puckComponentName = 'TrendingCategoryCard';
export const puckLabel = 'Trending Category Card';
export const puckCategory = 'Categories';
export const puckFields = {
  position: { type: 'number' as const, label: 'Trending position (0 or 1)' },
  badge: { type: 'text' as const, label: 'Badge text' },
};
export const puckDefaults = { category: previewCategory, position: 0, badge: 'Seasonal Pick' };
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['TrendingCategoryCard'], sourceImportPaths: ['@/components/categories/TrendingCategoryCard'],
  role: 'trending-category-card', slotTarget: 'cards', runtimeSignals: ['categories.topTrending'],
};
export async function puckDataFetcher(props: TrendingCategoryCardViewProps) {
  const runtime = await loadCategoriesPageRuntimeData();
  const position = props.position ?? 0;
  const category = runtime.topTrending[position];
  if (!category) return {};
  return { category, badge: position === 0 ? 'Seasonal Pick' : 'Trending Now' };
}
export function TrendingCategoryCardView({ category = previewCategory, badge = 'Trending Now' }: TrendingCategoryCardViewProps) {
  return <TrendingCategoryCard category={category} badge={badge} hrefPrefix="/page/category-detail" />;
}
