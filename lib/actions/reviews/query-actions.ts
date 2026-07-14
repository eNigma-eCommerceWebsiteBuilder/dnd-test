'use server';

import {
  validateReviewEligibility as apiValidateReviewEligibility,
} from '@/lib/api';
import { createErrorResult, createSuccessResult } from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import type {
  ActionState,
  ReviewEligibilityActionResult,
} from '@/lib/actions/types';
import { buildReviewEligibilityRequest } from './payloads';

export async function validateReviewEligibilityAction(
  prevState: ActionState<ReviewEligibilityActionResult>,
  formData: FormData | {
    orderId?: string;
    productId?: string;
    email?: string;
    customerEmail?: string;
  },
): Promise<ReviewEligibilityActionResult> {
  void prevState;

  const { data, fieldErrors } = buildReviewEligibilityRequest(formData);

  if (!data) {
    return createErrorResult('Order ID, product ID, and email are required.', { fieldErrors });
  }

  try {
    const eligibility = await apiValidateReviewEligibility(
      data,
      await getActionRequestContext(),
    );

    return {
      ...createSuccessResult(eligibility),
      eligible: eligibility.canReview,
    };
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to validate review eligibility.');
  }
}
