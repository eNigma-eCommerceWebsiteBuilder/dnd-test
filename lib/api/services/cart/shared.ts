import { ApiError } from '../../core/errors';
import { validateCountryCode, validateEmail, validateObjectId, validateQuantity } from '../../utils/validators';
import type { Location } from '../../types';

export function validateCartProductSelection(productId: string, variantId?: string | null): void {
  validateObjectId(productId, 'Product ID');
  if (variantId) {
    validateObjectId(variantId, 'Variant ID');
  }
}

export function normalizeCartEmail(email: string): string {
  validateEmail(email);
  return email.trim().toLowerCase();
}

export function validateTaxLocation(location: Location): void {
  if (!location || typeof location !== 'object') {
    throw new ApiError('Location is required', 400, 'MISSING_LOCATION');
  }

  if (!location.country) {
    throw new ApiError('Country is required for tax estimation', 400, 'MISSING_COUNTRY');
  }

  validateCountryCode(location.country.toUpperCase());
}

export function validateSellingPlanId(sellingPlanId: string): string {
  if (!sellingPlanId || typeof sellingPlanId !== 'string' || sellingPlanId.trim().length === 0) {
    throw new ApiError('Selling Plan ID is required', 400, 'MISSING_SELLING_PLAN_ID');
  }

  return sellingPlanId.trim();
}

export { validateQuantity };
