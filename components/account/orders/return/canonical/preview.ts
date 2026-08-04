import { OrderPaymentStatus, OrderStatus, type Order } from '@/lib/api/types';
import { buildOrderReturnPageData } from '@/enigma-components/returns/order-return-canonical/orderReturnRuntime';

const previewOrder: Order = {
  _id: 'puck-order-return-preview', orderNumber: 'EN-2048', customerEmail: 'avery@example.com', customerName: 'Avery Morgan',
  items: [{ _id: 'puck-order-return-item', productId: 'puck-product', product: { _id: 'puck-product', name: 'Preview Wool Scarf', images: ['https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=800&q=80'] }, quantity: 1, price: 89, subtotal: 89 }],
  subtotal: 89, tax: 0, shipping: 0, total: 89, status: OrderStatus.DELIVERED, paymentStatus: OrderPaymentStatus.PAID,
  shippingAddress: { street: '100 Market Street', city: 'Karachi', state: 'Sindh', zipCode: '75500', country: 'Pakistan' },
  createdAt: '2026-07-20T00:00:00.000Z', updatedAt: '2026-07-20T00:00:00.000Z', deliveredAt: '2026-07-20T00:00:00.000Z',
};

export const orderReturnPreview = buildOrderReturnPageData(previewOrder);
