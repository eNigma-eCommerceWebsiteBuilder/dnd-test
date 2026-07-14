import type { ApiValidationError } from '@/lib/api/types';

export function hasApiValidationErrors(error: unknown): error is {
  validationErrors: ApiValidationError[];
} {
  if (!error || typeof error !== 'object' || !('validationErrors' in error)) {
    return false;
  }

  const candidate = error.validationErrors;
  return Array.isArray(candidate);
}
