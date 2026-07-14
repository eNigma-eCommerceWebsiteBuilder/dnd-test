import type { BillingPolicy, PricingPolicy } from './subscriptions';

export interface SellingPlanGroup {
    _id: string;
    name: string;
    description?: string;
    options?: string[];
    position?: number;
    isActive: boolean;
}

export interface SellingPlan {
    id: string;
    groupId: string;
    groupName: string;
    name: string;
    description?: string;
    intervalLabel: string;
    priceLabel: string;
    originalPrice: number;
    discountedPrice: number;
    savings: number;
    savingsPercent: number;
    billingPolicy: BillingPolicy;
    deliveryPolicy?: BillingPolicy;
    pricingPolicy?: PricingPolicy;
    isActive: boolean;
}

export interface ProductSellingPlansResponse {
    productId: string;
    productName: string;
    requiresSellingPlan: boolean;
    allowOneTimePurchase: boolean;
    sellingPlans: SellingPlan[];
}

export interface SubscriptionPreviewRequest {
    productId: string;
    variantId?: string;
    sellingPlanId: string;
    quantity: number;
}

export interface SubscriptionPreview {
    product: {
        id: string;
        name: string;
        basePrice: number;
    };
    sellingPlan: {
        id: string;
        name: string;
        intervalLabel: string;
    };
    pricing: {
        quantity: number;
        firstBillingPrice: number;
        recurringPrice: number;
        hasIntroPricing: boolean;
        introEndsCycle: number | null;
        savings: {
            perUnit: number;
            total: number;
            percent: number;
        };
    };
    nextBillingDate: string;
}

export interface AddSubscriptionToCartRequest {
    productId: string;
    variantId?: string;
    quantity: number;
    sellingPlanId: string;
}

export interface SubscriptionCheckoutRequest {
    customerEmail: string;
    customerName: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
    };
    successUrl: string;
    cancelUrl: string;
}

export interface SubscriptionCheckoutResponse {
    checkoutUrl: string;
    sessionId: string;
}
