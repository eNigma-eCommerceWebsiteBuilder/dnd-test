import { AnalyticsEventType } from '@/lib/api/types/analytics';
import { calculateSubscriptionSavings, formatBillingInterval, validateSellingPlanCompatibility } from '@/lib/utils/subscriptions';
import { formatPrice } from '@/lib/utils/formatters';
import type { Cart, CartItem } from '@/lib/api/types/cart';
import type { ProductSellingPlansResponse, SellingPlan, SubscriptionPreview } from '@/lib/api/types/selling-plans';

export interface SubscriptionCheckoutClientProps {
  cart: Cart;
  sellingPlans: ProductSellingPlansResponse | null;
  pricingPreview: SubscriptionPreview | null;
  summaryPanel: React.ReactNode;
  pricingPanel: React.ReactNode;
  subscriptionSummaryPanel: React.ReactNode;
}

export interface CustomerInfoState {
  email: string;
  firstName: string;
  lastName: string;
}

export interface ShippingAddressState {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CheckoutValidationArgs {
  customerInfo: CustomerInfoState;
  shippingAddress: ShippingAddressState;
  termsAccepted: boolean;
  primaryItem?: CartItem;
  effectivePlan?: SellingPlan | null;
  effectivePlanId?: string;
}

const EMPTY_CUSTOMER_INFO: CustomerInfoState = {
  email: '',
  firstName: '',
  lastName: '',
};

const EMPTY_SHIPPING_ADDRESS: ShippingAddressState = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

export function getEmptyCustomerInfo(): CustomerInfoState {
  return { ...EMPTY_CUSTOMER_INFO };
}

export function getEmptyShippingAddress(): ShippingAddressState {
  return { ...EMPTY_SHIPPING_ADDRESS };
}

export function getSellingPlanId(item: CartItem | undefined): string | undefined {
  if (!item) {
    return undefined;
  }

  const candidate = (item as CartItem & { sellingPlanId?: unknown }).sellingPlanId;
  return typeof candidate === 'string' && candidate.trim().length > 0 ? candidate : undefined;
}

export function getBillingTermsText(
  previewData: SubscriptionPreview | null,
  effectivePlan: SellingPlan | null,
): string {
  if (!previewData?.pricing.firstBillingPrice) {
    return 'I agree to the subscription terms and recurring billing.';
  }

  const intervalLabel = effectivePlan?.billingPolicy
    ? formatBillingInterval(effectivePlan.billingPolicy.interval, effectivePlan.billingPolicy.intervalCount)
    : previewData.sellingPlan?.intervalLabel;
  const intervalSuffix = intervalLabel ? ` ${intervalLabel.toLowerCase()}` : '';

  return `I agree to the subscription terms. My card will be charged ${formatPrice(previewData.pricing.firstBillingPrice)}${intervalSuffix} until I cancel.`;
}

export function getBillingPolicyText(
  primaryItem: CartItem | undefined,
  effectivePlan: SellingPlan | null,
): string {
  if (!effectivePlan || !primaryItem) {
    return 'Cancellation policy details will be shared before payment.';
  }

  const savings = calculateSubscriptionSavings(
    effectivePlan,
    primaryItem.quantity,
    primaryItem.product.originalPrice || primaryItem.product.price,
  );

  return `Save ${formatPrice(savings.amount)} per delivery with this subscription.`;
}

export function getCheckoutValidationError({
  customerInfo,
  shippingAddress,
  termsAccepted,
  primaryItem,
  effectivePlan,
  effectivePlanId,
}: CheckoutValidationArgs): string | null {
  if (!primaryItem) {
    return 'Cart is empty.';
  }

  if (!termsAccepted) {
    return 'Please accept the subscription terms to continue.';
  }

  if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
    return 'Please provide your name and email address.';
  }

  if (!shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    return 'Please complete the shipping address.';
  }

  if (!effectivePlanId) {
    return 'Select a subscription plan before continuing.';
  }

  if (effectivePlan && !validateSellingPlanCompatibility(primaryItem.product, effectivePlan)) {
    return 'Selected plan is not compatible with this product.';
  }

  return null;
}

export function buildAddToCartFormData(item: CartItem, sellingPlanId: string): FormData {
  const formData = new FormData();
  formData.set('productId', item.productId);
  formData.set('sellingPlanId', sellingPlanId);
  formData.set('quantity', item.quantity.toString());

  if (item.variantId) {
    formData.set('variantId', item.variantId);
  }

  return formData;
}

export function buildCheckoutFormData(
  customerInfo: CustomerInfoState,
  shippingAddress: ShippingAddressState,
  origin: string,
): FormData {
  const checkoutForm = new FormData();
  checkoutForm.set('customerEmail', customerInfo.email);
  checkoutForm.set('customerName', `${customerInfo.firstName} ${customerInfo.lastName}`.trim());
  checkoutForm.set('shippingAddress', JSON.stringify({
    street: shippingAddress.addressLine1,
    city: shippingAddress.city,
    state: shippingAddress.state,
    zipCode: shippingAddress.postalCode,
    country: shippingAddress.country,
  }));
  checkoutForm.set('successUrl', `${origin}/checkout/subscription/success`);
  checkoutForm.set('cancelUrl', `${origin}/checkout/subscription`);
  return checkoutForm;
}

export const CHECKOUT_STARTED_EVENT = AnalyticsEventType.CHECKOUT_STARTED;
