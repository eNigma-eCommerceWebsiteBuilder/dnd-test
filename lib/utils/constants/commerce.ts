import { PaymentMethodId } from '@/lib/api/types/payments';
import { ProductReviewSort, ProductSort } from '@/lib/api/types/products';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 48,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48] as const,
} as const;

export const SORT_OPTIONS = [
  { value: ProductSort.NEW, label: 'Newest' },
  { value: ProductSort.TRENDING, label: 'Trending' },
  { value: ProductSort.PRICE_ASC, label: 'Price: Low to High' },
  { value: ProductSort.PRICE_DESC, label: 'Price: High to Low' },
  { value: ProductSort.RATING, label: 'Top Rated' },
] as const;

export type SortOption = `${ProductSort}`;

export const REVIEW_SORT_OPTIONS = [
  { value: ProductReviewSort.RECENT, label: 'Most Recent' },
  { value: ProductReviewSort.RATING_DESC, label: 'Highest Rated' },
  { value: ProductReviewSort.RATING_ASC, label: 'Lowest Rated' },
] as const;

export type ReviewSortOption = `${ProductReviewSort}`;

export const PAYMENT_METHODS = [
  { value: PaymentMethodId.CASH_ON_DELIVERY, label: 'Cash on Delivery' },
  { value: PaymentMethodId.STRIPE, label: 'Credit/Debit Card' },
  { value: PaymentMethodId.PAYPAL, label: 'PayPal' },
] as const;

export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 5,
} as const;

export const IMAGE = {
  PLACEHOLDER: '/placeholder.jpg',
  PRODUCT_PLACEHOLDER: '/product-placeholder.jpg',
  AVATAR_PLACEHOLDER: '/avatar-placeholder.jpg',
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  MAX_SIZE: 5 * 1024 * 1024,
  MAX_REVIEW_IMAGES: 5,
} as const;

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  REVIEW_MIN_LENGTH: 10,
} as const;

export const TAX = {
  ENABLED: true,
  INCLUDE_IN_PRICE: false,
  DISPLAY_PRECISION: 2,
} as const;

export const CART_LIMITS = {
  MAX_QUANTITY_PER_ITEM: 999,
  MAX_ITEMS: 100,
  MIN_CHECKOUT_AMOUNT: 0.5,
} as const;

export enum CheckoutStepCode {
  CART = 'cart',
  SHIPPING = 'shipping',
  PAYMENT = 'payment',
  REVIEW = 'review',
  CONFIRMATION = 'confirmation',
}

export type CheckoutStep = `${CheckoutStepCode}`;
export const CHECKOUT_STEPS = CheckoutStepCode;

export const RETURNS = {
  WINDOW_DAYS: 30,
  EXCHANGE_WINDOW_DAYS: 30,
  REFUND_PROCESSING_DAYS: '5-7' as const,
} as const;

export const DIGITAL_PRODUCTS = {
  MAX_DOWNLOADS: 5,
  DOWNLOAD_EXPIRY_DAYS: 365,
  DOWNLOAD_LINK_EXPIRY_HOURS: 24,
} as const;

export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_MS: 300,
  MAX_RESULTS: 10,
  RECENT_SEARCHES_LIMIT: 5,
} as const;

export const PRODUCT_LIMITS = {
  MAX_IMAGES: 10,
  MAX_VARIANTS: 50,
  LOW_STOCK_THRESHOLD: 5,
  OUT_OF_STOCK_THRESHOLD: 0,
} as const;
