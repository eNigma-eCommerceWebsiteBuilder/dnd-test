import { apiMutate } from '../../core/client';
import type {
  ApiMutateOptions,
  Cart,
  Location,
  TaxEstimate,
  TaxEstimateSimple,
} from '../../types';
import {
  normalizeCartEmail,
  validateCartProductSelection,
  validateQuantity,
  validateSellingPlanId,
  validateTaxLocation,
} from './shared';

export async function addToCart(
  productId: string,
  quantity: number = 1,
  variantId: string | null = null,
  options: ApiMutateOptions = {},
): Promise<Cart> {
  validateCartProductSelection(productId, variantId);
  validateQuantity(quantity);

  return apiMutate<Cart>('/cart/add', {
    method: 'POST',
    body: {
      productId,
      quantity,
      ...(variantId ? { variantId } : {}),
    },
    ...options,
  });
}

export async function updateCartItem(
  productId: string,
  quantity: number,
  options: ApiMutateOptions = {},
): Promise<Cart> {
  validateCartProductSelection(productId);
  validateQuantity(quantity);

  return apiMutate<Cart>(`/cart/update/${productId}`, {
    method: 'PUT',
    body: { quantity },
    ...options,
  });
}

export async function removeFromCart(
  productId: string,
  options: ApiMutateOptions = {},
): Promise<Cart> {
  validateCartProductSelection(productId);

  return apiMutate<Cart>(`/cart/remove/${productId}`, {
    method: 'DELETE',
    ...options,
  });
}

export async function clearCart(options: ApiMutateOptions = {}): Promise<Cart> {
  return apiMutate<Cart>('/cart/clear', {
    method: 'DELETE',
    ...options,
  });
}

export async function captureCartEmail(
  email: string,
  options: ApiMutateOptions = {},
): Promise<{ email: string }> {
  return apiMutate<{ email: string }>('/cart/email', {
    method: 'POST',
    body: { email: normalizeCartEmail(email) },
    ...options,
  });
}

export async function estimateCartTax(
  location: Location,
  options: ApiMutateOptions = {},
): Promise<TaxEstimate | TaxEstimateSimple> {
  validateTaxLocation(location);

  return apiMutate<TaxEstimate | TaxEstimateSimple>('/cart/estimate-tax', {
    method: 'POST',
    body: { location },
    ...options,
  });
}

export async function addSubscriptionToCart(
  productId: string,
  sellingPlanId: string,
  quantity: number = 1,
  variantId?: string,
  options: ApiMutateOptions = {},
): Promise<Cart> {
  validateCartProductSelection(productId, variantId);
  validateQuantity(quantity);

  return apiMutate<Cart>('/checkout/cart/subscription', {
    method: 'POST',
    body: {
      productId,
      sellingPlanId: validateSellingPlanId(sellingPlanId),
      quantity,
      ...(variantId ? { variantId } : {}),
    },
    ...options,
  });
}
