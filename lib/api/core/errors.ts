import type { ApiValidationError } from '../types';

export class ApiError extends Error {
  status: number;
  code: string;
  validationErrors: ApiValidationError[];

  constructor(
    message: string,
    status: number,
    code: string,
    validationErrors: ApiValidationError[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.validationErrors = validationErrors;
  }
}

interface ErrorWithStatus {
  status: number;
}

export function hasErrorStatus(error: unknown): error is ErrorWithStatus {
  return typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number';
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
