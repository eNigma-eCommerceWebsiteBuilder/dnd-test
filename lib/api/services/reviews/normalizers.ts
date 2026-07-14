import {
  ReviewStatus,
  type PaginatedReviewsResponse,
  type ProductReviewsApiResponse,
  type Review,
  type ReviewApiRecord,
  type ReviewImage,
  type ReviewsResponse,
  type StandaloneReviewsApiResponse,
} from '../../types';

function normalizeReviewImages(images?: ReviewImage[]): ReviewImage[] | undefined {
  if (!Array.isArray(images) || images.length === 0) {
    return undefined;
  }

  return images.map((image) => ({
    id: image.id,
    src: image.src,
    alt: image.alt ?? '',
    ...(image.public_id ? { public_id: image.public_id } : {}),
  }));
}

function normalizeReviewStatus(isApproved?: boolean | null): ReviewStatus {
  if (isApproved === true) {
    return ReviewStatus.APPROVED;
  }

  if (isApproved === false) {
    return ReviewStatus.REJECTED;
  }

  return ReviewStatus.PENDING;
}

export function normalizeReview(review: Review | ReviewApiRecord): Review {
  if ('status' in review && 'helpful' in review && 'notHelpful' in review) {
    return review;
  }

  const createdAt = review.createdAt ?? review.date ?? '';
  const images = normalizeReviewImages(review.images);

  return {
    _id: review._id,
    productId: review.productId,
    ...(review.product ? { product: review.product } : {}),
    author: review.author,
    rating: review.rating,
    ...(review.title ? { title: review.title } : {}),
    text: review.text,
    ...(images ? { images } : {}),
    isVerifiedPurchase: Boolean(review.isVerifiedPurchase ?? review.isVerified),
    ...(review.orderNumber ? { orderNumber: review.orderNumber } : {}),
    ...(review.customerEmail ? { customerEmail: review.customerEmail } : {}),
    helpful: review.helpfulCount ?? 0,
    notHelpful: review.unhelpfulCount ?? 0,
    status: normalizeReviewStatus(review.isApproved),
    createdAt,
    updatedAt: review.updatedAt ?? createdAt,
  };
}

function normalizeRatingDistribution(
  distribution: ProductReviewsApiResponse['ratingDistribution'],
): Record<string, number> {
  if (!Array.isArray(distribution)) {
    return distribution;
  }

  return distribution.reduce<Record<string, number>>((result, item) => {
    result[String(item.rating)] = item.percentage;
    return result;
  }, {});
}

export function normalizeProductReviewsResponse(response: ProductReviewsApiResponse): ReviewsResponse {
  return {
    ...response,
    items: response.items.map(normalizeReview),
    ratingDistribution: normalizeRatingDistribution(response.ratingDistribution),
  };
}

export function normalizeStandaloneReviewsResponse(
  response: StandaloneReviewsApiResponse,
): PaginatedReviewsResponse {
  return {
    ...response,
    items: response.items.map(normalizeReview),
  };
}
