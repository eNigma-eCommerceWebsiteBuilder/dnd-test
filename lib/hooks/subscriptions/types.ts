import type {
  BillingAttempt,
  DraftValidationResponse,
  SubscriptionContract,
  SubscriptionDetailsResponse,
  SubscriptionDraft,
  SubscriptionOrdersResponse,
  SubscriptionStatus,
} from '@/lib/api/types/subscriptions';
import type { Address } from '@/lib/api/types/orders';
import type { SellingPlan, SubscriptionPreview } from '@/lib/api/types/selling-plans';

export enum SubscriptionLifecycleActionCode {
  PAUSE = 'pause',
  RESUME = 'resume',
  CANCEL = 'cancel',
}

export interface UseSubscriptionsOptions {
  initialSubscriptions?: SubscriptionContract[];
  initialFilter?: SubscriptionStatus | null;
  disableFetch?: boolean;
}

export interface UseSubscriptionsReturn {
  subscriptions: SubscriptionContract[];
  filter: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  loadSubscriptions: (status?: SubscriptionStatus, page?: number, limit?: number) => Promise<void>;
  filterByStatus: (status: SubscriptionStatus | null) => void;
  refreshSubscriptions: () => Promise<void>;
  clearError: () => void;
}

export interface UseSubscriptionReturn {
  subscription: SubscriptionContract | null;
  upcomingBilling: SubscriptionDetailsResponse['upcomingBilling'] | null;
  loading: boolean;
  error: string | null;
  loadSubscription: (id: string) => Promise<void>;
  getOrders: (page?: number, limit?: number) => Promise<SubscriptionOrdersResponse>;
  skipNextDelivery: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  clearError: () => void;
}

export interface UseSubscriptionActionsReturn {
  actionInProgress: SubscriptionLifecycleActionCode | null;
  error: string | null;
  pauseSubscription: (id: string, reason?: string, resumeAt?: string) => Promise<void>;
  resumeSubscription: (id: string) => Promise<void>;
  cancelSubscription: (id: string, reason?: string, note?: string, immediate?: boolean) => Promise<void>;
  canPause: (subscription: SubscriptionContract) => boolean;
  canCancel: (subscription: SubscriptionContract) => boolean;
  clearError: () => void;
}

export interface UseSubscriptionBillingReturn {
  billingHistory: BillingAttempt[];
  updatingPayment: boolean;
  loading: boolean;
  error: string | null;
  loadBillingHistory: (subscriptionId: string, page?: number, limit?: number) => Promise<void>;
  updatePaymentMethod: (subscriptionId: string, paymentMethodId: string) => Promise<void>;
  openBillingPortal: (returnUrl?: string) => Promise<string>;
  clearError: () => void;
}

export interface UseSubscriptionDraftReturn {
  draft: SubscriptionDraft | null;
  validationState: DraftValidationResponse | null;
  saving: boolean;
  error: string | null;
  createDraft: (subscriptionId: string) => Promise<void>;
  addLine: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
  validateDraft: () => Promise<void>;
  commitDraft: () => Promise<void>;
  discardDraft: () => Promise<void>;
  clearError: () => void;
}

export interface UseSellingPlansReturn {
  sellingPlans: SellingPlan[];
  loading: boolean;
  error: string | null;
  loadPlans: (productId: string) => Promise<void>;
  getDiscountedPrice: (planId: string) => number;
  comparePlans: () => Array<{
    id: string;
    name: string;
    savings: number;
    savingsPercent: number;
  }>;
  clearError: () => void;
}

export interface UseSubscriptionPreviewReturn {
  preview: SubscriptionPreview | null;
  calculating: boolean;
  error: string | null;
  previewPricing: (productId: string, sellingPlanId: string, quantity: number, variantId?: string) => Promise<void>;
  getSavings: () => number;
  getFirstBillingAmount: () => number;
  clearError: () => void;
}

export interface UseSubscriptionCheckoutReturn {
  checkoutUrl: string | null;
  processing: boolean;
  error: string | null;
  createCheckout: (customerInfo: { email: string; name: string }, shippingAddress: Address, successUrl: string, cancelUrl: string) => Promise<string>;
  addSubscriptionToCart: (productId: string, sellingPlanId: string, quantity: number, variantId?: string) => Promise<void>;
  clearError: () => void;
}
