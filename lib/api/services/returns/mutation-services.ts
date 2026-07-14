import { apiMutate } from '../../core/client';
import type {
  ApiMutateOptions,
  CancelReturnResponse,
  ReturnRequest,
  ReturnRequestData,
} from '../../types';
import { validateObjectId } from '../../utils/validators';
import { validateReturnRequestData } from './shared';

export async function requestReturn(
  orderId: string,
  returnData: ReturnRequestData,
  options: ApiMutateOptions = {},
): Promise<ReturnRequest> {
  validateObjectId(orderId, 'Order ID');
  validateReturnRequestData(returnData);

  return apiMutate<ReturnRequest>(`/returns/orders/${orderId}/return`, {
    method: 'POST',
    body: returnData,
    ...options,
  });
}

export async function cancelReturn(
  returnId: string,
  options: ApiMutateOptions = {},
): Promise<CancelReturnResponse['data']> {
  validateObjectId(returnId, 'Return ID');

  return apiMutate<CancelReturnResponse['data']>(`/returns/${returnId}/cancel`, {
    method: 'POST',
    ...options,
  });
}
