import { apiRequest } from '../../core/client';
import { validateObjectId, validatePageNumber, validatePrice } from '../../utils/validators';
import type { Category, PaginatedProducts, ProductSort, ProductSortValue } from '../../types';

interface FetchCategoriesOptions {
  withStats?: boolean;
  withPricing?: boolean;
}

interface FetchCategoryProductsParams {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  sort?: ProductSort | ProductSortValue | string;
  page?: number;
  pageSize?: number;
  limit?: number;
}

// The backend currently serializes category identities as `id`, while the
// production component contract consistently reads `_id`.
type CategoryApiRecord = Omit<Category, '_id'> & {
  id?: string;
  _id?: string;
};

function normalizeCategory(category: CategoryApiRecord): Category {
  return {
    ...category,
    _id: category._id || category.id || category.slug,
  };
}

function normalizeCategories(categories: CategoryApiRecord[] | undefined): Category[] {
  return Array.isArray(categories) ? categories.map(normalizeCategory) : [];
}

export async function fetchCategories(options: FetchCategoriesOptions = {}): Promise<Category[]> {
  const params: Record<string, string> = {};

  if (options.withStats) {
    params.withStats = 'true';
  }
  if (options.withPricing) {
    params.withPricing = 'true';
  }

  const response = await apiRequest<{ items: CategoryApiRecord[]; totalItems: number }>('/categories', {
    params,
    revalidate: 300,
    tags: ['categories'],
  });
  return normalizeCategories(response.items);
}

export async function fetchTrendingCategories(): Promise<Category[]> {
  const response = await apiRequest<{ items: CategoryApiRecord[]; totalItems: number }>('/categories/trending', {
    revalidate: 120,
    tags: ['categories', 'trending'],
  });
  return normalizeCategories(response.items);
}

export async function fetchCategory(id: string): Promise<Category> {
  validateObjectId(id, 'Category ID');

  const category = await apiRequest<CategoryApiRecord>(`/categories/${id}`, {
    revalidate: 300,
    tags: ['categories', `category-${id}`],
  });
  return normalizeCategory(category);
}

export async function fetchCategoryProducts(
  slug: string,
  params: FetchCategoryProductsParams = {}
): Promise<PaginatedProducts> {
  validateCategorySlug(slug);
  const effectivePageSize = params.pageSize ?? params.limit;

  if (params.page !== undefined) {
    validatePageNumber(params.page);
  }
  if (effectivePageSize !== undefined) {
    validatePageNumber(effectivePageSize);
  }
  if (params.minPrice !== undefined) {
    validatePrice(params.minPrice);
  }
  if (params.maxPrice !== undefined) {
    validatePrice(params.maxPrice);
  }

  return apiRequest<PaginatedProducts>(`/categories/${encodeURIComponent(slug)}/products`, {
    params: {
      ...params,
      ...(effectivePageSize !== undefined && { pageSize: effectivePageSize }),
    } as Record<string, string | number | boolean>,
    revalidate: 30,
    tags: ['products', `category-${slug}-products`],
  });
}

function validateCategorySlug(slug: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Category slug is required and must contain only lowercase letters, numbers, and hyphens.');
  }
}
