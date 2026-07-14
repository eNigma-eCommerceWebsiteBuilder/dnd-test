'use server';

import { ACTION_CACHE_TAGS, reviewCacheTag, revalidateActionTags } from '@/lib/actions/internal/cache';
import { createErrorResult, createSuccessResult, toFieldErrors } from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import {
  createReview as apiCreateReview,
  createStandaloneReview as apiCreateStandaloneReview,
  uploadProductReviewImages as apiUploadProductReviewImages,
  uploadReviewImages as apiUploadReviewImages,
  type Review,
} from '@/lib/api';
import type {
  ActionState,
  ReviewActionResult,
  UploadedImagesResult,
} from '@/lib/actions/types';
import { hasApiValidationErrors } from '@/lib/actions/types';
import {
  buildCreateReviewPayload,
  buildStandaloneReviewRequest,
} from './payloads';
import { normalizeUploadError } from './shared';

function getReviewSuccessMessage(review: Review): string {
  return review.isVerifiedPurchase
    ? 'Thank you! Your verified review has been submitted.'
    : 'Thank you! Your review has been submitted.';
}

function revalidateReviewTags(productId: string): void {
  revalidateActionTags([reviewCacheTag(productId), ACTION_CACHE_TAGS.reviews]);
}

export async function uploadReviewImagesAction(formData: FormData): Promise<UploadedImagesResult> {
  try {
    const images = await apiUploadReviewImages(formData, await getActionRequestContext());

    return {
      ...createSuccessResult(images, { message: 'Images uploaded successfully.' }),
      images,
    };
  } catch (error: unknown) {
    return createErrorResult(normalizeUploadError(error));
  }
}

export async function createReviewAction(
  prevState: ActionState<ReviewActionResult>,
  formData: FormData | {
    productId?: string;
    author?: string;
    title?: string;
    rating?: string | number;
    text?: string;
    orderNumber?: string;
    customerEmail?: string;
    images?: string | Array<{ id: string; src: string; alt?: string }>;
  },
): Promise<ReviewActionResult> {
  void prevState;

  const { productId, data, fieldErrors, parseError } = buildCreateReviewPayload(formData);

  if (!data || !productId) {
    return createErrorResult(parseError ?? 'Please fill in all required fields.', { fieldErrors });
  }

  try {
    const review = await apiCreateReview(productId, data, await getActionRequestContext());
    revalidateReviewTags(productId);

    return {
      ...createSuccessResult(review, { message: getReviewSuccessMessage(review) }),
      review,
    };
  } catch (error: unknown) {
    if (hasApiValidationErrors(error) && error.validationErrors.length > 0) {
      return createErrorResult('Please correct the errors below.', {
        fieldErrors: toFieldErrors(error.validationErrors),
      });
    }

    return createErrorResult(
      error instanceof Error ? error.message : 'Failed to submit review. Please try again.',
    );
  }
}

export async function createStandaloneReviewAction(
  prevState: ActionState<ReviewActionResult>,
  formData: FormData | {
    productId?: string;
    rating?: string | number;
    title?: string;
    text?: string;
    comment?: string;
    orderId?: string;
    orderNumber?: string;
    email?: string;
    customerEmail?: string;
  },
): Promise<ReviewActionResult> {
  void prevState;

  const { data, fieldErrors } = buildStandaloneReviewRequest(formData);

  if (!data) {
    return createErrorResult('Please fill in all required fields.', { fieldErrors });
  }

  try {
    const review = await apiCreateStandaloneReview(data, await getActionRequestContext());
    revalidateReviewTags(data.productId);

    return {
      ...createSuccessResult(review, { message: 'Thank you! Your review has been submitted.' }),
      review,
    };
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to submit review.');
  }
}

export async function uploadProductReviewImagesAction(
  productId: string,
  formData: FormData,
): Promise<UploadedImagesResult> {
  if (!productId.trim()) {
    return createErrorResult('Product ID is required.');
  }

  try {
    const images = await apiUploadProductReviewImages(
      productId,
      formData,
      await getActionRequestContext(),
    );

    return {
      ...createSuccessResult(images, { message: 'Images uploaded successfully.' }),
      images,
    };
  } catch (error: unknown) {
    return createErrorResult(normalizeUploadError(error));
  }
}
