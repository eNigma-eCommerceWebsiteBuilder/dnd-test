import { ApiError } from '@/lib/api/core/client';

interface ActionLike {
  success: boolean;
  error?: string;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}

export function assertActionSuccess(
  result: ActionLike,
  fallback: string,
): void {
  if (!result.success) {
    throw new Error(result.error || fallback);
  }
}
