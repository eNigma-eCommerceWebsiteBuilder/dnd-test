import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';

// Used only while editing so the exact source hierarchy remains inspectable.
export const subscriptionDetailsPreview: SubscriptionDetailsPageData = {
  details: {
    subscription: {
      _id: 'puck-subscription-preview',
      contractNumber: 'SUB-2048',
      status: 'active',
      user: 'puck-preview-user',
      lines: [{
        _id: 'puck-subscription-line',
        productId: {
          _id: 'puck-subscription-product',
          name: 'Preview Wool Scarf',
          slug: 'preview-wool-scarf',
          price: 89,
          images: ['/product-placeholder.jpg'],
          stock: 10,
          inStock: true,
          isActive: true,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
        quantity: 1,
        price: 89,
        originalPrice: 89,
      }],
      sellingPlanId: 'puck-monthly-plan',
      billingPolicy: { interval: 'month', intervalCount: 1 },
      deliveryPolicy: { interval: 'month', intervalCount: 1 },
      nextBillingDate: '2026-08-01T00:00:00.000Z',
      nextDeliveryDate: '2026-08-03T00:00:00.000Z',
      billingCycleCount: 3,
      totalPrice: 89,
      shippingAddress: {
        street: '123 Preview Avenue',
        city: 'Karachi',
        state: 'Sindh',
        zipCode: '75500',
        country: 'Pakistan',
      },
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-07-01T00:00:00.000Z',
    },
    upcomingBilling: {
      amount: 89,
      daysUntil: 8,
      nextDate: '2026-08-01T00:00:00.000Z',
    },
    hasPendingModification: false,
  },
  orders: {
    orders: [{
      _id: 'puck-subscription-order',
      orderNumber: 'EN-2048',
      totalPrice: 89,
      status: 'delivered',
      isPaid: true,
      subscriptionCycle: 3,
      createdAt: '2026-07-01T00:00:00.000Z',
    }],
    pagination: { page: 1, limit: 10, total: 1, pages: 1 },
  },
  billingHistory: {
    billingHistory: [{
      _id: 'puck-billing-attempt-failed',
      status: 'failed',
      amount: 89,
      totalAmount: 89,
      billingCycle: 2,
      errorMessage: 'Preview payment retry',
      processedAt: '2026-06-01T00:00:00.000Z',
    }, {
      _id: 'puck-billing-attempt-success',
      status: 'succeeded',
      amount: 89,
      totalAmount: 89,
      billingCycle: 1,
      processedAt: '2026-05-01T00:00:00.000Z',
    }],
    pagination: { page: 1, limit: 10, total: 2, pages: 1 },
  },
};
