import type {
  ReturnRequestData,
  ReturnItem,
} from '@/lib/api/types';
import type { FieldErrors, FormDataOrObject } from '@/lib/actions/types';
import { createErrorResult } from '@/lib/actions/internal/errors';
import { getTrimmedStringField } from '@/lib/actions/internal/forms';
import { validateReturnReason } from '@/lib/utils/returns';

export enum ReturnFieldKey {
  ORDER_ID = 'orderId',
  RETURN_ID = 'returnId',
  RETURN_DATA = 'returnData',
  EXCHANGE_DATA = 'exchangeData',
  TYPE = 'type',
  REASON = 'reason',
  REASON_DETAILS = 'reasonDetails',
  CUSTOMER_NOTE = 'customerNote',
  RETURN_ITEMS = 'returnItems',
  EXCHANGE_ITEMS = 'exchangeItems',
  MESSAGE = 'message',
}

export interface ReturnLabelActionData {
  labelUrl: string;
}

export interface ReturnTrackingActionData {
  trackingNumber: string | null;
  carrier: string | null;
  status: string;
}

export function getFormString<T extends object>(
  input: FormDataOrObject<T>,
  key: string,
): string | undefined {
  if (input instanceof FormData) {
    return getTrimmedStringField(input, key);
  }

  const value = input[key as keyof T];
  return typeof value === 'string' ? value.trim() || undefined : undefined;
}

export function getFormValue<T extends object, TValue>(
  input: FormDataOrObject<T>,
  key: string,
): TValue | undefined {
  if (input instanceof FormData) {
    const value = input.get(key);

    if (typeof value !== 'string' || !value.trim()) {
      return undefined;
    }

    return JSON.parse(value) as TValue;
  }

  const value = input[key as keyof T];
  if (typeof value === 'string') {
    return value.trim() ? (JSON.parse(value) as TValue) : undefined;
  }

  return value as TValue | undefined;
}

function hasValidReturnItems(returnItems: ReturnItem[]): boolean {
  return returnItems.every(
    (item) =>
      Boolean(item.orderItemId?.trim()) &&
      Boolean(item.productId?.trim()) &&
      item.quantity > 0 &&
      validateReturnReason(item.reason),
  );
}

export function parseReturnRequestPayload(
  formData: FormDataOrObject<{
    orderId?: string;
    returnData?: ReturnRequestData | string;
  }>,
): {
  orderId?: string;
  returnData?: ReturnRequestData;
  fieldErrors?: FieldErrors;
  parseError?: string;
} {
  const orderId = getFormString(formData, ReturnFieldKey.ORDER_ID);

  try {
    const returnData = getFormValue<
      { orderId?: string; returnData?: ReturnRequestData | string },
      ReturnRequestData
    >(formData, ReturnFieldKey.RETURN_DATA);
    const fieldErrors: FieldErrors = {};

    if (!orderId) {
      fieldErrors[ReturnFieldKey.ORDER_ID] = 'Order ID is required.';
    }

    if (!returnData) {
      fieldErrors[ReturnFieldKey.RETURN_DATA] = 'Return request details are required.';
      return { orderId, fieldErrors };
    }

    if (!returnData.type) {
      fieldErrors[ReturnFieldKey.TYPE] = 'Return type is required.';
    }

    if (!validateReturnReason(returnData.reason)) {
      fieldErrors[ReturnFieldKey.REASON] = 'A valid return reason is required.';
    }

    if (!Array.isArray(returnData.returnItems) || returnData.returnItems.length === 0) {
      fieldErrors[ReturnFieldKey.RETURN_ITEMS] = 'At least one item must be selected for return.';
    } else if (!hasValidReturnItems(returnData.returnItems)) {
      fieldErrors[ReturnFieldKey.RETURN_ITEMS] =
        'Each return item must include a valid order item, product, quantity, and reason.';
    }

    if (returnData.type === 'exchange') {
      if (!Array.isArray(returnData.exchangeItems) || returnData.exchangeItems.length === 0) {
        fieldErrors[ReturnFieldKey.EXCHANGE_ITEMS] =
          'Exchange items are required when requesting an exchange.';
      }
    }

    return {
      orderId,
      returnData,
      ...(Object.keys(fieldErrors).length > 0 ? { fieldErrors } : {}),
    };
  } catch {
    return {
      orderId,
      parseError: 'Return request details are not valid JSON.',
    };
  }
}

export function createUnsupportedReturnCapabilityResult(message: string) {
  return createErrorResult(message);
}
