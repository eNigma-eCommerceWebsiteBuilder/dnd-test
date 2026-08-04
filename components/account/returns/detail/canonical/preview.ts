import {
  OrderPaymentStatus,
  OrderStatus,
  ReturnReasonCode,
  ReturnRequestStatus,
  ReturnRequestType,
  type ReturnRequest,
} from '@/lib/api/types';

// Editor-only fixture; published rendering always fetches the current return id.
export const returnDetailsPreview: ReturnRequest = {
  _id: 'puck-return-preview',
  requestNumber: 'RET-2048',
  orderId: {
    _id: 'puck-return-order', orderNumber: 'EN-2048', customerEmail: 'avery@example.com', customerName: 'Avery Morgan',
    items: [{ _id: 'puck-return-order-item', productId: 'puck-product', product: { _id: 'puck-product', name: 'Preview Wool Scarf', images: ['https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=800&q=80'] }, quantity: 1, price: 89, subtotal: 89 }],
    subtotal: 89, tax: 0, shipping: 0, total: 89, status: OrderStatus.PROCESSING, paymentStatus: OrderPaymentStatus.PAID,
    shippingAddress: { street: '100 Market Street', city: 'Karachi', state: 'Sindh', zipCode: '75500', country: 'Pakistan' },
    createdAt: '2026-07-01T00:00:00.000Z', updatedAt: '2026-07-01T00:00:00.000Z',
  },
  customerEmail: 'avery@example.com', customerName: 'Avery Morgan', type: ReturnRequestType.REFUND, status: ReturnRequestStatus.APPROVED,
  returnItems: [{ orderItemId: 'puck-return-order-item', productId: 'puck-product', quantity: 1, reason: ReturnReasonCode.DAMAGED, reasonDetails: 'Preview item arrived damaged.' }],
  reason: ReturnReasonCode.DAMAGED, reasonDetails: 'Preview item arrived damaged.', adminNotes: 'Your return has been approved and the label is ready.',
  calculations: { itemsRefundAmount: 89, shippingRefundAmount: 0, restockingFee: 0, totalRefundAmount: 89 },
  requestedAt: '2026-07-01T00:00:00.000Z', approvedAt: '2026-07-02T00:00:00.000Z', createdAt: '2026-07-01T00:00:00.000Z', updatedAt: '2026-07-02T00:00:00.000Z',
};
