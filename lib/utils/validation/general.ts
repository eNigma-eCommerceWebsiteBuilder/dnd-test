import { sanitizeString as sanitizeApiString } from '@/lib/api/core/sanitizer';
import { validateObjectId } from '@/lib/api/utils/validators';

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

export function sanitizeString(value: string): string {
  return sanitizeApiString(value);
}

export function isValidObjectId(id: string): boolean {
  try {
    validateObjectId(id);
    return true;
  } catch {
    return false;
  }
}
