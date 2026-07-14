import type {
  ReturnReason,
  ReturnRequestData,
  ReturnStatus,
} from '../../types';
import { ApiError } from '../../core/errors';
import { validateObjectId, validatePageNumber } from '../../utils/validators';

const RETURN_TYPE_VALUES: ReturnRequestData['type'][] = ['refund', 'exchange'];
const RETURN_REASON_VALUES: ReturnReason[] = [
  'wrong_size',
  'damaged',
  'defective',
  'not_as_described',
  'changed_mind',
  'received_wrong_item',
  'better_price_found',
  'quality_not_satisfactory',
  'other',
];
const RETURN_STATUS_VALUES: ReturnStatus[] = [
  'pending',
  'approved',
  'rejected',
  'processing',
  'completed',
  'cancelled',
];

export function validateReturnPagination(page: number, limit: number): void {
  validatePageNumber(page);

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new ApiError('Limit must be between 1 and 100', 400, 'INVALID_LIMIT');
  }
}

export function validateReturnRequestData(returnData: ReturnRequestData): void {
  if (!returnData || typeof returnData !== 'object') {
    throw new ApiError('Return data is required', 400, 'MISSING_RETURN_DATA');
  }

  if (!returnData.type || !RETURN_TYPE_VALUES.includes(returnData.type)) {
    throw new ApiError('Invalid return type. Must be "refund" or "exchange"', 400, 'INVALID_RETURN_TYPE');
  }

  if (!Array.isArray(returnData.returnItems) || returnData.returnItems.length === 0) {
    throw new ApiError('At least one item must be selected for return', 400, 'MISSING_RETURN_ITEMS');
  }

  returnData.returnItems.forEach((item, index) => {
    if (!item.orderItemId) {
      throw new ApiError(`Order item ID is required for item at index ${index}`, 400, 'MISSING_ORDER_ITEM_ID');
    }

    if (!item.productId) {
      throw new ApiError(`Product ID is required for item at index ${index}`, 400, 'MISSING_PRODUCT_ID');
    }

    validateObjectId(item.productId, `Product ID at index ${index}`);

    if (item.variantId) {
      validateObjectId(item.variantId, `Variant ID at index ${index}`);
    }

    if (!item.quantity || item.quantity < 1) {
      throw new ApiError(`Valid quantity is required for item at index ${index}`, 400, 'INVALID_QUANTITY');
    }

    if (!item.reason) {
      throw new ApiError(`Return reason is required for item at index ${index}`, 400, 'MISSING_REASON');
    }
  });

  if (!returnData.reason || !RETURN_REASON_VALUES.includes(returnData.reason)) {
    throw new ApiError(
      `Invalid return reason. Must be one of: ${RETURN_REASON_VALUES.join(', ')}`,
      400,
      'INVALID_REASON',
    );
  }

  if (returnData.type !== 'exchange') {
    return;
  }

  if (!Array.isArray(returnData.exchangeItems) || returnData.exchangeItems.length === 0) {
    throw new ApiError('Exchange items are required when type is "exchange"', 400, 'MISSING_EXCHANGE_ITEMS');
  }

  returnData.exchangeItems.forEach((item, index) => {
    if (!item.productId) {
      throw new ApiError(
        `Product ID is required for exchange item at index ${index}`,
        400,
        'MISSING_EXCHANGE_PRODUCT_ID',
      );
    }

    validateObjectId(item.productId, `Exchange product ID at index ${index}`);

    if (item.variantId) {
      validateObjectId(item.variantId, `Exchange variant ID at index ${index}`);
    }

    if (!item.quantity || item.quantity < 1) {
      throw new ApiError(
        `Valid quantity is required for exchange item at index ${index}`,
        400,
        'INVALID_EXCHANGE_QUANTITY',
      );
    }
  });
}

export function validateReturnStatus(status?: ReturnStatus): void {
  if (status && !RETURN_STATUS_VALUES.includes(status)) {
    throw new ApiError(
      `Invalid status. Must be one of: ${RETURN_STATUS_VALUES.join(', ')}`,
      400,
      'INVALID_STATUS',
    );
  }
}
