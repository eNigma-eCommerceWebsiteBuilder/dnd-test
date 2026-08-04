import {
  OrderPaymentStatus,
  OrderStatus,
  type Order,
} from '@/lib/api/types';

// Editor-only data keeps the real source hierarchy visible without persisting a backend response.
export const orderDetailsPreview: Order = {
  _id: 'puck-order-preview',
  orderNumber: 'EN-2048',
  customerEmail: 'avery@example.com',
  customerName: 'Avery Morgan',
  items: [{
    _id: 'puck-order-preview-item',
    productId: 'puck-product-preview',
    product: {
      _id: 'puck-product-preview',
      name: 'Preview Wool Scarf',
      images: ['https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=800&q=80'],
    },
    quantity: 1,
    price: 89,
    subtotal: 89,
    isDigital: true,
  }],
  subtotal: 89,
  tax: 0,
  shipping: 0,
  total: 89,
  status: OrderStatus.PROCESSING,
  paymentStatus: OrderPaymentStatus.PAID,
  paymentMethod: 'card',
  shippingAddress: {
    street: '100 Market Street',
    city: 'Karachi',
    state: 'Sindh',
    zipCode: '75500',
    country: 'Pakistan',
    phone: '+92 300 555 0100',
  },
  billingAddress: {
    street: '100 Market Street',
    city: 'Karachi',
    state: 'Sindh',
    zipCode: '75500',
    country: 'Pakistan',
  },
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};
