'use client';

import {
  captureCartEmailAction,
  clearCartAction,
  estimateCartTaxAction,
} from '@/lib/actions/cart/mutation-actions';
import { applyEstimatedTax, createCartSnapshot } from './helpers';
import type { CartCommandContext, CartStoreState } from './types';

type SupportMutationMethods = Pick<
  CartStoreState,
  'captureEmail' | 'clearCart' | 'estimateTax'
>;

const SUPPORT_MUTATION_ERROR_MESSAGES = {
  captureEmail: 'Failed to save email',
  clear: 'Failed to clear cart',
  estimateTax: 'Failed to estimate tax',
} as const;

export function createCartSupportMutationCommands(
  context: CartCommandContext,
): SupportMutationMethods {
  return {
    clearCart: async () => {
      const previousCart = context.getState().cart;

      context.setState({
        ...createCartSnapshot(null),
        isPending: true,
        error: null,
      });

      const result = await clearCartAction();
      if (!result.success) {
        const message = result.error ?? SUPPORT_MUTATION_ERROR_MESSAGES.clear;
        context.setState({
          ...createCartSnapshot(previousCart),
          isPending: false,
          error: message,
        });
        throw new Error(message);
      }

      context.setState({
        ...createCartSnapshot(result.cart ?? null),
        isPending: false,
        error: null,
      });
    },

    captureEmail: async (email) => {
      const previousCart = context.getState().cart;

      context.setState({ isPending: true, error: null });

      const result = await captureCartEmailAction(null, { email });
      if (!result.success) {
        const message = result.error ?? SUPPORT_MUTATION_ERROR_MESSAGES.captureEmail;
        context.setState({ isPending: false, error: message });
        throw new Error(message);
      }

      if (!previousCart) {
        context.setState({ isPending: false, error: null });
        return;
      }

      context.setState({
        ...createCartSnapshot({
          ...previousCart,
          customerEmail: email,
        }),
        isPending: false,
        error: null,
      });
    },

    estimateTax: async (location) => {
      const previousCart = context.getState().cart;

      context.setState({ isPending: true, error: null });

      const result = await estimateCartTaxAction(null, location);
      if (!result.success || !result.data) {
        const message = result.error ?? SUPPORT_MUTATION_ERROR_MESSAGES.estimateTax;
        context.setState({
          ...createCartSnapshot(previousCart),
          isPending: false,
          error: message,
        });
        throw new Error(message);
      }

      if (!previousCart) {
        context.setState({ isPending: false, error: null });
        return;
      }

      context.setState({
        ...createCartSnapshot(applyEstimatedTax(previousCart, result.data)),
        isPending: false,
        error: null,
      });
    },
  };
}
