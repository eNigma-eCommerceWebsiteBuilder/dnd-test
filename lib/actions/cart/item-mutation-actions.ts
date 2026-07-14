'use server';

import {
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  updateCartItem as apiUpdateCartItem,
} from '@/lib/api';
import { createErrorResult, createSuccessResult, getActionErrorMessage } from '@/lib/actions/internal/errors';
import { getIntegerField, getTrimmedStringField } from '@/lib/actions/internal/forms';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import type {
  ActionState,
  Cart,
  CartActionResult,
  FormDataOrObject,
} from '@/lib/actions/types';
import {
  CartFieldKey,
  type CartItemPayload,
  revalidateCartTags,
  withCartCompatibility,
} from './shared';

export async function addToCartAction(
  prevState: ActionState<Cart>,
  formData: FormDataOrObject<CartItemPayload>,
): Promise<CartActionResult> {
  void prevState;

  const productId = getTrimmedStringField(formData, CartFieldKey.PRODUCT_ID);
  const quantity = getIntegerField(formData, CartFieldKey.QUANTITY, 1) ?? 1;
  const variantId = getTrimmedStringField(formData, CartFieldKey.VARIANT_ID);

  if (!productId) {
    return createErrorResult('Product ID is required.');
  }

  try {
    const cart = await apiAddToCart(
      productId,
      quantity,
      variantId ?? null,
      await getActionRequestContext(),
    );
    revalidateCartTags();

    return withCartCompatibility(
      createSuccessResult(cart, { message: 'Added to cart.' }),
      cart,
    );
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to add to cart.'));
  }
}

export async function removeFromCartAction(
  prevState: ActionState<Cart>,
  formData: FormDataOrObject<Pick<CartItemPayload, 'productId'>>,
): Promise<CartActionResult> {
  void prevState;

  const productId = getTrimmedStringField(formData, CartFieldKey.PRODUCT_ID);
  if (!productId) {
    return createErrorResult('Product ID is required.');
  }

  try {
    const cart = await apiRemoveFromCart(productId, await getActionRequestContext());
    revalidateCartTags();

    return withCartCompatibility(
      createSuccessResult(cart, { message: 'Removed from cart.' }),
      cart,
    );
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to remove from cart.'));
  }
}

export async function updateCartItemAction(
  prevState: ActionState<Cart>,
  formData: FormDataOrObject<Pick<CartItemPayload, 'productId' | 'quantity'>>,
): Promise<CartActionResult> {
  void prevState;

  const productId = getTrimmedStringField(formData, CartFieldKey.PRODUCT_ID);
  const quantity = getIntegerField(formData, CartFieldKey.QUANTITY);

  if (!productId) {
    return createErrorResult('Product ID is required.');
  }

  if (quantity === undefined || quantity < 0) {
    return createErrorResult('Valid quantity is required.');
  }

  if (quantity === 0) {
    return removeFromCartAction(null, { productId });
  }

  try {
    const cart = await apiUpdateCartItem(productId, quantity, await getActionRequestContext());
    revalidateCartTags();

    return withCartCompatibility(
      createSuccessResult(cart, { message: 'Cart updated.' }),
      cart,
    );
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to update cart.'));
  }
}
