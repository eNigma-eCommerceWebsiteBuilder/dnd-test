import { createValidationResult } from './shared';
import { validateName } from './name';
import { validatePhone } from './phone';
import type {
  AddressValidationResult,
  ShippingAddress,
  ValidationErrors,
  ValidationResult,
} from './types';

const POSTAL_CODE_PATTERNS: Record<string, RegExp> = {
  US: /^\d{5}(-\d{4})?$/,
  CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  UK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
  DE: /^\d{5}$/,
  FR: /^\d{5}$/,
  IN: /^\d{6}$/,
};

export function validateStreetAddress(address: string): ValidationResult {
  if (!address?.trim()) {
    return createValidationResult(false, 'Address is required');
  }

  const trimmed = address.trim();
  if (trimmed.length < 5) {
    return createValidationResult(false, 'Address is too short');
  }

  if (trimmed.length > 100) {
    return createValidationResult(false, 'Address is too long');
  }

  return createValidationResult(true);
}

export function validateCity(city: string): ValidationResult {
  if (!city?.trim()) {
    return createValidationResult(false, 'City is required');
  }

  const trimmed = city.trim();
  if (trimmed.length < 2) {
    return createValidationResult(false, 'City name is too short');
  }

  if (trimmed.length > 50) {
    return createValidationResult(false, 'City name is too long');
  }

  return createValidationResult(true);
}

export function validateState(state: string): ValidationResult {
  return state?.trim()
    ? createValidationResult(true)
    : createValidationResult(false, 'State/Province is required');
}

export function validatePostalCode(
  postalCode: string,
  country: string = 'US',
): ValidationResult {
  if (!postalCode?.trim()) {
    return createValidationResult(false, 'Postal code is required');
  }

  const pattern = POSTAL_CODE_PATTERNS[country.toUpperCase()];
  if (pattern && !pattern.test(postalCode.trim())) {
    return createValidationResult(false, 'Invalid postal code format');
  }

  return createValidationResult(true);
}

export function validateShippingAddress(
  address: ShippingAddress,
): AddressValidationResult {
  const errors: ValidationErrors = {};

  const fieldResults = {
    fullName: validateName(address.fullName ?? ''),
    addressLine1: validateStreetAddress(address.addressLine1 ?? ''),
    city: validateCity(address.city ?? ''),
    state: validateState(address.state ?? ''),
    postalCode: validatePostalCode(address.postalCode ?? '', address.country),
  };

  for (const [field, result] of Object.entries(fieldResults)) {
    if (!result.valid && result.error) {
      errors[field] = result.error;
    }
  }

  if (!address.country) {
    errors.country = 'Country is required';
  }

  if (address.phone) {
    const phoneResult = validatePhone(address.phone, false);
    if (!phoneResult.valid && phoneResult.error) {
      errors.phone = phoneResult.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
