import {
  OrderPaymentStatus,
  OrderStatus,
  type DigitalAsset,
  type Order,
} from '@/lib/api/types';

export const checkoutSuccessPreviewOrder: Order = {
  _id: 'checkout-success-preview-order',
  orderNumber: 'ORD-PREVIEW-1001',
  customerEmail: 'customer@example.com',
  customerName: 'Preview Customer',
  subtotal: 420,
  tax: 33.6,
  shipping: 0,
  total: 453.6,
  status: OrderStatus.PROCESSING,
  paymentStatus: OrderPaymentStatus.PAID,
  shippingAddress: {
    street: '123 Preview Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  items: [{
    _id: 'checkout-success-preview-item',
    productId: 'checkout-success-preview-product',
    quantity: 1,
    price: 420,
    subtotal: 420,
    product: {
      _id: 'checkout-success-preview-product',
      name: 'Preview Wool Scarf',
      images: [],
      price: 420,
    },
    productType: 'physical',
  }],
};

export const checkoutSuccessPreviewAssets: DigitalAsset[] = [{
  licenseKey: 'PREVIEW-LICENSE-KEY-1001',
  productId: 'checkout-success-preview-digital',
  productName: 'Preview Digital Lookbook',
  downloadUrl: '#',
  expiresAt: '2030-01-01T00:00:00.000Z',
  maxDownloads: 5,
  downloadCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
}];
