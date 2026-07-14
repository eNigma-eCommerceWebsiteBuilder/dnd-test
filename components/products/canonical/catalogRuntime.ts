import { cache } from 'react';
import type { Category, PaginatedProducts } from '@/lib/api/types';
import { fetchCategories } from '@/lib/api/services/categories';
import { fetchProducts, type FetchProductsParams } from '@/lib/api/services/products';
import { PAGINATION, SORT_OPTIONS } from '@/lib/utils/constants';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface CatalogRuntimeData {
  categories: Category[];
  productsData: PaginatedProducts;
  page: number;
  pageSize: number;
}

type CatalogSearchParams = Record<string, string | string[] | undefined>;

const sortValues = new Set<string>(SORT_OPTIONS.map(({ value }) => value));

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | undefined): number {
  const parsed = Number.parseInt(value || '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parsePrice(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildProductFilters(searchParams: CatalogSearchParams): FetchProductsParams {
  const sort = firstValue(searchParams.sort);
  const query = firstValue(searchParams.q)?.trim();

  return {
    page: parsePage(firstValue(searchParams.page)),
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    sort: sort && sortValues.has(sort) ? sort : undefined,
    category: firstValue(searchParams.category) || undefined,
    minPrice: parsePrice(firstValue(searchParams.minPrice)),
    maxPrice: parsePrice(firstValue(searchParams.maxPrice)),
    inStock: firstValue(searchParams.inStock) === 'true' ? true : undefined,
    onSale: firstValue(searchParams.onSale) === 'true' ? true : undefined,
    q: query || undefined,
  };
}

function runtimeKey(context?: PuckFetcherContext): string {
  const searchParams = context?.metadata?.searchParams ?? {};
  return JSON.stringify(
    Object.entries(searchParams)
      .map(([key, value]) => [key, firstValue(value)] as const)
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

const loadCatalogRuntimeByKey = cache(async (key: string): Promise<CatalogRuntimeData> => {
  const searchParams = Object.fromEntries(JSON.parse(key) as Array<[string, string | undefined]>);
  const filters = buildProductFilters(searchParams);
  const [productsData, categories] = await Promise.all([
    fetchProducts(filters),
    fetchCategories({ withStats: true }),
  ]);

  return {
    categories,
    productsData,
    page: filters.page || 1,
    pageSize: filters.pageSize || PAGINATION.DEFAULT_PAGE_SIZE,
  };
});

// All canonical catalog adapters use this request-scoped loader so their state agrees.
export function loadCatalogRuntime(context?: PuckFetcherContext): Promise<CatalogRuntimeData> {
  return loadCatalogRuntimeByKey(runtimeKey(context));
}
