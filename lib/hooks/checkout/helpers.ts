import { PaymentMethodId } from '@/lib/api/types/payments';
import type { Address, Order, OrderCreateData } from '@/lib/api/types/orders';
import {
  CheckoutStepCode,
  type CheckoutStep as CheckoutStepId,
} from '@/lib/utils/constants/commerce';
import { CHECKOUT_PAYMENT_METHOD_MAP, DEFAULT_SHIPPING_METHODS } from './constants';
import type {
  CheckoutState,
  CheckoutStep,
  OrderData,
  ShippingAddress,
  ShippingMethod,
} from './types';

export function buildCheckoutSteps(currentStep: number): CheckoutStep[] {
  return Object.values(CheckoutStepCode).map((id, index) => ({
    id,
    name: getCheckoutStepName(id),
    completed: index < currentStep,
    current: index === currentStep,
  }));
}

function getCheckoutStepName(stepId: CheckoutStepId): string {
  switch (stepId) {
    case CheckoutStepCode.CART:
      return 'Cart Review';
    case CheckoutStepCode.SHIPPING:
      return 'Shipping Info';
    case CheckoutStepCode.PAYMENT:
      return 'Payment';
    case CheckoutStepCode.REVIEW:
      return 'Review Order';
    case CheckoutStepCode.CONFIRMATION:
      return 'Confirmation';
  }

  return 'Checkout';
}

export function createCheckoutStatePatch(currentStep: number): Pick<CheckoutState, 'currentStep' | 'steps'> {
  return {
    currentStep,
    steps: buildCheckoutSteps(currentStep),
  };
}

export function isValidShippingAddress(address: ShippingAddress): boolean {
  return Boolean(
    address.fullName &&
      address.addressLine1 &&
      address.city &&
      address.state &&
      address.postalCode &&
      address.country,
  );
}

export function mapShippingAddressToOrderAddress(address: ShippingAddress): Address {
  return {
    street: [
      address.addressLine1,
      address.addressLine2?.trim() || null,
    ].filter(Boolean).join(', '),
    city: address.city,
    state: address.state,
    zipCode: address.postalCode,
    country: address.country,
    phone: address.phone,
  };
}

export function getAvailableShippingMethods(): ShippingMethod[] {
  return DEFAULT_SHIPPING_METHODS;
}

export function normalizePaymentMethod(paymentMethodId?: string): PaymentMethodId {
  if (!paymentMethodId) {
    return PaymentMethodId.STRIPE;
  }

  if (Object.values(PaymentMethodId).includes(paymentMethodId as PaymentMethodId)) {
    return paymentMethodId as PaymentMethodId;
  }

  return CHECKOUT_PAYMENT_METHOD_MAP[paymentMethodId] ?? PaymentMethodId.STRIPE;
}

export function buildOrderPayload(
  orderData: OrderData,
  paymentMethodId?: string,
): OrderCreateData {
  return {
    customerEmail: orderData.email,
    customerName: orderData.shippingAddress.fullName,
    shippingAddress: mapShippingAddressToOrderAddress(orderData.shippingAddress),
    paymentMethod: normalizePaymentMethod(paymentMethodId),
    notes: orderData.notes,
  };
}

export function isCompleteOrderData(orderData: Partial<OrderData>): orderData is OrderData {
  return Boolean(
    orderData.shippingAddress &&
      orderData.shippingMethodId &&
      orderData.email,
  );
}

export function getCurrentStepId(state: CheckoutState): CheckoutStepId {
  return state.steps[state.currentStep]?.id ?? CheckoutStepCode.CART;
}

export function getCompletedCheckoutState(order: Order, state: CheckoutState): CheckoutState {
  void order;

  return {
    ...state,
    ...createCheckoutStatePatch(state.steps.length - 1),
  };
}
