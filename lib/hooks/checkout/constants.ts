import { PaymentMethodId } from '@/lib/api/types/payments';
import {
  CheckoutStepCode,
  type CheckoutStep as CheckoutStepId,
} from '@/lib/utils/constants/commerce';
import type { CheckoutState, CheckoutStep, ShippingMethod } from './types';

export enum ShippingMethodCode {
  STANDARD = 'standard',
  EXPRESS = 'express',
}

export enum CheckoutPaymentMethodCode {
  CARD = 'card',
  PAYPAL = 'paypal',
}

const CHECKOUT_STEP_LABELS: Record<CheckoutStepId, string> = {
  [CheckoutStepCode.CART]: 'Cart Review',
  [CheckoutStepCode.SHIPPING]: 'Shipping Info',
  [CheckoutStepCode.PAYMENT]: 'Payment',
  [CheckoutStepCode.REVIEW]: 'Review Order',
  [CheckoutStepCode.CONFIRMATION]: 'Confirmation',
};

export const DEFAULT_STEPS: CheckoutStep[] = Object.values(CheckoutStepCode).map(
  (stepId, index) => ({
    id: stepId,
    name: CHECKOUT_STEP_LABELS[stepId],
    completed: false,
    current: index === 0,
  }),
);

export const DEFAULT_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: ShippingMethodCode.STANDARD,
    name: 'Standard Shipping',
    price: 5.99,
    estimatedDays: '5-7 business days',
  },
  {
    id: ShippingMethodCode.EXPRESS,
    name: 'Express Shipping',
    price: 14.99,
    estimatedDays: '2-3 business days',
  },
];

export const INITIAL_CHECKOUT_STATE: CheckoutState = {
  currentStep: 0,
  steps: DEFAULT_STEPS,
  shippingAddress: null,
  shippingMethods: [],
  selectedShippingMethod: null,
  orderData: {},
};

export const CHECKOUT_PAYMENT_METHOD_MAP: Record<string, PaymentMethodId> = {
  [CheckoutPaymentMethodCode.CARD]: PaymentMethodId.STRIPE,
  [CheckoutPaymentMethodCode.PAYPAL]: PaymentMethodId.PAYPAL,
};
