import { cache } from 'react';
import type { Category, Product, ProductSortValue } from '@/lib/api/types';
import { fetchCategories, fetchCategoryProducts } from '@/lib/api/services/categories';
import { PAGINATION, SORT_OPTIONS } from '@/lib/utils/constants';
import { getRouteParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface CategoryCatalogRuntimeData {
  category: Category;
  categories: Category[];
  siblingCategories: Category[];
  products: Product[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

type SearchParams = Record<string, string | string[] | undefined>;
const sortValues = new Set<string>(SORT_OPTIONS.map(({ value }) => value));

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function optionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function searchParamsKey(context?: PuckFetcherContext): string {
  const searchParams = context?.metadata?.searchParams ?? {};
  return JSON.stringify(
    Object.entries(searchParams)
      .map(([key, value]) => [key, firstValue(value)] as const)
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

const loadByKey = cache(async (
  categorySlug: string,
  key: string,
): Promise<CategoryCatalogRuntimeData | null> => {
  const searchParams = Object.fromEntries(JSON.parse(key) as Array<[string, string | undefined]>);
  const [categories] = await Promise.all([fetchCategories({ withStats: true })]);
  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) return null;

  const page = positiveInteger(searchParams.page, 1);
  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE;
  const sort = searchParams.sort;
  const productsData = await fetchCategoryProducts(category.slug, {
    q: searchParams.q?.trim() || undefined,
    minPrice: optionalNumber(searchParams.minPrice),
    maxPrice: optionalNumber(searchParams.maxPrice),
    inStock: searchParams.inStock === 'true' ? true : undefined,
    onSale: searchParams.onSale === 'true' ? true : undefined,
    sort: sort && sortValues.has(sort) ? sort as ProductSortValue : undefined,
    page,
    pageSize,
  });

  return {
    category,
    categories,
    siblingCategories: categories.filter(
      (item) => item.parentCategory === category.parentCategory && item._id !== category._id,
    ),
    products: productsData.items || [],
    totalItems: productsData.totalItems || 0,
    totalPages: productsData.totalPages || 0,
    page,
    pageSize,
  };
});

// The dynamic route is the only supported source of category identity.
export function loadCategoryCatalogRuntime(
  context?: PuckFetcherContext,
  categorySlug?: string,
): Promise<CategoryCatalogRuntimeData | null> {
  const resolvedSlug = categorySlug || getRouteParam(context, 'categorySlug');
  if (!resolvedSlug) return Promise.resolve(null);
  return loadByKey(resolvedSlug, searchParamsKey(context));
}
