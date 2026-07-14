export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: (id: string) => `/products/${id}`,
  CATEGORIES: '/categories',
  CATEGORY: (id: string) => `/categories/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER: (id: string) => `/order/${id}`,
  LOGIN: '/auth',
  SIGNUP: '/auth?mode=register',
  ACCOUNT: '/account',
  ACCOUNT_SESSIONS: '/account/sessions',
  FORGOT_PASSWORD: '/auth',
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const TOAST = {
  DEFAULT_DURATION: 5000,
  POSITIONS: [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center',
  ] as const,
} as const;

export type ToastPosition = (typeof TOAST.POSITIONS)[number];
