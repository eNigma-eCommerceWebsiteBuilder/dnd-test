import { ApiError } from '../core/errors';

export function validateObjectId(id: string, fieldName: string = 'ID'): boolean {
  if (!id || typeof id !== 'string') {
    throw new ApiError(`${fieldName} is required`, 400, 'MISSING_FIELD');
  }
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new ApiError(`Invalid ${fieldName} format`, 400, 'INVALID_FORMAT');
  }
  return true;
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    throw new ApiError('Email is required', 400, 'MISSING_EMAIL');
  }

  const trimmedEmail = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    throw new ApiError('Invalid email format', 400, 'INVALID_EMAIL');
  }

  if (trimmedEmail.length > 254) {
    throw new ApiError('Email is too long', 400, 'INVALID_EMAIL');
  }

  return true;
}

export function validateQuantity(quantity: number): boolean {
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    throw new ApiError('Quantity must be a number', 400, 'INVALID_QUANTITY');
  }
  if (!Number.isInteger(quantity)) {
    throw new ApiError('Quantity must be a whole number', 400, 'INVALID_QUANTITY');
  }
  if (quantity < 1) {
    throw new ApiError('Quantity must be at least 1', 400, 'QUANTITY_TOO_LOW');
  }
  if (quantity > 999) {
    throw new ApiError('Quantity cannot exceed 999', 400, 'QUANTITY_TOO_HIGH');
  }
  return true;
}

export function validatePageNumber(page: number | undefined): boolean {
  if (page === undefined || page === null) {
    return true;
  }
  if (typeof page !== 'number' || isNaN(page)) {
    throw new ApiError('Page must be a number', 400, 'INVALID_PAGE');
  }
  if (!Number.isInteger(page) || page < 1) {
    throw new ApiError('Page must be a positive integer', 400, 'INVALID_PAGE');
  }
  return true;
}

export function validateRating(rating: number): boolean {
  if (typeof rating !== 'number' || isNaN(rating)) {
    throw new ApiError('Rating must be a number', 400, 'INVALID_RATING');
  }
  if (!Number.isInteger(rating)) {
    throw new ApiError('Rating must be a whole number', 400, 'INVALID_RATING');
  }
  if (rating < 1 || rating > 5) {
    throw new ApiError('Rating must be between 1 and 5', 400, 'INVALID_RATING');
  }
  return true;
}

export function validatePrice(price: number | undefined): boolean {
  if (price === undefined || price === null) {
    return true;
  }
  if (typeof price !== 'number' || isNaN(price)) {
    throw new ApiError('Price must be a number', 400, 'INVALID_PRICE');
  }
  if (price < 0) {
    throw new ApiError('Price cannot be negative', 400, 'INVALID_PRICE');
  }
  if (price > 1000000) {
    throw new ApiError('Price is too high', 400, 'INVALID_PRICE');
  }
  return true;
}

export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim().substring(0, maxLength);
  sanitized = sanitized.replace(/\0/g, '');

  return sanitized;
}

export function validatePaymentMethod(paymentMethod: string): boolean {
  const validMethods = [
    'stripe',
    'paypal',
    'apple_pay',
    'google_pay',
    'bank_transfer',
    'cash_on_delivery'
  ];

  if (!paymentMethod || typeof paymentMethod !== 'string') {
    throw new ApiError('Payment method is required', 400, 'MISSING_PAYMENT_METHOD');
  }

  if (!validMethods.includes(paymentMethod.toLowerCase())) {
    throw new ApiError('Invalid payment method', 400, 'INVALID_PAYMENT_METHOD');
  }

  return true;
}

export function validateCountryCode(country: string): boolean {
  if (!country || typeof country !== 'string') {
    throw new ApiError('Country is required', 400, 'MISSING_COUNTRY');
  }

  if (!/^[A-Z]{2}$/.test(country)) {
    throw new ApiError('Invalid country code format (use ISO 3166-1 alpha-2)', 400, 'INVALID_COUNTRY');
  }

  return true;
}
