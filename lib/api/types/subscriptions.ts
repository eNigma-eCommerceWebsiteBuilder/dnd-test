import type { Address } from './orders';
import type { Product, ProductVariant } from './products';

export enum SubscriptionStatusCode {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export type SubscriptionStatus = `${SubscriptionStatusCode}`;

export enum SubscriptionBillingIntervalCode {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export type BillingInterval = `${SubscriptionBillingIntervalCode}`;

export enum PricingAdjustmentTypeCode {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
}

export enum BillingAttemptStatusCode {
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  PENDING = 'pending',
}

export enum SubscriptionDraftStatusCode {
  OPEN = 'open',
  APPLIED = 'applied',
  DISCARDED = 'discarded',
}

export enum SubscriptionDraftActionCode {
  ADD = 'add',
  UPDATE = 'update',
  REMOVE = 'remove',
}

export type SubscriptionDraftAction = `${SubscriptionDraftActionCode}`;

export interface BillingPolicy {
  interval: BillingInterval;
  intervalCount: number;
  minCycles?: number;
  maxCycles?: number;
}

export interface PricingPolicy {
  adjustmentType: `${PricingAdjustmentTypeCode}`;
  adjustmentValue: number;
}

export interface SubscriptionLine {
  _id: string;
  productId: Product | string;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  originalPrice: number;
}

export interface BillingAttempt {
  _id: string;
  status: `${BillingAttemptStatusCode}`;
  amount: number;
  totalAmount: number;
  billingCycle: number;
  errorMessage?: string;
  processedAt: string;
}

export interface SubscriptionContract {
  _id: string;
  contractNumber: string;
  status: SubscriptionStatus;
  user: string;
  lines: SubscriptionLine[];
  sellingPlanId: string | unknown;
  billingPolicy: BillingPolicy;
  deliveryPolicy?: BillingPolicy;
  nextBillingDate: string;
  nextDeliveryDate?: string;
  billingCycleCount: number;
  totalPrice: number;
  shippingAddress: Address;
  billingAddress?: Address;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  pausedAt?: string;
  resumeAt?: string;
  cancelledAt?: string;
  cancelAtPeriodEnd?: boolean;
  endDate?: string;
  cancellationReason?: string;
  cancellationNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionDraftLineChange {
  action: SubscriptionDraftAction;
  lineId?: string;
  productId?: string;
  variantId?: string;
  quantity?: number;
}

export interface SubscriptionDraftStockIssue {
  productId: string;
  available: number;
  requested: number;
}

export interface SubscriptionDraftFinancialImpact {
  oldTotal: number;
  newTotal: number;
  change: number;
}

export interface SubscriptionDraft {
  _id: string;
  contractId: string | SubscriptionContract;
  status: `${SubscriptionDraftStatusCode}`;
  changes: {
    lines?: SubscriptionDraftLineChange[];
    shippingAddress?: Address;
  };
  isValidated: boolean;
  validationErrors?: string[];
  stockIssues?: SubscriptionDraftStockIssue[];
  financialImpact?: SubscriptionDraftFinancialImpact;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionsListResponse {
  subscriptions: SubscriptionContract[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SubscriptionDetailsResponse {
  subscription: SubscriptionContract;
  upcomingBilling: {
    nextDate: string;
    amount: number;
    daysUntil: number;
  };
  hasPendingModification: boolean;
}

export interface SubscriptionOrdersResponse {
  orders: Array<{
    _id: string;
    orderNumber: string;
    totalPrice: number;
    status: string;
    isPaid: boolean;
    subscriptionCycle: number;
    createdAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BillingHistoryResponse {
  billingHistory: BillingAttempt[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BillingPortalResponse {
  url: string;
}

export interface DraftValidationResponse {
  isValid: boolean;
  validationErrors: string[];
  stockIssues: SubscriptionDraftStockIssue[];
  financialImpact: SubscriptionDraftFinancialImpact;
}

export interface SubscriptionResponse {
  message: string;
  subscription: SubscriptionContract;
}

export interface PauseSubscriptionRequest {
  reason?: string;
  resumeAt?: string;
}

export interface CancelSubscriptionRequest {
  reason?: string;
  note?: string;
  immediate?: boolean;
}

export interface UpdatePaymentMethodRequest {
  paymentMethodId: string;
}

export interface DraftUpdateRequest {
  action?: SubscriptionDraftAction;
  lineId?: string;
  productId?: string;
  variantId?: string;
  quantity?: number;
  shippingAddress?: Address;
}
