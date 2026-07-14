import {
  validatePrice as validateApiPrice,
  validateQuantity as validateApiQuantity,
  validateRating as validateApiRating,
} from '@/lib/api/utils/validators';
import { createValidationResult, withThrownValidator } from './shared';
import type { ValidationResult } from './types';

export function validateQuantity(
  quantity: number,
  min: number = 1,
  max: number = 999,
): ValidationResult {
  if (quantity === undefined || quantity === null) {
    return createValidationResult(false, 'Quantity is required');
  }

  if (!Number.isInteger(quantity)) {
    return createValidationResult(false, 'Invalid quantity');
  }

  if (quantity < min) {
    return createValidationResult(false, `Minimum quantity is ${min}`);
  }

  if (quantity > max) {
    return createValidationResult(false, `Maximum quantity is ${max}`);
  }

  return withThrownValidator(() => validateApiQuantity(quantity), 'Invalid quantity');
}

export function validatePrice(price: number): ValidationResult {
  if (price === undefined || price === null) {
    return createValidationResult(false, 'Price is required');
  }

  return withThrownValidator(() => validateApiPrice(price), 'Invalid price');
}

export function validateRating(rating: number): ValidationResult {
  if (rating === undefined || rating === null) {
    return createValidationResult(false, 'Rating is required');
  }

  return withThrownValidator(() => validateApiRating(rating), 'Invalid rating');
}
