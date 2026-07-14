'use client';

import { createCartItemMutationCommands } from './item-mutation-commands';
import { createCartSupportMutationCommands } from './support-mutation-commands';
import type { CartCommandContext, CartStoreState } from './types';

type CartMutationMethods = Pick<
  CartStoreState,
  'addItem' | 'captureEmail' | 'clearCart' | 'estimateTax' | 'removeItem' | 'updateItem'
>;

export function createCartMutationCommands(
  context: CartCommandContext,
): CartMutationMethods {
  return {
    ...createCartItemMutationCommands(context),
    ...createCartSupportMutationCommands(context),
  };
}
