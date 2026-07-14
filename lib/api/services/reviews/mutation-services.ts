import { apiMutate, ApiError } from '../../core/client';
import { validateObjectId } from '../../utils/validators';
import type {
  ApiMutateOptions,
  Review,
  ReviewApiRecord,
  ReviewCreateData,
  StandaloneReviewCreateData,
} from '../../types';
import {
  buildStandaloneReviewPayload,
  type UploadedImage,
  sanitizeReviewCreateData,
  validateReviewCreateData,
} from './shared';
import { normalizeReview } from './normalizers';

export async function uploadReviewImages(
  formData: FormData,
  options: ApiMutateOptions = {},
): Promise<UploadedImage[]> {
  return apiMutate<UploadedImage[]>('/reviews/upload-images', {
    ...options,
    method: 'POST',
    body: formData,
    isFormData: true,
  });
}

export async function createReview(
  productId: string,
  data: ReviewCreateData,
  options: ApiMutateOptions = {},
): Promise<Review> {
  validateObjectId(productId, 'Product ID');

  if (!data || typeof data !== 'object') {
    throw new ApiError('Review data is required', 400, 'MISSING_REVIEW_DATA');
  }

  validateReviewCreateData(data);

  return normalizeReview(
    await apiMutate<ReviewApiRecord>(`/products/${productId}/reviews`, {
      ...options,
      method: 'POST',
      body: sanitizeReviewCreateData(data),
    }),
  );
}

export async function createStandaloneReview(
  data: StandaloneReviewCreateData,
  options: ApiMutateOptions = {},
): Promise<Review> {
  if (!data || typeof data !== 'object') {
    throw new ApiError('Review data is required', 400, 'MISSING_DATA');
  }

  return normalizeReview(
    await apiMutate<ReviewApiRecord>('/reviews', {
      ...options,
      method: 'POST',
      body: buildStandaloneReviewPayload(data),
    }),
  );
}

export async function uploadProductReviewImages(
  productId: string,
  formData: FormData,
  options: ApiMutateOptions = {},
): Promise<UploadedImage[]> {
  validateObjectId(productId, 'Product ID');

  return apiMutate<UploadedImage[]>(`/products/${productId}/reviews/upload-images`, {
    ...options,
    method: 'POST',
    body: formData,
    isFormData: true,
  });
}
