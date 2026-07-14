import { apiRequest } from '../../core/client';
import type {
  ApiRequestOptions,
  ReturnRequest,
  ReturnStatus,
  ReturnsListResponse,
} from '../../types';
import { validateObjectId } from '../../utils/validators';
import { validateReturnPagination, validateReturnStatus } from './shared';

export async function getMyReturns(
  status?: ReturnStatus,
  page: number = 1,
  limit: number = 10,
  options: ApiRequestOptions = {},
): Promise<ReturnsListResponse['data']> {
  validateReturnPagination(page, limit);
  validateReturnStatus(status);

  return apiRequest<ReturnsListResponse['data']>('/returns', {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
    },
    cache: 'no-store',
    ...options,
  });
}

export async function getReturnDetails(
  returnId: string,
  options: ApiRequestOptions = {},
): Promise<ReturnRequest> {
  validateObjectId(returnId, 'Return ID');

  return apiRequest<ReturnRequest>(`/returns/${returnId}`, {
    cache: 'no-store',
    ...options,
  });
}
