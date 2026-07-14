import { fetchCategories } from '@/lib/api/services/categories';
import { fetchProducts } from '@/lib/api/services/products';
import type { Category, ProductSortValue } from '@/lib/api/types';
import {
  getBooleanSearchParam,
  getNumberSearchParam,
  getSearchParam,
  type PuckFetcherContext,
} from '@/lib/puck-route-metadata';

export function optionalCatalogNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function resolveCategoryFilterValue(
  value: string | undefined,
  categories: Category[],
): string | undefined {
  if (!value) return undefined;

  const matchedCategory = categories.find((category) => (
    category.slug === value
    || category._id === value
    || category.name === value
  ));

  return matchedCategory?.slug || value;
}

export async function fetchCatalogCategories(): Promise<Category[]> {
  return fetchCategories({ withStats: true });
}

export async function fetchCatalogProducts(
  context?: PuckFetcherContext,
  overrides: {
    searchQuery?: string;
    categoryFilter?: string;
    pageSize?: number;
  } = {},
) {
  const page = getNumberSearchParam(context, 'page', 1);
  const pageSize = overrides.pageSize || getNumberSearchParam(context, 'pageSize', 12);
  const categories = await fetchCatalogCategories();
  const categoryParam = overrides.categoryFilter
    || getSearchParam(context, 'category')
    || getSearchParam(context, 'categorySlug')
    || getSearchParam(context, 'categoryId');

  return fetchProducts({
    q: overrides.searchQuery || getSearchParam(context, 'q') || getSearchParam(context, 'search'),
    category: resolveCategoryFilterValue(categoryParam, categories),
    minPrice: optionalCatalogNumber(getSearchParam(context, 'minPrice')),
    maxPrice: optionalCatalogNumber(getSearchParam(context, 'maxPrice')),
    inStock: getBooleanSearchParam(context, 'inStock'),
    onSale: getBooleanSearchParam(context, 'onSale'),
    sort: getSearchParam(context, 'sort') as ProductSortValue | undefined,
    page,
    pageSize,
  });
}
