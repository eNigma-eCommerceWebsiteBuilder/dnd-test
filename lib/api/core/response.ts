import type { ApiResponseEnvelope, ApiValidationError } from '../types';
import { ApiError } from './errors';

interface ApiErrorBody {
  message?: string;
  code?: string;
  validationErrors?: ApiValidationError[];
}

export async function readResponseBody<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function extractResponseData<T>(
  responseBody: T | ApiResponseEnvelope<T> | null,
  unwrapResponse: boolean,
): T {
  if (!unwrapResponse) {
    return responseBody as T;
  }

  if (
    responseBody &&
    typeof responseBody === 'object' &&
    'data' in responseBody
  ) {
    return (responseBody as ApiResponseEnvelope<T>).data;
  }

  return responseBody as T;
}

export function createApiError(
  response: Response,
  responseBody: ApiErrorBody | null,
): ApiError {
  return new ApiError(
    responseBody?.message || 'An error occurred',
    response.status,
    responseBody?.code || 'API_ERROR',
    responseBody?.validationErrors || [],
  );
}
