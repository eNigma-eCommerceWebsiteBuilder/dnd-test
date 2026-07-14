import type { Product, ProductVariant } from './products';

export interface CartItem {
  product: Product;
  productId: string;
  variantId?: string;
  variant?: ProductVariant;
  productSnapshot?: {
    name?: string;
    image?: string;
    sku?: string;
    color?: string | null;
    size?: string | null;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  _id: string;
  id?: string;
  items: CartItem[];
  totalItems: number;
  subtotal?: number;
  totalPrice?: number;
  tax?: number;
  taxLines?: TaxLine[];
  total?: number;
  customerEmail?: string;
  userId?: string;
  sessionId?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxLine {
  title: string;
  rate: number;
  amount: number;
}

export interface TaxEstimate {
  totalTax: number;
  taxableAmount: number;
  combinedRate: number;
  taxEnabled: boolean;
  taxLines: TaxLine[];
  cartTotal: number;
  totalWithTax: number;
}

export interface TaxEstimateSimple {
  estimatedTax: number;
  taxEnabled: boolean;
  message: string;
}

export interface Location {
  country: string;
  state?: string;
  city?: string;
}
