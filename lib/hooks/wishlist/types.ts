import type {
  WishlistNotificationType,
  Wishlist,
  WishlistItem,
} from '@/lib/api/types/wishlist';
import type { WishlistActionResult, WishlistBulkResult } from '@/lib/actions/types';

export interface UseWishlistReturn {
  wishlist: Wishlist | null;
  items: WishlistItem[];
  totalItems: number;
  loading: boolean;
  error: string | null;
  loadWishlist: () => Promise<void>;
  addItem: (productId: string, variantId?: string) => Promise<void>;
  removeItem: (productId: string, variantId?: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  getItemCount: () => number;
  isInWishlist: (productId: string, variantId?: string) => boolean;
  clearError: () => void;
}

export interface UseWishlistItemReturn {
  loading: boolean;
  error: string | null;
  toggleNotification: (productId: string, type: WishlistNotificationType, variantId?: string) => Promise<WishlistActionResult>;
  moveToCart: (productId: string, variantId?: string, quantity?: number) => Promise<WishlistActionResult>;
  checkProductStatus: (productId: string, variantId?: string) => Promise<boolean>;
}

export interface BulkOperationResult {
  added?: number;
  failed?: number;
  errors?: Record<string, unknown>[];
  message?: string;
}

export interface UseWishlistBulkReturn {
  processing: boolean;
  results: BulkOperationResult | null;
  error: string | null;
  addBulk: (items: Array<{ productId: string; variantId?: string }>) => Promise<WishlistBulkResult>;
  removeBulk: (items: Array<{ productId: string; variantId?: string }>) => Promise<WishlistBulkResult>;
  moveAllToCart: () => Promise<WishlistBulkResult>;
  clearResults: () => void;
}

export interface UseWishlistShareReturn {
  shareUrl: string | null;
  generating: boolean;
  error: string | null;
  generateShareLink: () => Promise<string>;
  viewSharedWishlist: (shareToken: string) => Promise<Wishlist>;
  clearError: () => void;
}

export interface NotificationSettings {
  notifyOnPriceDrop: boolean;
  notifyOnBackInStock: boolean;
}

export interface UseWishlistNotificationsReturn {
  notifications: Map<string, NotificationSettings>;
  loading: boolean;
  error: string | null;
  enablePriceDropAlert: (productId: string, variantId?: string) => Promise<void>;
  enableStockAlert: (productId: string, variantId?: string) => Promise<void>;
  disableNotifications: (productId: string, variantId?: string) => Promise<void>;
  getNotificationSettings: (productId: string, variantId?: string) => NotificationSettings | null;
  refreshNotifications: () => void;
}
