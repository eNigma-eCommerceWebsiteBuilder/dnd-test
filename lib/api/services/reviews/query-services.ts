import { apiMutate, apiRequest } from '../../core/client';
import type {
  ApiMutateOptions,
  ApiRequestOptions,
  PaginatedReviewsResponse,
  Review,
  ReviewApiRecord,
  ReviewEligibility,
  ReviewEligibilityRequest,
  ReviewListParams,
  StandaloneReviewsApiResponse,
} from '../../types';
import {
  getReviewListPageSize,
  normalizeReviewSort,
  validateReviewListParams,
} from './shared';
import {
  normalizeReview,
  normalizeStandaloneReviewsResponse,
} from './normalizers';

export async function fetchReview(
  id: string,
  options: ApiRequestOptions = {},
): Promise<Review> {
  return normalizeReview(
    await apiRequest<ReviewApiRecord>(`/reviews/${id}`, {
      ...options,
      revalidate: 120,
      tags: ['reviews', `review-${id}`],
    }),
  );
}

export async function validateReviewEligibility(
  data: ReviewEligibilityRequest,
  options: ApiMutateOptions = {},
): Promise<ReviewEligibility> {
  return apiMutate<ReviewEligibility>('/orders/validate-review', {
    ...options,
    method: 'POST',
    body: data,
  });
}

export async function listReviews(
  params: ReviewListParams = {},
  options: ApiRequestOptions = {},
): Promise<PaginatedReviewsResponse> {
  validateReviewListParams(params);

  const pageSize = getReviewListPageSize(params);
  const sort = normalizeReviewSort(params.sort);

  return normalizeStandaloneReviewsResponse(
    await apiRequest<StandaloneReviewsApiResponse>('/reviews', {
      params: {
        ...(params.productId ? { productId: params.productId } : {}),
        ...(params.page !== undefined ? { page: params.page } : {}),
        ...(pageSize !== undefined ? { pageSize } : {}),
        ...(sort ? { sort } : {}),
      },
      ...options,
      revalidate: 120,
      tags: ['reviews'],
    }),
  );
}
