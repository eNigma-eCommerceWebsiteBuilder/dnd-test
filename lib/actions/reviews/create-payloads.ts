import {
  ApiError,
  type ReviewCreateData,
  type StandaloneReviewCreateData,
} from '@/lib/api';
import {
  getIntegerField,
  getTrimmedStringField,
  normalizeEmail,
  parseJsonField,
} from '@/lib/actions/internal/forms';
import type { FieldErrors, FormDataOrObject } from '@/lib/actions/types';
import { ReviewFieldKey } from './shared';

interface CreateReviewInput {
  productId?: string;
  author?: string;
  title?: string;
  rating?: string | number;
  text?: string;
  orderNumber?: string;
  customerEmail?: string;
  images?: string | Array<{ id: string; src: string; alt?: string }>;
}

interface StandaloneReviewInput {
  productId?: string;
  rating?: string | number;
  title?: string;
  text?: string;
  comment?: string;
  orderId?: string;
  orderNumber?: string;
  email?: string;
  customerEmail?: string;
}

type ReviewImageInput = { id: string; src: string; alt?: string };

function isReviewImage(value: unknown): value is ReviewImageInput {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ReviewImageInput>;
  return typeof candidate.id === 'string' && typeof candidate.src === 'string';
}

function isReviewImageArray(value: unknown): value is ReviewImageInput[] {
  return Array.isArray(value) && value.every(isReviewImage);
}

export function buildCreateReviewPayload(
  formData: FormDataOrObject<CreateReviewInput>,
): {
  productId?: string;
  data?: ReviewCreateData;
  fieldErrors?: FieldErrors;
  parseError?: string;
} {
  const productId = getTrimmedStringField(formData, ReviewFieldKey.PRODUCT_ID);
  const author = getTrimmedStringField(formData, ReviewFieldKey.AUTHOR);
  const title = getTrimmedStringField(formData, ReviewFieldKey.TITLE);
  const rating = getIntegerField(formData, ReviewFieldKey.RATING);
  const text = getTrimmedStringField(formData, ReviewFieldKey.TEXT);
  const orderNumber = getTrimmedStringField(formData, ReviewFieldKey.ORDER_NUMBER);
  const customerEmailValue = getTrimmedStringField(formData, ReviewFieldKey.CUSTOMER_EMAIL);
  const fieldErrors: FieldErrors = {};

  if (!productId) {
    fieldErrors[ReviewFieldKey.PRODUCT_ID] = 'Product ID is required.';
  }
  if (!author) {
    fieldErrors[ReviewFieldKey.AUTHOR] = 'Your name is required.';
  }
  if (!rating || rating < 1 || rating > 5) {
    fieldErrors[ReviewFieldKey.RATING] = 'Please select a rating between 1 and 5.';
  }
  if (!text) {
    fieldErrors[ReviewFieldKey.TEXT] = 'Review text is required.';
  } else if (text.length < 10) {
    fieldErrors[ReviewFieldKey.TEXT] = 'Review must be at least 10 characters.';
  }

  let images: ReviewImageInput[] | undefined;

  try {
    images = parseJsonField(
      formData,
      ReviewFieldKey.IMAGES,
      isReviewImageArray,
      'Review images payload is invalid.',
    );
  } catch (error: unknown) {
    return {
      productId,
      fieldErrors,
      parseError:
        error instanceof ApiError ? error.message : 'Review images payload is invalid.',
    };
  }

  if (Object.keys(fieldErrors).length > 0 || !productId || !author || !rating || !text) {
    return { productId, fieldErrors };
  }

  return {
    productId,
    data: {
      author,
      rating,
      text,
      ...(title ? { title } : {}),
      ...(images
        ? {
            images: images.map((image) => ({
              id: image.id,
              src: image.src,
              alt: image.alt ?? '',
            })),
          }
        : {}),
      ...(orderNumber ? { orderNumber } : {}),
      ...(customerEmailValue
        ? { customerEmail: normalizeEmail(customerEmailValue) }
        : {}),
    },
  };
}

export function buildStandaloneReviewRequest(
  formData: FormDataOrObject<StandaloneReviewInput>,
): { data?: StandaloneReviewCreateData; fieldErrors?: FieldErrors } {
  const productId = getTrimmedStringField(formData, ReviewFieldKey.PRODUCT_ID);
  const rating = getIntegerField(formData, ReviewFieldKey.RATING);
  const title = getTrimmedStringField(formData, ReviewFieldKey.TITLE);
  const text = getTrimmedStringField(formData, ReviewFieldKey.TEXT);
  const comment = getTrimmedStringField(formData, ReviewFieldKey.COMMENT);
  const orderId = getTrimmedStringField(formData, ReviewFieldKey.ORDER_ID);
  const orderNumber = getTrimmedStringField(formData, ReviewFieldKey.ORDER_NUMBER);
  const customerEmailValue = getTrimmedStringField(formData, ReviewFieldKey.CUSTOMER_EMAIL);
  const email = getTrimmedStringField(formData, ReviewFieldKey.EMAIL);
  const reviewText = text ?? comment;
  const fieldErrors: FieldErrors = {};

  if (!productId) {
    fieldErrors[ReviewFieldKey.PRODUCT_ID] = 'Product ID is required.';
  }
  if (!rating || rating < 1 || rating > 5) {
    fieldErrors[ReviewFieldKey.RATING] = 'Please select a rating between 1 and 5.';
  }
  if (!reviewText) {
    fieldErrors[ReviewFieldKey.COMMENT] = 'Review text is required.';
  } else if (reviewText.length < 10) {
    fieldErrors[ReviewFieldKey.COMMENT] = 'Review must be at least 10 characters.';
  }

  if (Object.keys(fieldErrors).length > 0 || !productId || !rating || !reviewText) {
    return { fieldErrors };
  }

  return {
    data: {
      productId,
      rating,
      ...(title ? { title } : {}),
      text: reviewText,
      ...(orderId ? { orderId } : {}),
      ...(orderNumber ? { orderNumber } : {}),
      ...(customerEmailValue
        ? { customerEmail: normalizeEmail(customerEmailValue) }
        : {}),
      ...(email && !customerEmailValue ? { email: normalizeEmail(email) } : {}),
    },
  };
}
