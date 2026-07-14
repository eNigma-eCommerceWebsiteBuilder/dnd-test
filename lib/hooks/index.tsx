'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  addToCart,
  clearCart as apiClearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from '@/lib/api/services/cart';
import type { Cart as ApiCart, CartItem as ApiCartItem } from '@/lib/api/types/cart';
import type { UserAddress } from '@/lib/api/types/auth';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

export interface ToastContextValue {
  success: (msg: string, opts?: ToastOptions) => void;
  error: (msg: string, opts?: ToastOptions) => void;
  info: (msg: string, opts?: ToastOptions) => void;
  removeToast: (id: string) => void;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ToastContainer() {
  return null;
}

export function useToast(): ToastContextValue {
  return {
    success: () => {},
    error: () => {},
    info: () => {},
    removeToast: () => {},
  };
}

export interface User {
  id: string;
  email?: string;
  name?: string;
}

export type AuthUser = User;

export interface UseAuthReturn {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuth(): UseAuthReturn {
  return { user: null, status: 'unauthenticated' };
}

export type CartItem = ApiCartItem & { _id?: string };
export type Cart = ApiCart;

export interface UseCartReturn {
  cart: Cart | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  isPending: boolean;
  error: string | null;
  addItem: (id: string, qty?: number, variantId?: string) => Promise<void>;
  updateItem: (id: string, qty: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemQuantity: (id: string) => number;
  isInCart: (id: string) => boolean;
}

const noopAsync = async () => {};

export function useCart(_autoLoad?: boolean): UseCartReturn {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(Boolean(_autoLoad));
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCart(await getCart());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (_autoLoad) {
      const timeout = window.setTimeout(() => {
        void loadCart();
      }, 0);

      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, [_autoLoad, loadCart]);

  const runCartMutation = useCallback(async (mutation: () => Promise<Cart>) => {
    setIsPending(true);
    setError(null);
    try {
      setCart(await mutation());
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Failed to update cart');
      throw mutationError;
    } finally {
      setIsPending(false);
    }
  }, []);

  const items = cart?.items || [];

  return {
    cart,
    items,
    totalItems: cart?.totalItems || 0,
    totalPrice: cart?.total ?? cart?.totalPrice ?? 0,
    loading,
    isPending,
    error,
    addItem: (id, qty = 1, variantId) => runCartMutation(() => addToCart(id, qty, variantId || null)),
    updateItem: (id, qty) => runCartMutation(() => updateCartItem(id, qty)),
    removeItem: (id) => runCartMutation(() => removeFromCart(id)),
    clearCart: () => runCartMutation(() => apiClearCart()),
    getItemQuantity: (id) => items.find((item) => item.productId === id || item.product?._id === id)?.quantity || 0,
    isInCart: (id) => items.some((item) => item.productId === id || item.product?._id === id),
  };
}

export interface UseWishlistReturn {
  items: string[];
  addItem: (id: string, variantId?: string) => Promise<void>;
  removeItem: (id: string, variantId?: string) => Promise<void>;
  isInWishlist: (id: string, variantId?: string) => boolean;
}

export function useWishlist(): UseWishlistReturn {
  return {
    items: [],
    addItem: noopAsync,
    removeItem: noopAsync,
    isInWishlist: () => false,
  };
}

export interface AddAddressData {
  label?: string;
  fullName?: string;
  name?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UseUserAddressesReturn {
  addresses: UserAddress[];
  defaultAddress: UserAddress | null;
  loading: boolean;
  error: string | null;
  addAddress: (address: AddAddressData) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  refreshAddresses: () => Promise<void>;
}

export function useUserAddresses(): UseUserAddressesReturn {
  return {
    addresses: [],
    defaultAddress: null,
    loading: false,
    error: null,
    addAddress: async () => {
      throw new Error('Address mutations require the production auth provider.');
    },
    deleteAddress: async () => {
      throw new Error('Address mutations require the production auth provider.');
    },
    refreshAddresses: noopAsync,
  };
}

export {
  useDigitalDownload,
  useDownloadStats,
  useLicenseInfo,
} from './digital-products';
export type {
  UseDigitalDownloadReturn,
  UseDownloadStatsReturn,
  UseLicenseInfoReturn,
} from './digital-products';

export {
  useSubscription,
  useSubscriptionActions,
  useSubscriptionBilling,
  useSubscriptions,
} from './subscriptions';
export type {
  UseSubscriptionActionsReturn,
  UseSubscriptionBillingReturn,
  UseSubscriptionReturn,
  UseSubscriptionsOptions,
  UseSubscriptionsReturn,
} from './subscriptions';
