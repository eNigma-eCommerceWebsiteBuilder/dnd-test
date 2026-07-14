import { createValidationResult } from './shared';
import type { ValidationResult } from './types';

export function isValidPhone(phone: string): boolean {
  if (!phone) {
    return false;
  }

  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function validatePhone(
  phone: string,
  required: boolean = true,
): ValidationResult {
  if (!phone?.trim()) {
    return required
      ? createValidationResult(false, 'Phone number is required')
      : createValidationResult(true);
  }

  return isValidPhone(phone)
    ? createValidationResult(true)
    : createValidationResult(false, 'Invalid phone number format');
}
