'use client';

import { ReactNode } from 'react';
import type { UserAddress } from '@/lib/api/types/auth';
import { ReturnRequestStatus, type ReturnStatus } from '@/lib/api/types/returns';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  title?: string;
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

const noopAsync = async () => {};
export { useCart } from './cart/useCart';
export type { Cart, CartItem, TaxLocation, UseCartReturn } from './cart/types';

export {
  useCheckout,
  type CheckoutStep,
  type ShippingAddress,
  type ShippingMethod,
  type OrderData,
  type CheckoutState,
  type UseCheckoutReturn,
  DEFAULT_STEPS,
} from './checkout';

export {
  useWishlist,
  useWishlistBulk,
  useWishlistItem,
  useWishlistNotifications,
  useWishlistShare,
  type BulkOperationResult,
  type NotificationSettings,
  type UseWishlistBulkReturn,
  type UseWishlistItemReturn,
  type UseWishlistNotificationsReturn,
  type UseWishlistReturn,
  type UseWishlistShareReturn,
} from './wishlist';

// The copied production cancel button only consumes this source predicate.
export function useReturnActions(): { canCancel: (status: ReturnStatus) => boolean } {
  return {
    canCancel: (status) => (
      status === ReturnRequestStatus.PENDING || status === ReturnRequestStatus.APPROVED
    ),
  };
}

// The returns filter and pagination use the production action-backed list hook.
export { useReturns } from './returns/useReturns';
export type { UseReturnsReturn } from './returns/types';

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
  useSellingPlans,
  useSubscriptionPreview,
} from './subscriptions';
export type {
  UseSubscriptionActionsReturn,
  UseSubscriptionBillingReturn,
  UseSubscriptionReturn,
  UseSubscriptionsOptions,
  UseSubscriptionsReturn,
} from './subscriptions';
