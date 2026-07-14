'use server';

import {
  ApiError,
  checkProductInWishlist as apiCheckProductInWishlist,
  getWishlist as apiGetWishlist,
  getWishlistCount as apiGetWishlistCount,
  viewSharedWishlist as apiViewSharedWishlist,
  type Wishlist,
} from '@/lib/api';
import { createErrorResult, createSuccessResult, getActionErrorMessage } from '@/lib/actions/internal/errors';
import { getTrimmedStringField } from '@/lib/actions/internal/forms';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import type {
  ActionResult,
  ActionState,
  FormDataOrObject,
  WishlistActionResult,
} from '@/lib/actions/types';
import { WishlistFieldKey, withWishlistCompatibility } from './shared';

export async function getWishlistAction(
  prevState: ActionState<Wishlist>,
): Promise<ActionResult<Wishlist>> {
  void prevState;

  try {
    const wishlist = await apiGetWishlist(await getActionRequestContext());
    return createSuccessResult(wishlist);
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to load wishlist.'));
  }
}

export async function viewSharedWishlistAction(
  prevState: ActionState<Wishlist>,
  formData: FormDataOrObject<{ shareToken?: string }>,
): Promise<WishlistActionResult> {
  void prevState;

  const shareToken = getTrimmedStringField(formData, WishlistFieldKey.SHARE_TOKEN);
  if (!shareToken) {
    return createErrorResult('Share token is required.');
  }

  try {
    const wishlist = await apiViewSharedWishlist(shareToken, await getActionRequestContext());
    return withWishlistCompatibility(
      createSuccessResult(wishlist, { message: 'Shared wishlist loaded.' }),
      wishlist,
    );
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to load shared wishlist.'));
  }
}

export async function checkWishlistItemAction(
  prevState: ActionState<{ inWishlist: boolean }>,
  formData: FormDataOrObject<{ productId?: string; variantId?: string }>,
): Promise<ActionResult<{ inWishlist: boolean }>> {
  void prevState;

  const productId = getTrimmedStringField(formData, WishlistFieldKey.PRODUCT_ID);
  const variantId = getTrimmedStringField(formData, WishlistFieldKey.VARIANT_ID);

  if (!productId) {
    return createErrorResult('Product ID is required.');
  }

  try {
    const response = await apiCheckProductInWishlist(
      productId,
      variantId,
      await getActionRequestContext(),
    );
    return createSuccessResult(response.data);
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      return createSuccessResult({ inWishlist: false });
    }

    return createErrorResult(getActionErrorMessage(error, 'Failed to check wishlist.'));
  }
}

export async function getWishlistCountAction(
  prevState: ActionState<{ count: number }>,
): Promise<ActionResult<{ count: number }>> {
  void prevState;

  try {
    const response = await apiGetWishlistCount(await getActionRequestContext());
    return createSuccessResult(response.data);
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to get wishlist count.'));
  }
}
