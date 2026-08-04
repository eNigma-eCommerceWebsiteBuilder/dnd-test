import { apiRequest } from '../../core/client';
import { validatePageNumber, validatePrice } from '../../utils/validators';
import type {
  PaginatedProducts,
  Product,
  ProductReviewSort,
  ProductReviewSortValue,
  ProductReviewsApiResponse,
  ProductSort,
  ProductSortValue,
  ReviewSort,
  ReviewsResponse,
} from '../../types';
import { normalizeProductReviewsResponse } from '../reviews/normalizers';

export interface FetchProductsParams {
  q?: string;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  sort?: ProductSort | ProductSortValue | string;
  page?: number;
  pageSize?: number;
  limit?: number;
}

interface SearchProductsResponse {
  items: Product[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  searchQuery: string;
}

type ProductApiRecord = Omit<Product, '_id' | 'images'> & {
  _id?: string;
  id?: string;
  images?: string[] | null;
};

// The Puck test backend returns `id`, while the production component contract uses `_id`.
// Normalize at the service boundary so source-equivalent UI leaves need no testbed props.
function normalizeProduct(product: Product | ProductApiRecord): Product {
  const _id = product._id ?? product.id;
  if (!_id) {
    throw new Error(`Product response is missing an identity: ${product.slug}`);
  }

  return {
    ...product,
    _id,
    images: product.images ?? [],
  };
}

function normalizePaginatedProducts(response: PaginatedProducts): PaginatedProducts {
  return {
    ...response,
    items: (response.items ?? []).map(normalizeProduct),
  };
}

export interface SearchProductsParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  sort?: ProductSort | ProductSortValue | string;
  page?: number;
  pageSize?: number;
  limit?: number;
}

interface FetchProductReviewsParams {
  sort?: ProductReviewSort | ProductReviewSortValue | ReviewSort;
  page?: number;
  pageSize?: number;
}

export async function fetchProducts(params: FetchProductsParams = {}): Promise<PaginatedProducts> {
  const effectivePageSize = params.pageSize ?? params.limit;
  const searchQuery = params.q ?? params.search;

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

  return normalizePaginatedProducts(await apiRequest<PaginatedProducts>('/products', {
    params: {
      ...params,
      ...(searchQuery !== undefined ? { q: searchQuery } : {}),
      ...(effectivePageSize !== undefined ? { pageSize: effectivePageSize } : {}),
    },
    revalidate: 30,
    tags: ['products'],
  }));
}

export async function searchProducts(
  query: string,
  params: SearchProductsParams = {},
): Promise<SearchProductsResponse> {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Search query is required');
  }

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

  const response = await apiRequest<SearchProductsResponse>('/products/search', {
    params: {
      q: query.trim(),
      ...params,
      ...(params.page !== undefined ? { page: params.page } : {}),
      ...(effectivePageSize !== undefined ? { pageSize: effectivePageSize } : {}),
    },
    revalidate: 60,
    tags: ['products', 'search'],
  });

  return {
    ...response,
    items: response.items.map(normalizeProduct),
  };
}

export async function fetchFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const response = await apiRequest<{ items: Product[]; totalItems: number }>('/products/featured', {
    params: { limit },
    revalidate: 60,
    tags: ['products', 'featured'],
  });
  return (response.items ?? []).map(normalizeProduct);
}

export async function fetchProductCategories(): Promise<string[]> {
  return apiRequest<string[]>('/products/categories', {
    revalidate: 300,
    tags: ['categories'],
  });
}

export async function fetchProduct(id: string): Promise<Product> {
  return normalizeProduct(await apiRequest<Product>(`/products/${id}`, {
    revalidate: 60,
    tags: ['products', `product-${id}`],
  }));
}

export async function fetchRelatedProducts(id: string, limit: number = 4): Promise<Product[]> {
  const response = await apiRequest<{ items: Product[]; totalItems: number }>(`/products/${id}/related`, {
    params: { limit },
    revalidate: 120,
    tags: ['products', `product-${id}-related`],
  });
  return (response.items ?? []).map(normalizeProduct);
}

export async function fetchProductReviews(
  id: string,
  params: FetchProductReviewsParams = {},
): Promise<ReviewsResponse> {
  if (params.page !== undefined) {
    validatePageNumber(params.page);
  }
  if (params.pageSize !== undefined) {
    validatePageNumber(params.pageSize);
  }

  return normalizeProductReviewsResponse(
    await apiRequest<ProductReviewsApiResponse>(`/products/${id}/reviews`, {
      params: {
        ...(params.sort ? { sort: params.sort } : {}),
        ...(params.page !== undefined ? { page: params.page } : {}),
        ...(params.pageSize !== undefined ? { pageSize: params.pageSize } : {}),
      },
      revalidate: 60,
      tags: ['reviews', `product-${id}-reviews`],
    }),
  );
}
