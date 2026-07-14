'use server';

import {
  ApiError,
  getCart as apiGetCart,
  getCartCount as apiGetCartCount,
} from '@/lib/api';
import { createErrorResult, createSuccessResult, getActionErrorMessage } from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import type { ActionResult, Cart, CartCountData } from '@/lib/actions/types';

export async function getCartAction(): Promise<ActionResult<Cart | null>> {
  try {
    const cart = await apiGetCart(await getActionRequestContext());
    return createSuccessResult(cart);
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      return createSuccessResult(null);
    }

    return createErrorResult(getActionErrorMessage(error, 'Failed to load cart.'));
  }
}

export async function getCartCountAction(): Promise<ActionResult<CartCountData>> {
  try {
    const response = await apiGetCartCount(await getActionRequestContext());
    return createSuccessResult({ count: response.totalItems ?? 0 });
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to load cart count.'));
  }
}
