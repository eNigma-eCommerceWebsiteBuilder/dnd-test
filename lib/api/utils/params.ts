import type { ApiQueryParams, ApiQueryValue, ApiResponseEnvelope } from '../types';

export function buildQueryString(params: ApiQueryParams = {}): string {
  const filteredEntries = Object.entries(params).filter(([, value]) => isDefinedQueryValue(value));

  if (filteredEntries.length === 0) {
    return '';
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of filteredEntries) {
    searchParams.set(key, String(value));
  }

  return `?${searchParams.toString()}`;
}

export function unwrapResponseData<T>(response: ApiResponseEnvelope<T>): T {
  return response.data;
}

export function isDefinedQueryValue(value: ApiQueryValue): value is string | number | boolean {
  return value !== undefined && value !== null && value !== '';
}
