import type {
  BillingPortalResponse,
  Cart as ApiCart,
  DigitalAssetsResponse,
  DraftValidationResponse,
  ExchangePaymentIntentResponse,
  ExchangeRequestResponse,
  MyReviewsResponse,
  Order as ApiOrder,
  OrderUpdateData,
  PaginatedOrders,
  PaymentStatus,
  ReturnRequest,
  ReturnStatus,
  ReviewHelpfulResponse,
  ReviewReportResponse,
  SubscriptionContract,
  SubscriptionDetailsResponse,
  SubscriptionDraft,
  SubscriptionOrdersResponse,
  SubscriptionsListResponse,
  Wishlist as ApiWishlist,
} from '@/lib/api/types';
import type { PaymentConfirmation, PaymentIntent } from './core';

export type Order = ApiOrder;

export interface OrderCreationActionData {
  order: ApiOrder;
  payment?: {
    paymentId: string;
    checkoutUrl?: string;
    sessionId?: string;
  };
}

export interface OrderUpdateActionData {
  orderId: string;
  updates: OrderUpdateData;
}

export interface ReviewEligibilityData {
  canReview: boolean;
  orderNumber: string;
  isPaid: boolean;
  productName: string;
}

export interface UploadedReviewImage {
  id: string;
  src: string;
  alt: string;
}

export interface WishlistMutationData {
  wishlist: ApiWishlist;
  itemCount: number;
  cart?: ApiCart;
}

export interface WishlistBulkItemError {
  productId: string;
  variantId?: string;
  error: string;
}

export interface WishlistBulkActionData {
  added: number;
  failed: number;
  errors: WishlistBulkItemError[];
}

export interface ReturnSummary {
  _id: string;
  requestNumber: string;
  orderId: {
    _id: string;
    orderNumber: string;
    orderStatus: string;
    totalAmount: number;
  };
  type: 'refund' | 'exchange';
  status: ReturnStatus;
  calculations: {
    totalRefundAmount: number;
  };
  createdAt: string;
}

export interface ReturnRequestActionData {
  returnRequest: ReturnRequest;
}

export interface ReturnLabelData {
  labelUrl: string;
}

export interface ReturnTrackingData {
  trackingNumber: string | null;
  carrier: string | null;
  status: string;
}

export interface ReturnAliasData {
  _id: string;
}

export interface SubscriptionBillingPortalData {
  portal: BillingPortalResponse;
}

export interface SubscriptionCheckoutData {
  checkoutUrl: string;
  sessionId: string;
}

export interface SubscriptionSkipDeliveryData {
  newBillingDate: string;
}

export interface SubscriptionListData {
  subscriptions: SubscriptionsListResponse;
}

export interface SubscriptionDetailsData {
  subscription: SubscriptionDetailsResponse;
}

export interface SubscriptionOrdersData {
  orders: SubscriptionOrdersResponse;
}

export interface SubscriptionDraftData {
  draft: SubscriptionDraft;
}

export interface SubscriptionDraftValidationData {
  validation: DraftValidationResponse;
}

export interface SubscriptionMutationData {
  subscription: SubscriptionContract;
}

export interface ReviewListData {
  reviews: MyReviewsResponse;
}

export interface ReviewVoteData {
  vote: ReviewHelpfulResponse;
}

export interface ReviewReportActionData {
  report: ReviewReportResponse;
}

export interface ExchangeActionData {
  exchange: ExchangeRequestResponse;
}

export interface ExchangePaymentActionData {
  payment: ExchangePaymentIntentResponse;
}

export interface PaymentStatusActionData {
  paymentStatus: PaymentStatus;
}

export interface PaymentIntentActionData {
  paymentIntent: PaymentIntent;
}

export interface PaymentConfirmationActionData {
  paymentConfirmation: PaymentConfirmation;
}

export interface OrderLookupData {
  order: ApiOrder;
}

export interface OrderHistoryData {
  orders: PaginatedOrders;
}

export interface DigitalAssetsActionData {
  digitalAssets: DigitalAssetsResponse;
}
