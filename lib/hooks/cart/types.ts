export type {
  Cart,
  CartItem,
  TaxEstimateSimple,
  TaxLine,
  Location,
} from '@/lib/api/types/cart';

import type { Cart, CartItem, Location } from '@/lib/api/types/cart';

export type TaxLocation = Location;

export interface UseCartReturn {
  cart: Cart | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  isPending: boolean;
  error: string | null;
  addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  captureEmail: (email: string) => Promise<void>;
  estimateTax: (location: TaxLocation) => Promise<void>;
  refreshCart: () => Promise<void>;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  clearError: () => void;
}
