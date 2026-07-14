import { ACTION_CACHE_TAGS, revalidateActionTags } from '@/lib/actions/internal/cache';
import type {
  ActionResult,
  Cart,
  CartActionResult,
  FormDataOrObject,
} from '@/lib/actions/types';

export enum CartFieldKey {
  PRODUCT_ID = 'productId',
  QUANTITY = 'quantity',
  VARIANT_ID = 'variantId',
  EMAIL = 'email',
  COUNTRY = 'country',
  STATE = 'state',
  CITY = 'city',
}

export interface CartItemPayload {
  productId?: string;
  quantity?: number;
  variantId?: string;
}

export function revalidateCartTags(): void {
  revalidateActionTags([ACTION_CACHE_TAGS.cart]);
}

export function withCartCompatibility(result: ActionResult<Cart>, cart: Cart): CartActionResult {
  return {
    ...result,
    cart,
  };
}

export type CartEmailPayload = FormDataOrObject<{ email?: string }>;
export type CartTaxLocationPayload = FormDataOrObject<{
  country?: string;
  state?: string;
  city?: string;
}>;
