import { ApiError } from '../../core/client';
import {
  sanitizeString,
  validateEmail,
  validateObjectId,
  validateRating,
} from '../../utils/validators';
import {
  ReviewSort,
  type ReviewCreateData,
  type ReviewEligibilityRequest,
  type ReviewListParams,
  type ReviewListSort,
  type StandaloneReviewCreateData,
} from '../../types';

export interface UploadedImage {
  id: string;
  src: string;
  alt: string;
  public_id?: string;
}

const REVIEW_SORT_MAP: Record<ReviewListSort, ReviewSort> = {
  [ReviewSort.RECENT]: ReviewSort.RECENT,
  [ReviewSort.RATING_ASC]: ReviewSort.RATING_ASC,
  [ReviewSort.RATING_DESC]: ReviewSort.RATING_DESC,
  newest: ReviewSort.RECENT,
  oldest: ReviewSort.RECENT,
  highest: ReviewSort.RATING_DESC,
  lowest: ReviewSort.RATING_ASC,
  helpful: ReviewSort.RECENT,
};

export function validateReviewCreateData(data: ReviewCreateData): void {
  if (!data.author?.trim()) {
    throw new ApiError('Author name is required', 400, 'MISSING_AUTHOR');
  }

  if (data.rating === undefined || data.rating === null) {
    throw new ApiError('Rating is required', 400, 'MISSING_RATING');
  }
  validateRating(data.rating);

  if (!data.text?.trim()) {
    throw new ApiError('Review text is required', 400, 'MISSING_TEXT');
  }

  if (data.text.length > 5000) {
    throw new ApiError('Review text is too long (max 5000 characters)', 400, 'TEXT_TOO_LONG');
  }

  if (data.customerEmail) {
    validateEmail(data.customerEmail);
  }
}

export function sanitizeReviewCreateData(data: ReviewCreateData): ReviewCreateData {
  return {
    ...data,
    author: sanitizeString(data.author, 100),
    title: data.title ? sanitizeString(data.title, 200) : undefined,
    text: sanitizeString(data.text, 5000),
  };
}

export function validateReviewEligibilityRequest(data: ReviewEligibilityRequest): void {
  validateObjectId(data.orderId, 'Order ID');
  validateObjectId(data.productId, 'Product ID');
  validateEmail(data.email);
}

export function normalizeReviewSort(sort?: ReviewListSort): ReviewSort | undefined {
  if (!sort) {
    return undefined;
  }

  return REVIEW_SORT_MAP[sort];
}

export function getReviewListPageSize(params: ReviewListParams): number | undefined {
  return params.pageSize ?? params.limit;
}

export function validateReviewListParams(params: ReviewListParams): void {
  if (params.productId) {
    validateObjectId(params.productId, 'Product ID');
  }

  if (params.page !== undefined && params.page < 1) {
    throw new ApiError('Page must be 1 or greater', 400, 'INVALID_PAGE');
  }

  const pageSize = getReviewListPageSize(params);
  if (pageSize !== undefined && (pageSize < 1 || pageSize > 100)) {
    throw new ApiError('Page size must be between 1 and 100', 400, 'INVALID_PAGE_SIZE');
  }
}

export function buildStandaloneReviewPayload(
  data: StandaloneReviewCreateData,
): StandaloneReviewCreateData & { text: string } {
  if (!data.productId) {
    throw new ApiError('Product ID is required', 400, 'MISSING_PRODUCT_ID');
  }
  validateObjectId(data.productId, 'Product ID');

  if (data.rating === undefined || data.rating === null) {
    throw new ApiError('Rating is required', 400, 'MISSING_RATING');
  }
  validateRating(data.rating);

  const reviewText = (data.text ?? data.comment ?? '').trim();
  if (!reviewText) {
    throw new ApiError('Review text is required', 400, 'MISSING_TEXT');
  }

  if (reviewText.length > 5000) {
    throw new ApiError('Review text is too long (max 5000 characters)', 400, 'TEXT_TOO_LONG');
  }

  const reviewEmail = data.customerEmail ?? data.email;
  if (reviewEmail) {
    validateEmail(reviewEmail);
  }

  if (data.orderId) {
    validateObjectId(data.orderId, 'Order ID');
  }

  return {
    productId: data.productId,
    rating: data.rating,
    title: data.title ? sanitizeString(data.title, 200) : undefined,
    text: sanitizeString(reviewText, 5000),
    ...(data.orderNumber ? { orderNumber: data.orderNumber.trim() } : {}),
    ...(data.orderId ? { orderId: data.orderId } : {}),
    ...(reviewEmail ? { customerEmail: reviewEmail.trim().toLowerCase() } : {}),
  };
}
