import { cache } from 'react';
import type { Category, Product, ProductSortValue } from '@/lib/api/types';
import { fetchCategories } from '@/lib/api/services/categories';
import { searchProducts } from '@/lib/api/services/products';
import { PAGINATION, SORT_OPTIONS } from '@/lib/utils/constants';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface SearchRuntimeData {
  query: string;
  page: number;
  pageSize: number;
  categories: Category[];
  products: Product[];
  totalItems: number;
  totalPages: number;
}

type SearchParams = Record<string, string | undefined>;
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

async function withNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}

const loadByKey = cache(async (key: string): Promise<SearchRuntimeData> => {
  const searchParams: SearchParams = Object.fromEntries(
    JSON.parse(key) as Array<[string, string | undefined]>,
  );
  const query = searchParams.q?.trim() || '';
  const page = positiveInteger(searchParams.page, 1);
  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE;
  const sort = searchParams.sort;
  const fetchParams = {
    page,
    pageSize,
    sort: sort && sortValues.has(sort) ? sort as ProductSortValue : undefined,
    category: searchParams.category || undefined,
    minPrice: optionalNumber(searchParams.minPrice),
    maxPrice: optionalNumber(searchParams.maxPrice),
    inStock: searchParams.inStock === 'true' ? true : undefined,
    onSale: searchParams.onSale === 'true' ? true : undefined,
  };

  const categoriesPromise = fetchCategories({ withStats: true });
  if (!query) {
    return {
      query,
      page,
      pageSize,
      categories: await categoriesPromise,
      products: [],
      totalItems: 0,
      totalPages: 0,
    };
  }

  const [searchData, categories] = await Promise.all([
    withNull(searchProducts(query, fetchParams)),
    categoriesPromise,
  ]);

  return {
    query,
    page,
    pageSize,
    categories,
    products: searchData?.items || [],
    totalItems: searchData?.totalItems || 0,
    totalPages: searchData?.totalPages || 0,
  };
});

export function loadSearchRuntime(context?: PuckFetcherContext): Promise<SearchRuntimeData> {
  return loadByKey(searchParamsKey(context));
}
