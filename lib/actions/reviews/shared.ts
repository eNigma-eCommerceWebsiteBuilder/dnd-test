import { ReviewReportReason } from '@/lib/api';

export enum ReviewFieldKey {
  PRODUCT_ID = 'productId',
  AUTHOR = 'author',
  TITLE = 'title',
  RATING = 'rating',
  TEXT = 'text',
  COMMENT = 'comment',
  ORDER_ID = 'orderId',
  ORDER_NUMBER = 'orderNumber',
  EMAIL = 'email',
  CUSTOMER_EMAIL = 'customerEmail',
  IMAGES = 'images',
}

export function normalizeUploadError(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Failed to upload images';

  if (message.includes('file size')) {
    return 'Image files must be less than 5MB each.';
  }

  if (message.includes('file type')) {
    return 'Only JPEG, PNG, and WebP images are allowed.';
  }

  return message;
}

export function toReviewReportReason(reason: string): ReviewReportReason | undefined {
  return Object.values(ReviewReportReason).find(
    (value) => value === reason,
  ) as ReviewReportReason | undefined;
}
