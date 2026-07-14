'use server';

import {
  addToWishlist as apiAddToWishlist,
  clearWishlist as apiClearWishlist,
  generateShareLink as apiGenerateShareLink,
  removeFromWishlist as apiRemoveFromWishlist,
} from '@/lib/api';
import { ACTION_CACHE_TAGS, revalidateActionTags } from '@/lib/actions/internal/cache';
import { createErrorResult, createSuccessResult, getActionErrorMessage } from '@/lib/actions/internal/errors';
import { getTrimmedStringField } from '@/lib/actions/internal/forms';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import type {
  ActionResult,
  ActionState,
  FormDataOrObject,
  WishlistActionResult,
} from '@/lib/actions/types';
import { createEmptyWishlist, WishlistFieldKey, withWishlistCompatibility } from './shared';

function revalidateWishlistTags(): void {
  revalidateActionTags([ACTION_CACHE_TAGS.wishlist, ACTION_CACHE_TAGS.cart]);
}

export async function addToWishlistAction(
  prevState: ActionState<WishlistActionResult>,
  formData: FormDataOrObject<{ productId?: string; variantId?: string }>,
): Promise<WishlistActionResult> {
  void prevState;

  const productId = getTrimmedStringField(formData, WishlistFieldKey.PRODUCT_ID);
  const variantId = getTrimmedStringField(formData, WishlistFieldKey.VARIANT_ID);

  if (!productId) {
    return createErrorResult('Product ID is required.');
  }

  try {
    const wishlist = await apiAddToWishlist(productId, variantId, await getActionRequestContext());
    revalidateWishlistTags();

    return withWishlistCompatibility(
      createSuccessResult(wishlist, { message: 'Added to wishlist.' }),
      wishlist,
    );
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to add to wishlist.'));
  }
}

export async function removeFromWishlistAction(
  prevState: ActionState<WishlistActionResult>,
  formData: FormDataOrObject<{ productId?: string; variantId?: string }>,
): Promise<WishlistActionResult> {
  void prevState;

  const productId = getTrimmedStringField(formData, WishlistFieldKey.PRODUCT_ID);
  const variantId = getTrimmedStringField(formData, WishlistFieldKey.VARIANT_ID);

  if (!productId) {
    return createErrorResult('Product ID is required.');
  }

  try {
    const wishlist = await apiRemoveFromWishlist(
      productId,
      variantId,
      await getActionRequestContext(),
    );
    revalidateWishlistTags();

    return withWishlistCompatibility(
      createSuccessResult(wishlist, { message: 'Removed from wishlist.' }),
      wishlist,
    );
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to remove from wishlist.'));
  }
}

export async function clearWishlistAction(
  prevState: ActionState<WishlistActionResult>,
): Promise<WishlistActionResult> {
  void prevState;

  try {
    await apiClearWishlist(await getActionRequestContext());
    const wishlist = createEmptyWishlist();
    revalidateWishlistTags();

    return withWishlistCompatibility(
      createSuccessResult(wishlist, { message: 'Wishlist cleared.' }),
      wishlist,
    );
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to clear wishlist.'));
  }
}

export async function generateWishlistShareLinkAction(
  prevState: ActionState<{ shareToken: string; shareUrl: string }>,
): Promise<ActionResult<{ shareToken: string; shareUrl: string }>> {
  void prevState;

  try {
    const response = await apiGenerateShareLink(await getActionRequestContext());
    revalidateWishlistTags();

    return createSuccessResult(response.data, {
      message: response.message || 'Share link generated.',
    });
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to generate share link.'));
  }
}
