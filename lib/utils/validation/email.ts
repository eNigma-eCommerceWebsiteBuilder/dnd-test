import { validateEmail as validateApiEmail } from '@/lib/api/utils/validators';
import { createValidationResult, withThrownValidator } from './shared';
import type { ValidationResult } from './types';

export function isValidEmail(email: string): boolean {
  return validateEmail(email).valid;
}

export function validateEmail(email: string): ValidationResult {
  if (!email?.trim()) {
    return createValidationResult(false, 'Email is required');
  }

  return withThrownValidator(() => validateApiEmail(email), 'Invalid email format');
}
