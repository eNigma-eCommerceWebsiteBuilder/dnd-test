import { createValidationResult } from './shared';
import type { ValidationResult } from './types';

export function isValidCardNumber(cardNumber: string): boolean {
  if (!cardNumber) {
    return false;
  }

  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned) || cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;
  for (let index = cleaned.length - 1; index >= 0; index -= 1) {
    let digit = Number.parseInt(cleaned[index], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function validateCVV(
  cvv: string,
  cardType: string = 'other',
): ValidationResult {
  if (!cvv) {
    return createValidationResult(false, 'CVV is required');
  }

  const cleaned = cvv.replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned)) {
    return createValidationResult(false, 'CVV must contain only numbers');
  }

  const requiredLength = cardType === 'amex' ? 4 : 3;
  return cleaned.length === requiredLength
    ? createValidationResult(true)
    : createValidationResult(false, `CVV must be ${requiredLength} digits`);
}

export function validateCardExpiry(
  month: string | number,
  year: string | number,
): ValidationResult {
  if (!month || !year) {
    return createValidationResult(false, 'Expiry date is required');
  }

  const monthNumber = Number.parseInt(month.toString(), 10);
  const yearNumber = Number.parseInt(year.toString(), 10);
  if (Number.isNaN(monthNumber) || Number.isNaN(yearNumber)) {
    return createValidationResult(false, 'Invalid expiry date');
  }

  if (monthNumber < 1 || monthNumber > 12) {
    return createValidationResult(false, 'Invalid month');
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const expirationYear = year.toString().length === 2 ? 2000 + yearNumber : yearNumber;

  if (
    expirationYear < currentYear ||
    (expirationYear === currentYear && monthNumber < currentMonth)
  ) {
    return createValidationResult(false, 'Card has expired');
  }

  return createValidationResult(true);
}
