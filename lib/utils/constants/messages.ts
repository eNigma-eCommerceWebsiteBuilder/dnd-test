export const ERROR_MESSAGES = {
  CART_EMPTY: 'Your cart is empty',
  CART_LOAD_FAILED: 'Failed to load cart',
  ADD_TO_CART_FAILED: 'Failed to add item to cart',
  UPDATE_CART_FAILED: 'Failed to update cart',
  REMOVE_FROM_CART_FAILED: 'Failed to remove item',
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_OUT_OF_STOCK: 'Product is out of stock',
  INSUFFICIENT_STOCK: 'Insufficient stock available',
  ORDER_NOT_FOUND: 'Order not found',
  ORDER_CREATE_FAILED: 'Failed to create order',
  ORDER_CANCEL_FAILED: 'Failed to cancel order',
  CANNOT_CANCEL_ORDER: 'This order cannot be cancelled',
  PAYMENT_FAILED: 'Payment failed',
  PAYMENT_CANCELLED: 'Payment was cancelled',
  PAYMENT_DECLINED: 'Payment was declined',
  INVALID_PAYMENT_METHOD: 'Invalid payment method',
  LOGIN_REQUIRED: 'Please log in to continue',
  SESSION_EXPIRED: 'Your session has expired',
  UNAUTHORIZED: 'Unauthorized access',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];

export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: 'Added to cart',
  CART_UPDATED: 'Cart updated',
  ITEM_REMOVED: 'Item removed from cart',
  ORDER_PLACED: 'Order placed successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  PAYMENT_SUCCESS: 'Payment completed successfully',
  REVIEW_SUBMITTED: 'Review submitted successfully',
} as const;

export type SuccessMessage = (typeof SUCCESS_MESSAGES)[keyof typeof SUCCESS_MESSAGES];
