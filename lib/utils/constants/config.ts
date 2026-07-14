import { API_BASE_URL, DEFAULT_TIMEOUT, WEBSITE_ID } from '@/lib/api/core/config';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  WEBSITE_ID,
  TIMEOUT: DEFAULT_TIMEOUT,
} as const;

export const FEATURES = {
  AUTH_ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED !== 'false',
  REVIEWS_ENABLED: process.env.NEXT_PUBLIC_REVIEWS_ENABLED !== 'false',
  WISHLIST_ENABLED: process.env.NEXT_PUBLIC_WISHLIST_ENABLED === 'true',
} as const;

export const CACHE = {
  PRODUCTS: 30,
  PRODUCT_DETAIL: 60,
  CATEGORIES: 300,
  TESTIMONIALS: 300,
  MENU: 300,
  PROMOTIONS: 60,
} as const;

export const STORAGE_KEYS = {
  CART: 'enigma-cart',
  RECENTLY_VIEWED: 'enigma-recently-viewed',
  WISHLIST: 'enigma-wishlist',
  THEME: 'enigma-theme',
} as const;
