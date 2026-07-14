import { ApiError } from '@/lib/api';
import type { FormDataOrObject } from '../types';

export function getStringField<T extends object>(
  input: FormDataOrObject<T>,
  key: string
): string | undefined {
  if (input instanceof FormData) {
    const value = input.get(key);
    return typeof value === 'string' ? value : undefined;
  }

  const value = input[key as keyof T];
  return typeof value === 'string' ? value : undefined;
}

export function getTrimmedStringField<T extends object>(
  input: FormDataOrObject<T>,
  key: string
): string | undefined {
  const value = getStringField(input, key);
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function getBooleanField<T extends object>(
  input: FormDataOrObject<T>,
  key: string
): boolean | undefined {
  if (input instanceof FormData) {
    const value = input.get(key);
    if (typeof value !== 'string') {
      return undefined;
    }

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return undefined;
  }

  const value = input[key as keyof T];
  return typeof value === 'boolean' ? value : undefined;
}

export function getIntegerField<T extends object>(
  input: FormDataOrObject<T>,
  key: string,
  fallback?: number
): number | undefined {
  if (!(input instanceof FormData)) {
    const value = input[key as keyof T];
    if (typeof value === 'number' && Number.isInteger(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number.parseInt(value, 10);
      return Number.isInteger(parsed) ? parsed : fallback;
    }

    return fallback;
  }

  const value = input.get(key);
  if (typeof value !== 'string' || !value.trim()) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export function getObjectField<T extends object, TValue>(
  input: FormDataOrObject<T>,
  key: string,
  guard: (value: unknown) => value is TValue
): TValue | undefined {
  if (input instanceof FormData) {
    return undefined;
  }

  const value = input[key as keyof T];
  return guard(value) ? value : undefined;
}

export function parseJsonField<T extends object, TValue>(
  input: FormDataOrObject<T>,
  key: string,
  guard: (value: unknown) => value is TValue,
  errorMessage: string
): TValue | undefined {
  if (!(input instanceof FormData)) {
    const value = input[key as keyof T];
    if (typeof value === 'string') {
      return parseJsonString(value, guard, errorMessage);
    }

    if (guard(value)) {
      return value;
    }

    return undefined;
  }

  const raw = input.get(key);
  if (typeof raw !== 'string' || !raw.trim()) {
    return undefined;
  }

  return parseJsonString(raw, guard, errorMessage);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseJsonString<TValue>(
  value: string,
  guard: (candidate: unknown) => candidate is TValue,
  errorMessage: string
): TValue {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!guard(parsed)) {
      throw new ApiError(errorMessage, 400, 'INVALID_JSON_PAYLOAD');
    }

    return parsed;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(errorMessage, 400, 'INVALID_JSON_PAYLOAD');
  }
}
