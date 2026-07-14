import { ApiError, type ApiValidationError } from '@/lib/api';
import type { ActionResult, FieldErrors } from '../types';

export function getActionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function toFieldErrors<TFieldKey extends string = string>(
  validationErrors: ApiValidationError[]
): FieldErrors<TFieldKey> {
  const fieldErrors: FieldErrors<TFieldKey> = {};

  for (const validationError of validationErrors) {
    const field = validationError.field as TFieldKey;
    if (!field || !validationError.message) {
      continue;
    }

    fieldErrors[field] = validationError.message;
  }

  return fieldErrors;
}

export function createSuccessResult<TData>(
  data: TData,
  options: Omit<ActionResult<TData>, 'success' | 'data'> = {}
): ActionResult<TData> {
  return {
    success: true,
    data,
    ...options,
  };
}

export function createEmptySuccessResult(
  options: Omit<ActionResult, 'success'> = {}
): ActionResult {
  return {
    success: true,
    ...options,
  };
}

export function createErrorResult<TData = undefined, TFieldKey extends string = string>(
  error: string,
  options: Omit<ActionResult<TData, TFieldKey>, 'success' | 'error'> = {}
): ActionResult<TData, TFieldKey> {
  return {
    success: false,
    error,
    ...options,
  };
}
