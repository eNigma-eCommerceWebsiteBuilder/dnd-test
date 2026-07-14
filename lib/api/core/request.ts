import type { ApiFetchRequestInit, ApiMutateOptions, ApiRequestOptions, ApiValidationError } from '../types';
import { buildQueryString } from '../utils/params';
import { API_BASE_URL, DEFAULT_TIMEOUT, WEBSITE_ID } from './config';
import { ApiError, getErrorMessage } from './errors';
import { extractResponseData, readResponseBody, createApiError } from './response';
import { getCsrfToken, shouldApplyCsrfToken } from './request-helpers';

async function executeFetch<T>(
  endpoint: string,
  fetchOptions: ApiFetchRequestInit,
  unwrapResponse: boolean,
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    const responseBody = await readResponseBody<T>(response);

    if (!response.ok) {
      const apiError = createApiError(
        response,
        responseBody as { message?: string; code?: string; validationErrors?: ApiValidationError[] } | null,
      );
      throw apiError;
    }

    return extractResponseData(responseBody, unwrapResponse);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout - please try again', 408, 'TIMEOUT_ERROR');
    }

    throw new ApiError(
      getErrorMessage(error, 'Network error occurred'),
      0,
      'NETWORK_ERROR',
    );
  }
}

function createAbortSignal(timeout: number): { controller: AbortController; timeoutId: ReturnType<typeof setTimeout> | null } {
  const controller = new AbortController();
  const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;
  return { controller, timeoutId };
}

function clearAbortTimeout(timeoutId: ReturnType<typeof setTimeout> | null): void {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
}

function createFetchHeaders(
  headers: Record<string, string>,
  accessToken?: string,
): Record<string, string> {
  return {
    ...(WEBSITE_ID && { 'X-Website-Id': WEBSITE_ID }),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...headers,
  };
}

function applyServerContext(
  fetchOptions: ApiFetchRequestInit,
  fetchHeaders: Record<string, string>,
  cookies?: string,
): void {
  if (typeof window === 'undefined') {
    if (cookies) {
      fetchHeaders.Cookie = cookies;
    }
    return;
  }

  fetchOptions.credentials = 'include';
}

function applyNextCacheOptions(
  fetchOptions: ApiFetchRequestInit,
  cache: RequestCache | undefined,
  revalidate: number | false | undefined,
  tags: string[] | undefined,
): void {
  if (cache) {
    fetchOptions.cache = cache;
  }

  if (revalidate !== undefined || tags?.length) {
    fetchOptions.next = {
      ...(revalidate !== undefined && { revalidate }),
      ...(tags?.length ? { tags } : {}),
    };
  }
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    params,
    headers = {},
    cache,
    revalidate,
    tags,
    timeout = DEFAULT_TIMEOUT,
    cookies,
    accessToken,
    unwrapResponse = true,
  } = options;

  const { controller, timeoutId } = createAbortSignal(timeout);
  const fetchHeaders = createFetchHeaders(headers, accessToken);
  const requestUrl = `${endpoint}${buildQueryString(params)}`;
  const fetchOptions: ApiFetchRequestInit = {
    method: 'GET',
    headers: fetchHeaders,
    signal: controller.signal,
  };

  applyServerContext(fetchOptions, fetchHeaders, cookies);
  applyNextCacheOptions(fetchOptions, cache, revalidate, tags);

  try {
    return await executeFetch<T>(requestUrl, fetchOptions, unwrapResponse);
  } finally {
    clearAbortTimeout(timeoutId);
  }
}

export async function apiMutate<T = unknown>(
  endpoint: string,
  options: ApiMutateOptions = {},
): Promise<T> {
  const {
    method = 'POST',
    body,
    headers = {},
    isFormData = false,
    timeout = DEFAULT_TIMEOUT,
    cookies,
    accessToken,
    unwrapResponse = true,
  } = options;

  const { controller, timeoutId } = createAbortSignal(timeout);
  const fetchHeaders = createFetchHeaders(headers, accessToken);
  const fetchOptions: ApiFetchRequestInit = {
    method,
    headers: fetchHeaders,
    signal: controller.signal,
  };

  applyServerContext(fetchOptions, fetchHeaders, cookies);

  if (shouldApplyCsrfToken(method)) {
    const csrfToken = await ensureBrowserCsrfToken();
    if (csrfToken) {
      fetchHeaders['X-CSRF-Token'] = csrfToken;
    }
  }

  if (!isFormData) {
    fetchHeaders['Content-Type'] = 'application/json';
  }

  if (body !== undefined) {
    fetchOptions.body = isFormData
      ? (body as BodyInit)
      : JSON.stringify(body);
  }

  try {
    return await executeFetch<T>(endpoint, fetchOptions, unwrapResponse);
  } finally {
    clearAbortTimeout(timeoutId);
  }
}

async function ensureBrowserCsrfToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const existingToken = getCsrfToken();
  if (existingToken) {
    return existingToken;
  }

  await fetch('/api/backend/auth/csrf-token', {
    cache: 'no-store',
    credentials: 'include',
  });

  return getCsrfToken();
}
