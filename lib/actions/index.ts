/**
 * Actions Index
 * Re-exports all server actions for convenient importing
 * 
 * Usage:
 *   import { addToCartAction, updateProfileAction, createOrderAction } from '@/lib/actions';
 */

// Export types
export type * from './types';

// Cart Actions
export {
    addToCartAction,
    updateCartItemAction,
    removeFromCartAction,
    clearCartAction,
    captureCartEmailAction,
    estimateCartTaxAction,
} from './cart-actions';

// Auth Actions
export {
    getProfileAction,
    // Profile management
    updateProfileAction,
    // Address management
    addAddressAction,
    deleteAddressAction,
} from './auth-actions';

// Order Actions
export {
    getOrderAction,
    getMyOrdersAction,
    getOrderDigitalAssetsAction,
    createOrderAction,
    cancelOrderAction,
    requestExchangeAction as requestOrderExchangeAction,
    createExchangePaymentAction,
    // Order update (missed routes)
    updateOrderAction,
} from './order-actions';

// Payment Actions
export {
    getPaymentStatusAction,
    createPaymentIntentAction,
    confirmPaymentAction,
    requestRefundAction,
} from './payment-actions';

// Review Actions
export {
    uploadReviewImagesAction,
    validateReviewEligibilityAction,
    createReviewAction,
    // Standalone reviews (missed routes)
    createStandaloneReviewAction,
    uploadProductReviewImagesAction,
} from './review-actions';

// Content & Tracking Actions
export {
    trackEventAction,
    trackBatchEventsAction,
    revalidateCollectionsAction,
    revalidatePromotionsAction,
    revalidateTestimonialsAction,
    revalidateMenuAction,
    revalidateAllContentAction,
} from './content-tracking-actions';

// Wishlist Actions
export {
    getWishlistAction,
    addToWishlistAction,
    removeFromWishlistAction,
    clearWishlistAction,
    toggleWishlistNotificationAction,
    moveWishlistToCartAction,
    bulkAddToWishlistAction,
    bulkRemoveFromWishlistAction,
    moveAllWishlistToCartAction,
    generateWishlistShareLinkAction,
    viewSharedWishlistAction,
    checkWishlistItemAction,
    getWishlistCountAction,
} from './wishlist-actions';

// Returns Actions
export {
    getMyReturnsAction,
    getReturnDetailsAction,
    requestReturnAction,
    requestExchangeAction,
    cancelReturnAction,
    uploadReturnLabelAction,
    trackReturnShipmentAction,
    // Alias return route (missed routes)
    requestReturnOnOrderRouteAction,
} from './returns-actions';

// Subscription Actions
export {
    getMySubscriptionsAction,
    getSubscriptionDetailsAction,
    getSubscriptionOrdersAction,
    getBillingHistoryAction,
    getBillingPortalAction,
    validateSubscriptionDraftAction,
    pauseSubscriptionAction,
    resumeSubscriptionAction,
    cancelSubscriptionAction,
    skipNextDeliveryAction,
    updateSubscriptionPaymentAction,
    createSubscriptionDraftAction,
    addDraftLineAction,
    updateDraftLineAction,
    removeDraftLineAction,
    updateDraftAddressAction,
    commitDraftAction,
    discardDraftAction,
} from './subscription-actions';

// Subscription Checkout Actions
export {
    addSubscriptionToCartAction,
    createSubscriptionCheckoutAction,
} from './subscription-checkout-actions';

// Digital Products Actions
export {
    validateLicenseAction,
    downloadDigitalProductAction,
    checkMultipleLicensesAction,
} from './digital-products-actions';

// Export digital products action types
export type {
    LicenseValidationResult,
    DownloadActionResult,
} from './digital-products-actions';

