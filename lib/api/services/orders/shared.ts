import type {
  ExchangePaymentIntentRequest,
  ExchangeRequestData,
  OrderStatusValue,
  OrderUpdateData,
} from '../../types';
import { ApiError } from '../../core/errors';
import { validateEmail, validateObjectId, validatePageNumber } from '../../utils/validators';

export interface GetMyOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatusValue;
}

export function validateOrderPagination(params: GetMyOrdersParams): void {
  if (params.page !== undefined) {
    validatePageNumber(params.page);
  }

  if (params.limit !== undefined) {
    validatePageNumber(params.limit);
  }
}

export function validateGuestEmail(email: string | null): void {
  if (email) {
    validateEmail(email);
  }
}

export function validateExchangeRequestData(exchangeData: ExchangeRequestData): void {
  if (!exchangeData || typeof exchangeData !== 'object') {
    throw new ApiError('Exchange data is required', 400, 'MISSING_EXCHANGE_DATA');
  }

  if (!Array.isArray(exchangeData.itemsReturned) || exchangeData.itemsReturned.length === 0) {
    throw new ApiError('Items to return are required', 400, 'MISSING_ITEMS_RETURNED');
  }

  if (!Array.isArray(exchangeData.itemsRequested) || exchangeData.itemsRequested.length === 0) {
    throw new ApiError('Items requested are required', 400, 'MISSING_ITEMS_REQUESTED');
  }

  exchangeData.itemsReturned.forEach((item, index) => {
    validateObjectId(item.productId, `Returned item ${index + 1} product ID`);
  });

  exchangeData.itemsRequested.forEach((item, index) => {
    validateObjectId(item.productId, `Requested item ${index + 1} product ID`);
  });

  validateGuestEmail(exchangeData.email ?? null);
}

export function validateExchangePaymentIntentData(data: ExchangePaymentIntentRequest): void {
  if (!data || typeof data !== 'object') {
    throw new ApiError('Payment data is required', 400, 'MISSING_PAYMENT_DATA');
  }

  if (!data.paymentMethod) {
    throw new ApiError('Payment method is required', 400, 'MISSING_PAYMENT_METHOD');
  }

  if (!data.email) {
    throw new ApiError('Email is required', 400, 'MISSING_EMAIL');
  }

  validateEmail(data.email);

  if (!data.billingAddress || typeof data.billingAddress !== 'object') {
    throw new ApiError('Billing address is required', 400, 'MISSING_BILLING_ADDRESS');
  }

  const requiredFields: Array<keyof ExchangePaymentIntentRequest['billingAddress']> = [
    'street',
    'city',
    'zipCode',
    'country',
  ];

  for (const field of requiredFields) {
    if (!data.billingAddress[field]) {
      throw new ApiError(
        `Billing address ${field} is required`,
        400,
        'MISSING_BILLING_ADDRESS_FIELD',
      );
    }
  }
}

export function validateOrderUpdateData(updateData: OrderUpdateData): void {
  if (!updateData || typeof updateData !== 'object') {
    throw new ApiError('Update data is required', 400, 'MISSING_UPDATE_DATA');
  }

  const hasShippingAddress = Boolean(
    updateData.shippingAddress &&
    typeof updateData.shippingAddress === 'object' &&
    Object.keys(updateData.shippingAddress).length > 0,
  );
  const hasPhone = typeof updateData.phone === 'string' && updateData.phone.trim().length > 0;

  if (!hasShippingAddress && !hasPhone) {
    throw new ApiError('At least one field must be provided for update', 400, 'EMPTY_UPDATE');
  }

  if (hasPhone) {
    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    if (!phonePattern.test(updateData.phone!.replace(/[\s\-()]/g, ''))) {
      throw new ApiError('Invalid phone number format', 400, 'INVALID_PHONE');
    }
  }

  if (!hasShippingAddress) {
    return;
  }

  const address = updateData.shippingAddress!;

  if (address.country && (typeof address.country !== 'string' || address.country.length > 100)) {
    throw new ApiError('Invalid country value', 400, 'INVALID_COUNTRY');
  }

  if (address.street && (typeof address.street !== 'string' || address.street.length > 200)) {
    throw new ApiError('Street address is too long (max 200 characters)', 400, 'STREET_TOO_LONG');
  }

  if (address.city && (typeof address.city !== 'string' || address.city.length > 100)) {
    throw new ApiError('City is too long (max 100 characters)', 400, 'CITY_TOO_LONG');
  }
}
