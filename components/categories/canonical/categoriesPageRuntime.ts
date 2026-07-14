import { cache } from 'react';
import type { Category } from '@/lib/api/types';
import { fetchCategories, fetchTrendingCategories } from '@/lib/api/services/categories';

export interface CategoriesPageRuntimeData {
  categories: Category[];
  topTrending: Category[];
  mainCategories: Category[];
}

const loadCategoriesPageRuntime = cache(async (): Promise<CategoriesPageRuntimeData> => {
  const [categories, trendingCategories] = await Promise.all([
    fetchCategories({ withStats: true }),
    fetchTrendingCategories(),
  ]);
  const topTrending = trendingCategories.slice(0, 2);
  const trendingIds = new Set(topTrending.map((category) => category._id));

  return {
    categories,
    topTrending,
    mainCategories: categories.filter((category) => !trendingIds.has(category._id)),
  };
});

export function loadCategoriesPageRuntimeData(): Promise<CategoriesPageRuntimeData> {
  return loadCategoriesPageRuntime();
}
