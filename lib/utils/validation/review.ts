import { createValidationResult } from './shared';
import type { ValidationResult } from './types';

export function validateReviewText(
  text: string,
  minLength: number = 10,
  maxLength: number = 1000,
): ValidationResult {
  if (!text?.trim()) {
    return createValidationResult(false, 'Review text is required');
  }

  const trimmed = text.trim();
  if (trimmed.length < minLength) {
    return createValidationResult(false, `Review must be at least ${minLength} characters`);
  }

  if (trimmed.length > maxLength) {
    return createValidationResult(false, `Review must be less than ${maxLength} characters`);
  }

  return createValidationResult(true);
}

export function validateReviewTitle(title: string): ValidationResult {
  if (!title?.trim()) {
    return createValidationResult(false, 'Review title is required');
  }

  const trimmed = title.trim();
  if (trimmed.length < 3) {
    return createValidationResult(false, 'Title must be at least 3 characters');
  }

  if (trimmed.length > 100) {
    return createValidationResult(false, 'Title must be less than 100 characters');
  }

  return createValidationResult(true);
}
