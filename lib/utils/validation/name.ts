import { createValidationResult } from './shared';
import type { ValidationResult } from './types';

export function validateName(
  name: string,
  minLength: number = 2,
  maxLength: number = 50,
): ValidationResult {
  if (!name?.trim()) {
    return createValidationResult(false, 'Name is required');
  }

  const trimmed = name.trim();
  if (trimmed.length < minLength) {
    return createValidationResult(
      false,
      `Name must be at least ${minLength} characters`,
    );
  }

  if (trimmed.length > maxLength) {
    return createValidationResult(
      false,
      `Name must be less than ${maxLength} characters`,
    );
  }

  return /^[a-zA-Z\s'-]+$/.test(trimmed)
    ? createValidationResult(true)
    : createValidationResult(false, 'Name contains invalid characters');
}
