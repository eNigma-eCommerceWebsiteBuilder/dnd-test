import type {
  Cart as ApiCart,
  ExchangeRequestResponse,
  ReturnRequest,
  SubscriptionContract,
  SubscriptionDraft,
  Wishlist as ApiWishlist,
} from '@/lib/api/types';
import type {
  ActionResult,
  Cart,
  PaymentConfirmation,
  PaymentIntent,
  Review,
} from './core';
import type {
  Order,
  OrderCreationActionData,
  ReturnAliasData,
  ReturnLabelData,
  ReturnTrackingData,
  ReviewEligibilityData,
  SubscriptionCheckoutData,
  UploadedReviewImage,
  WishlistBulkActionData,
  WishlistMutationData,
} from './data';

export interface CartActionResult extends ActionResult<Cart> {
  cart?: Cart;
}

export interface OrderActionResult extends ActionResult<Order | OrderCreationActionData> {
  order?: Order;
}

export type ExchangeActionResult = ActionResult<ExchangeRequestResponse>;
export type PaymentIntentResult = ActionResult<PaymentIntent>;
export type PaymentConfirmationResult = ActionResult<PaymentConfirmation>;

export interface ReviewActionResult extends ActionResult<Review> {
  review?: Review;
}

export interface ReviewEligibilityActionResult extends ActionResult<ReviewEligibilityData> {
  eligible?: boolean;
  order?: Order;
}

export interface UploadedImagesResult extends ActionResult<UploadedReviewImage[]> {
  images?: UploadedReviewImage[];
}

export interface ReturnActionResult extends ActionResult<
  ReturnRequest | ReturnLabelData | ReturnTrackingData | ReturnAliasData | ExchangeRequestResponse['data']['exchangeRequest']
> {
  return?: ReturnRequest | ExchangeRequestResponse['data']['exchangeRequest'];
  refundAmount?: number;
}

export interface SubscriptionActionResult extends ActionResult<SubscriptionContract> {
  subscription?: SubscriptionContract;
}

export interface SubscriptionDraftResult extends ActionResult<SubscriptionDraft> {
  draft?: SubscriptionDraft;
}

export interface SubscriptionCheckoutResult extends ActionResult<SubscriptionCheckoutData> {
  checkoutUrl?: string;
  sessionId?: string;
}

export interface WishlistActionResult extends ActionResult<WishlistMutationData | ApiWishlist> {
  wishlist?: ApiWishlist;
  cart?: ApiCart;
  itemCount?: number;
}

export interface WishlistBulkResult extends ActionResult<WishlistBulkActionData> {
  added?: number;
  failed?: number;
  errors?: Record<string, unknown>[];
}
