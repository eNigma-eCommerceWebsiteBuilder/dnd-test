'use server';

import type {
  ActionState,
  FormDataOrObject,
  ReturnActionResult,
} from '@/lib/actions/types';
import { requestExchangeAction as requestOrderExchangeAction } from '@/lib/actions/order-actions';

export async function requestExchangeAction(
  prevState: ActionState<ReturnActionResult>,
  formData: FormDataOrObject<{
    orderId?: string;
    exchangeData?: {
      itemsReturned: Array<{ productId: string; variantId?: string; quantity: number; reason: string }>;
      itemsRequested: Array<{ productId: string; variantId?: string; quantity: number }>;
      email?: string;
      reason?: string;
    } | string;
  }>,
): Promise<ReturnActionResult> {
  void prevState;

  const exchangeData =
    formData instanceof FormData
      ? formData.get('exchangeData')
      : formData.exchangeData;

  let parsedData:
    | {
        itemsReturned: Array<{ productId: string; variantId?: string; quantity: number; reason: string }>;
        itemsRequested: Array<{ productId: string; variantId?: string; quantity: number }>;
        email?: string;
        reason?: string;
      }
    | undefined;

  if (typeof exchangeData === 'string') {
    try {
      parsedData = JSON.parse(exchangeData) as typeof parsedData;
    } catch {
      return { success: false, error: 'Exchange request details are not valid JSON.' };
    }
  } else if (
    exchangeData &&
    typeof exchangeData === 'object' &&
    'itemsReturned' in exchangeData &&
    'itemsRequested' in exchangeData
  ) {
    parsedData = exchangeData;
  }

  const response = await requestOrderExchangeAction(null, {
    orderId:
      formData instanceof FormData
        ? (typeof formData.get('orderId') === 'string' ? formData.get('orderId') as string : undefined)
        : formData.orderId,
    itemsReturned: parsedData?.itemsReturned,
    itemsRequested: parsedData?.itemsRequested,
    email: parsedData?.email,
    reason: parsedData?.reason,
  });

  if (!response.success) {
    return {
      success: false,
      error: response.error,
      fieldErrors: response.fieldErrors,
    };
  }

  const exchangeRequest = response.data?.data.exchangeRequest;

  return {
    success: true,
    data: exchangeRequest,
    return: exchangeRequest,
    message: response.message ?? 'Exchange request submitted successfully.',
  };
}
