import { revalidateTag } from 'next/cache';

export const ACTION_CACHE_TAGS = {
  cart: 'cart',
  orders: 'orders',
  payments: 'payments',
  returns: 'returns',
  reviews: 'reviews',
  wishlist: 'wishlist',
  subscriptions: 'subscriptions',
  subscriptionDrafts: 'subscription-drafts',
  collections: 'collections',
  promotions: 'promotions',
  testimonials: 'testimonials',
  menu: 'menu',
  digitalProducts: 'digital-products',
  licenses: 'license',
} as const;

export function orderCacheTag(orderId: string): string {
  return `order-${orderId}`;
}

export function paymentCacheTag(paymentId: string): string {
  return `payment-${paymentId}`;
}

export function reviewCacheTag(productId: string): string {
  return `product-${productId}-reviews`;
}

export function subscriptionCacheTag(subscriptionId: string): string {
  return `subscription-${subscriptionId}`;
}

export function draftCacheTag(draftId: string): string {
  return `draft-${draftId}`;
}

export function returnCacheTag(returnId: string): string {
  return `return-${returnId}`;
}

export function revalidateActionTags(tags: readonly string[]): void {
  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }
}
