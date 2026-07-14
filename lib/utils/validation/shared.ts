import type { ValidationResult } from './types';

export function createValidationResult(
  valid: boolean,
  error: string | null = null,
): ValidationResult {
  return { valid, error };
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function withThrownValidator(
  validator: () => boolean,
  fallback: string,
): ValidationResult {
  try {
    validator();
    return createValidationResult(true);
  } catch (error: unknown) {
    return createValidationResult(false, getErrorMessage(error, fallback));
  }
}
