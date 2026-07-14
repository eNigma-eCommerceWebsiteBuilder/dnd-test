'use server';

import {
  cancelReturn as apiCancelReturn,
  requestReturn as apiRequestReturn,
} from '@/lib/api';
import type { ReturnRequestData } from '@/lib/api';
import type {
  ActionState,
  FormDataOrObject,
  ReturnActionResult,
} from '@/lib/actions/types';
import {
  ACTION_CACHE_TAGS,
  orderCacheTag,
  returnCacheTag,
  revalidateActionTags,
} from '@/lib/actions/internal/cache';
import { createErrorResult } from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import {
  ReturnFieldKey,
  getFormString,
  parseReturnRequestPayload,
} from './shared';

export async function requestReturnAction(
  prevState: ActionState<ReturnActionResult>,
  formData: FormDataOrObject<{ orderId?: string; returnData?: string | ReturnRequestData }>,
): Promise<ReturnActionResult> {
  void prevState;

  const payload = parseReturnRequestPayload(formData);
  if (payload.parseError) {
    return createErrorResult(payload.parseError);
  }
  if (!payload.orderId || !payload.returnData || payload.fieldErrors) {
    return createErrorResult('Please correct the highlighted return details.', {
      fieldErrors: payload.fieldErrors,
    });
  }

  try {
    const response = await apiRequestReturn(
      payload.orderId,
      payload.returnData,
      await getActionRequestContext(),
    );

    revalidateActionTags([
      ACTION_CACHE_TAGS.returns,
      ACTION_CACHE_TAGS.orders,
      orderCacheTag(payload.orderId),
      returnCacheTag(response._id),
    ]);

    return {
      success: true,
      data: response,
      return: response,
      refundAmount: response.calculations?.totalRefundAmount,
      message: 'Return request submitted successfully.',
    };
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to submit return request.');
  }
}

export async function cancelReturnAction(
  prevState: ActionState<ReturnActionResult>,
  formData: FormDataOrObject<{ returnId?: string }>,
): Promise<ReturnActionResult> {
  void prevState;

  const returnId = getFormString(formData, ReturnFieldKey.RETURN_ID);
  if (!returnId) {
    return createErrorResult('Return ID is required.');
  }

  try {
    const cancelledReturn = await apiCancelReturn(
      returnId,
      await getActionRequestContext(),
    );

    revalidateActionTags([
      ACTION_CACHE_TAGS.returns,
      returnCacheTag(returnId),
    ]);

    return {
      success: true,
      data: undefined,
      message:
        cancelledReturn.status === 'cancelled'
          ? 'Return request cancelled successfully.'
          : 'Return updated successfully.',
    };
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to cancel return.');
  }
}
