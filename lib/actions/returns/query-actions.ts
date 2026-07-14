'use server';

import {
  getMyReturns as apiGetMyReturns,
  getReturnDetails as apiGetReturnDetails,
  type ReturnRequest,
  type ReturnStatus,
  type ReturnsListResponse,
} from '@/lib/api';
import type { ActionResult } from '@/lib/actions/types';
import {
  createErrorResult,
  createSuccessResult,
} from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';

export async function getMyReturnsAction(
  status?: ReturnStatus,
  page: number = 1,
  limit: number = 10,
): Promise<ActionResult<ReturnsListResponse['data']>> {
  try {
    const returns = await apiGetMyReturns(status, page, limit, await getActionRequestContext());
    return createSuccessResult(returns);
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to load returns.');
  }
}

export async function getReturnDetailsAction(
  returnId: string,
): Promise<ActionResult<ReturnRequest>> {
  try {
    const returnDetails = await apiGetReturnDetails(
      returnId,
      await getActionRequestContext(),
    );

    return createSuccessResult(returnDetails);
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to load return details.');
  }
}
