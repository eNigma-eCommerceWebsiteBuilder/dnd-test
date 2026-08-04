import type { Order } from '@/lib/api/types/orders';
import type { CheckoutStep as CheckoutStepId } from '@/lib/utils/constants/commerce';

export interface CheckoutStep {
  id: CheckoutStepId;
  name: string;
  completed: boolean;
  current: boolean;
}

/**
 * Shipping address structure
 */
export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

/**
 * Shipping method option
 */
export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  carrier?: string;
}

/**
 * Order creation data
 */
export interface OrderData {
  shippingAddress: ShippingAddress;
  shippingMethodId: string;
  paymentMethodId?: string;
  email: string;
  notes?: string;
}

/**
 * Checkout state
 */
export interface CheckoutState {
  currentStep: number;
  steps: CheckoutStep[];
  shippingAddress: ShippingAddress | null;
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: ShippingMethod | null;
  orderData: Partial<OrderData>;
}

export interface UseCheckoutReturn {
  currentStep: number;
  currentStepId: CheckoutStepId;
  steps: CheckoutStep[];
  shippingAddress: ShippingAddress | null;
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: ShippingMethod | null;
  orderData: Partial<OrderData>;
  orderId: string | null;
  loading: boolean;
  error: string | null;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepId: string) => void;
  setShippingAddress: (address: ShippingAddress) => Promise<boolean>;
  selectShippingMethod: (method: ShippingMethod) => void;
  setEmail: (email: string) => void;
  setNotes: (notes: string) => void;
  completeCheckout: (paymentMethodId?: string) => Promise<Order>;
  reset: () => void;
  clearError: () => void;
}
