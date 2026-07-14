'use client';

import { createWishlistItemMutationCommands } from './item-mutation-commands';
import { createWishlistSupportMutationCommands } from './support-mutation-commands';
import type { WishlistCommandContext, WishlistStoreState } from './types';

type WishlistMutationMethods = Pick<
  WishlistStoreState,
  'addItem' | 'clearWishlist' | 'moveAllToCart' | 'moveToCart' | 'removeItem' | 'toggleNotification'
>;

export function createWishlistMutationCommands(
  context: WishlistCommandContext,
): WishlistMutationMethods {
  return {
    ...createWishlistItemMutationCommands(context),
    ...createWishlistSupportMutationCommands(context),
  };
}
