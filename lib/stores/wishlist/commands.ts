'use client';

import { createWishlistMutationCommands } from './mutation-commands';
import { createWishlistQueryCommands } from './query-commands';
import type { WishlistCommandContext, WishlistStoreMethods } from './types';

export function createWishlistCommands(
  context: WishlistCommandContext,
): WishlistStoreMethods {
  return {
    ...createWishlistQueryCommands(context),
    ...createWishlistMutationCommands(context),
  };
}
