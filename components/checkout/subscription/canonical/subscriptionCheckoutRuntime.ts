import { cache } from 'react';

import { getCart } from '@/lib/api/services/cart';
import {
  getProductSellingPlans,
  previewSubscriptionPricing,
} from '@/lib/api/services/selling-plans';
import type { Cart } from '@/lib/api/types/cart';
import type {
  ProductSellingPlansResponse,
  SubscriptionPreview,
} from '@/lib/api/types/selling-plans';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface SubscriptionCheckoutData {
  cart: Cart;
  pricingPreview: SubscriptionPreview | null;
  sellingPlans: ProductSellingPlansResponse | null;
}

// Mirrors app/checkout/subscription/subscriptionPageUtils.tsx for Puck's server renderer.
const loadSubscriptionCheckoutData = cache(async (
  requestCookies?: string,
): Promise<SubscriptionCheckoutData | null> => {
  const cart = await getCart({ cookies: requestCookies }).catch(() => null);

  if (!cart?.items?.length) {
    return null;
  }

  const primaryItem = cart.items[0];
  const sellingPlanId = (primaryItem as { sellingPlanId?: unknown }).sellingPlanId;
  const [sellingPlans, pricingPreview] = await Promise.all([
    getProductSellingPlans(primaryItem.productId).catch(() => null),
    typeof sellingPlanId === 'string'
      ? previewSubscriptionPricing({
        productId: primaryItem.productId,
        sellingPlanId,
        quantity: primaryItem.quantity,
        variantId: primaryItem.variantId,
      }).catch(() => null)
      : Promise.resolve(null),
  ]);

  return { cart, pricingPreview, sellingPlans };
});

export function loadSubscriptionCheckoutRuntime(
  context?: PuckFetcherContext,
): Promise<SubscriptionCheckoutData | null> {
  return loadSubscriptionCheckoutData(context?.metadata?.requestCookies);
}
