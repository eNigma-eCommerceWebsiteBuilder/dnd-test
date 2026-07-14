'use server';

import type { WishlistNotificationType } from '@/lib/api';
import type {
  ActionState,
  FormDataOrObject,
  WishlistActionResult,
  WishlistBulkResult,
} from '@/lib/actions/types';
import { createUnsupportedActionResult } from '@/lib/actions/internal/unsupported';
import {
  createUnsupportedWishlistResult,
  WISHLIST_STUB_MESSAGES,
} from './shared';

export async function toggleWishlistNotificationAction(
  prevState: ActionState<WishlistActionResult>,
  formData: FormDataOrObject<{
    productId?: string;
    type?: WishlistNotificationType;
    variantId?: string;
  }>,
): Promise<WishlistActionResult> {
  void prevState;
  void formData;

  return createUnsupportedActionResult(WISHLIST_STUB_MESSAGES.notification);
}

export async function moveWishlistToCartAction(
  prevState: ActionState<WishlistActionResult>,
  formData: FormDataOrObject<{ productId?: string; variantId?: string; quantity?: number }>,
): Promise<WishlistActionResult> {
  void prevState;
  void formData;

  return createUnsupportedActionResult(WISHLIST_STUB_MESSAGES.moveToCart);
}

export async function bulkAddToWishlistAction(
  prevState: ActionState<WishlistBulkResult>,
  formData: FormDataOrObject<{ items?: Array<{ productId: string; variantId?: string }> }>,
): Promise<WishlistBulkResult> {
  void prevState;
  void formData;

  return createUnsupportedWishlistResult(WISHLIST_STUB_MESSAGES.bulkAdd);
}

export async function bulkRemoveFromWishlistAction(
  prevState: ActionState<WishlistBulkResult>,
  formData: FormDataOrObject<{ items?: Array<{ productId: string; variantId?: string }> }>,
): Promise<WishlistBulkResult> {
  void prevState;
  void formData;

  return createUnsupportedWishlistResult(WISHLIST_STUB_MESSAGES.bulkRemove);
}

export async function moveAllWishlistToCartAction(
  prevState: ActionState<WishlistBulkResult>,
): Promise<WishlistBulkResult> {
  void prevState;

  return createUnsupportedWishlistResult(WISHLIST_STUB_MESSAGES.moveAllToCart);
}
