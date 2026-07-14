import type { TaxLine } from './cart';
import type { Product, ProductVariant } from './products';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUND_REQUESTED = 'refund-requested',
  EXCHANGE_REQUESTED = 'exchange-requested',
}

export type OrderStatusValue = `${OrderStatus}`;

export enum OrderPaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum ExchangeRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum ExchangePaymentStatus {
  NONE = 'none',
  NOT_REQUIRED = 'not_required',
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface OrderProductSnapshot {
  _id: string;
  name: string;
  images: string[];
  imageUrl?: string;
  slug?: string;
  price?: number;
  productType?: 'physical' | 'digital';
}

export interface OrderItem {
  _id?: string;
  product: Product | OrderProductSnapshot;
  productId: string;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  subtotal: number;
  name?: string;
  image?: string;
  productType?: 'physical' | 'digital';
  fulfillmentType?: string;
  isFulfilled?: boolean;
  taxAmount?: number;
  taxRate?: number;
  taxCategory?: string;
  priceWithTax?: number;
  isDigital?: boolean;
}

export interface ExchangeItem {
  productId: string;
  variantId?: string;
  quantity: number;
  reason?: string;
}

export interface ExchangeRequest {
  _id: string;
  status: ExchangeRequestStatus;
  itemsReturned: ExchangeItem[];
  itemsRequested: ExchangeItem[];
  priceDifference: number;
  paymentStatus: ExchangePaymentStatus;
  requestedAt: string;
  processedAt?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  user?: string | null;
  guestId?: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  taxLines?: TaxLine[];
  taxSummary?: {
    subtotal: number;
    taxableAmount?: number;
    totalTax: number;
    shippingTax?: number;
    taxRate?: number;
    taxIncluded?: boolean;
  };
  shipping: number;
  total: number;
  totalPrice?: number;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  isPaid?: boolean;
  paymentMethod?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  trackingNumber?: string;
  phone?: string;
  notes?: string;
  exchangeRequest?: ExchangeRequest;
  websiteId?: string;
  websiteName?: string;
  ownerEmail?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderCreationPayment {
  paymentId: string;
  checkoutUrl?: string;
  sessionId?: string;
  clientSecret?: string;
  providerPaymentId?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  status?: string;
  approvalUrl?: string | null;
}

export interface OrderCreationResponse {
  success: boolean;
  data: Order;
  payment?: OrderCreationPayment;
}

export interface PaginatedOrders {
  success: boolean;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DigitalAsset {
  licenseKey: string;
  productId: string;
  productName: string;
  downloadUrl: string;
  expiresAt: string;
  maxDownloads: number;
  downloadCount: number;
  createdAt: string;
}

export interface DigitalAssetsResponse {
  orderNumber: string;
  isPaid: boolean;
  hasDigitalItems: boolean;
  message?: string;
  assets?: DigitalAsset[];
}

export interface ExchangeRequestResponse {
  success: boolean;
  message?: string;
  data: {
    orderId?: string;
    orderNumber?: string;
    priceDifference?: number;
    exchangeRequest: ExchangeRequest;
  };
}

export interface ExchangePaymentIntentResponse {
  success: boolean;
  data: {
    paymentId: string;
    clientSecret: string;
    providerPaymentId?: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
    status?: string;
    approvalUrl?: string | null;
  };
}

export interface OrderCreateData {
  customerEmail: string;
  customerName: string;
  phone?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethod: string;
  vatId?: string;
  notes?: string;
}

export interface ExchangeRequestData {
  itemsReturned: ExchangeItem[];
  itemsRequested: ExchangeItem[];
  email?: string;
  reason?: string;
}

export interface ExchangePaymentIntentRequest {
  paymentMethod: string;
  billingAddress: {
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  email: string;
}

export interface OrderUpdateData {
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
}
