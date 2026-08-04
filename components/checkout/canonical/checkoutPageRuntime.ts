import { cache } from 'react';
import { auth } from '@/auth';
import { getCart } from '@/lib/api/services/cart';
import type { Cart } from '@/lib/api/types/cart';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface CheckoutPageData {
  cart: Cart | null;
  initialEmail?: string;
}

const loadCheckoutPageData = cache(async (
  requestCookies?: string,
): Promise<CheckoutPageData> => {
  const [cart, session] = await Promise.all([
    getCart({ cookies: requestCookies }).catch((error: unknown) => {
      console.error('Error fetching checkout data:', error);
      return null;
    }),
    auth(),
  ]);

  return {
    cart,
    initialEmail: session?.user?.email ?? undefined,
  };
});

// Puck already supplies request cookies through metadata, so this loader never
// imports next/headers into the editor's client-side configuration.
export function loadCheckoutPageRuntime(
  context?: PuckFetcherContext,
): Promise<CheckoutPageData> {
  return loadCheckoutPageData(context?.metadata?.requestCookies);
}
