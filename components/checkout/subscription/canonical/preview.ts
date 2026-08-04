import type { SubscriptionCheckoutData } from './subscriptionCheckoutRuntime';

// Editor-only fixture. Published Puck data is always fetched by the runtime loader.
export const subscriptionCheckoutPreview: SubscriptionCheckoutData = {
  cart: {
    _id: 'subscription-preview-cart',
    items: [{
      productId: 'subscription-preview-product',
      quantity: 1,
      price: 72,
      subtotal: 72,
      product: {
        _id: 'subscription-preview-product',
        id: 'subscription-preview-product',
        name: 'Preview Coffee Subscription',
        slug: 'preview-coffee-subscription',
        price: 90,
        originalPrice: 90,
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
        images: [],
      },
      productSnapshot: { name: 'Preview Coffee Subscription' },
    }],
    totalItems: 1,
    subtotal: 72,
    totalPrice: 72,
    total: 72,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  } as unknown as SubscriptionCheckoutData['cart'],
  sellingPlans: {
    productId: 'subscription-preview-product',
    productName: 'Preview Coffee Subscription',
    requiresSellingPlan: true,
    allowOneTimePurchase: false,
    sellingPlans: [{
      id: 'subscription-preview-plan',
      groupId: 'subscription-preview-group',
      groupName: 'Coffee Club',
      name: 'Monthly Delivery',
      intervalLabel: 'Month',
      priceLabel: '$72.00/month',
      originalPrice: 90,
      discountedPrice: 72,
      savings: 18,
      savingsPercent: 20,
      billingPolicy: { interval: 'MONTH', intervalCount: 1 },
      isActive: true,
    }],
  } as unknown as SubscriptionCheckoutData['sellingPlans'],
  pricingPreview: {
    product: { id: 'subscription-preview-product', name: 'Preview Coffee Subscription', basePrice: 90 },
    sellingPlan: { id: 'subscription-preview-plan', name: 'Monthly Delivery', intervalLabel: 'Month' },
    pricing: {
      quantity: 1,
      firstBillingPrice: 72,
      recurringPrice: 72,
      hasIntroPricing: false,
      introEndsCycle: null,
      savings: { perUnit: 18, total: 18, percent: 20 },
    },
    nextBillingDate: '2026-08-20T00:00:00.000Z',
  },
};
