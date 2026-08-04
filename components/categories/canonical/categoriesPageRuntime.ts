import { cache } from 'react';
import type { Category } from '@/lib/api/types';
import { fetchCategories, fetchTrendingCategories } from '@/lib/api/services/categories';

export interface CategoriesPageRuntimeData {
  categories: Category[];
  topTrending: Category[];
  mainCategories: Category[];
}

const loadCategoriesPageRuntime = cache(async (): Promise<CategoriesPageRuntimeData> => {
  let categories: Category[] = [];
  let trendingCategories: Category[] = [];

  try {
    [categories, trendingCategories] = await Promise.all([
      fetchCategories({ withStats: true }),
      fetchTrendingCategories(),
    ]);
  } catch (error) {
    // Preserve app/categories/page.tsx's build-resilient empty-state behavior.
    if (process.env.NODE_ENV !== 'production') console.error('Error fetching categories during SSG/ISR:', error);
  }

  if (!Array.isArray(categories)) categories = [];
  if (!Array.isArray(trendingCategories)) trendingCategories = [];
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
