import type {
  CancelSubscriptionRequest,
  DraftUpdateRequest,
  SubscriptionStatus,
} from '../../types';
import { ApiError } from '../../core/errors';
import { validateObjectId, validatePageNumber } from '../../utils/validators';

const SUBSCRIPTION_STATUS_VALUES: SubscriptionStatus[] = ['active', 'paused', 'cancelled', 'expired'];
const DRAFT_ACTION_VALUES: Array<NonNullable<DraftUpdateRequest['action']>> = ['add', 'update', 'remove'];

export function validateSubscriptionId(id: string, fieldName: string = 'Subscription ID'): void {
  validateObjectId(id, fieldName);
}

export function validateSubscriptionPagination(page: number, limit: number): void {
  validatePageNumber(page);

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new ApiError('Limit must be between 1 and 100', 400, 'INVALID_LIMIT');
  }
}

export function validateSubscriptionStatus(status?: SubscriptionStatus): void {
  if (status && !SUBSCRIPTION_STATUS_VALUES.includes(status)) {
    throw new ApiError(
      `Invalid status. Must be one of: ${SUBSCRIPTION_STATUS_VALUES.join(', ')}`,
      400,
      'INVALID_STATUS',
    );
  }
}

export function createCancelSubscriptionPayload(
  immediate: boolean,
  reason?: string,
  note?: string,
): CancelSubscriptionRequest {
  return {
    immediate,
    ...(reason ? { reason } : {}),
    ...(note ? { note } : {}),
  };
}

export function validateStripePaymentMethodId(paymentMethodId: string): string {
  if (!paymentMethodId || typeof paymentMethodId !== 'string' || paymentMethodId.trim().length === 0) {
    throw new ApiError('Payment method ID is required', 400, 'MISSING_PAYMENT_METHOD_ID');
  }

  return paymentMethodId.trim();
}

export function validateDraftId(draftId: string): void {
  validateObjectId(draftId, 'Draft ID');
}

export function validateDraftUpdateRequest(changes: DraftUpdateRequest): void {
  if (!changes || typeof changes !== 'object') {
    throw new ApiError('Changes object is required', 400, 'MISSING_CHANGES');
  }

  if (!changes.action) {
    return;
  }

  if (!DRAFT_ACTION_VALUES.includes(changes.action)) {
    throw new ApiError('Invalid action. Must be add, update, or remove', 400, 'INVALID_ACTION');
  }

  if (changes.action === 'add') {
    if (!changes.productId) {
      throw new ApiError('Product ID required for add action', 400, 'MISSING_PRODUCT_ID');
    }

    validateObjectId(changes.productId, 'Product ID');

    if (!changes.quantity || changes.quantity < 1) {
      throw new ApiError('Quantity must be at least 1', 400, 'INVALID_QUANTITY');
    }
  }

  if (changes.action === 'update' || changes.action === 'remove') {
    if (!changes.lineId) {
      throw new ApiError(
        `Line ID required for ${changes.action} action`,
        400,
        'MISSING_LINE_ID',
      );
    }
  }

  if (changes.action === 'update' && (!changes.quantity || changes.quantity < 1)) {
    throw new ApiError('Quantity must be at least 1', 400, 'INVALID_QUANTITY');
  }
}
