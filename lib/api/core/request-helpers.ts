import type { ApiFetchRequestInit, ApiMutationMethod } from '../types';
import { ApiError } from './errors';
import { apiMonitor } from './monitor';
import { apiRateLimiter, analyticsRateLimiter } from './rateLimiter';
import { WEBSITE_ID } from './config';

const MUTATION_METHODS: ApiMutationMethod[] = ['POST', 'PUT', 'DELETE', 'PATCH'];

export function getCsrfToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const metaTag = document.querySelector('meta[name="csrf-token"]');
  const metaValue = metaTag?.getAttribute('content');
  if (metaValue) {
    return metaValue;
  }

  const csrfCookie = document.cookie
    .split(';')
    .find((cookie) => {
      const trimmedCookie = cookie.trim();
      return trimmedCookie.startsWith('csrf-token=') || trimmedCookie.startsWith('XSRF-TOKEN=');
    });

  return csrfCookie ? decodeURIComponent(csrfCookie.split('=')[1]) : null;
}

export function ensureRateLimit(endpoint: string): void {
  const limiter = endpoint.includes('/analytics') ? analyticsRateLimiter : apiRateLimiter;

  if (!limiter.canMakeRequest()) {
    const resetTime = limiter.getResetTime();
    throw new ApiError(
      `Rate limit exceeded. Try again in ${Math.ceil(resetTime / 1000)} seconds`,
      429,
      'RATE_LIMIT_EXCEEDED',
    );
  }
}

export function createFetchHeaders(
  headers: Record<string, string>,
  accessToken?: string,
): Record<string, string> {
  return {
    ...(WEBSITE_ID && { 'X-Website-Id': WEBSITE_ID }),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...headers,
  };
}

export function applyServerContext(
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

export function applyNextCacheOptions(
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

export function recordMetric(
  endpoint: string,
  method: string,
  status: number,
  startTime: number,
  success: boolean,
  error?: string,
): void {
  apiMonitor.record({
    endpoint,
    method,
    status,
    duration: Date.now() - startTime,
    timestamp: startTime,
    success,
    ...(error ? { error } : {}),
  });
}

export function createAbortSignal(
  timeout: number,
): { controller: AbortController; timeoutId: ReturnType<typeof setTimeout> | null } {
  const controller = new AbortController();
  const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;
  return { controller, timeoutId };
}

export function clearAbortTimeout(timeoutId: ReturnType<typeof setTimeout> | null): void {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
}

export function shouldApplyCsrfToken(method: ApiMutationMethod): boolean {
  return MUTATION_METHODS.includes(method);
}
