import {
  OrderStatus,
  OrderPaymentStatus,
  type Address,
  type Order,
  type OrderCreateData,
  type OrderCreationPayment,
  type OrderCreationResponse,
  type OrderItem,
  type PaginatedOrders,
} from '../../types';

type RawOrderItem = Omit<Partial<OrderItem>, 'product'> & {
  product?: OrderItem['product'] | string;
};

type RawOrder = Omit<Partial<Order>, 'items'> & {
  items?: RawOrderItem[];
};

const EMPTY_ADDRESS: Address = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
};

function normalizeOrderItem(item: RawOrderItem): OrderItem {
  const productId =
    item.productId ??
    (typeof item.product === 'string' ? item.product : item.product?._id ?? '');
  const image =
    item.image ??
    (typeof item.product === 'object' && item.product?.images?.[0]
      ? item.product.images[0]
      : undefined);
  const product =
    typeof item.product === 'object' && item.product
      ? item.product
      : productId
        ? {
            _id: productId,
            name: item.name ?? 'Product',
            images: image ? [image] : [],
            imageUrl: image,
            productType: item.productType,
          }
        : {
            _id: '',
            name: item.name ?? 'Product',
            images: image ? [image] : [],
            imageUrl: image,
            productType: item.productType,
          };

  return {
    _id: item._id,
    product,
    productId,
    variantId: item.variantId,
    variant: item.variant,
    quantity: item.quantity ?? 0,
    price: item.price ?? 0,
    subtotal: item.subtotal ?? (item.price ?? 0) * (item.quantity ?? 0),
    name: item.name,
    image,
    productType: item.productType,
    fulfillmentType: item.fulfillmentType,
    isFulfilled: item.isFulfilled,
    taxAmount: item.taxAmount,
    taxRate: item.taxRate,
    taxCategory: item.taxCategory,
    priceWithTax: item.priceWithTax,
    isDigital: item.isDigital,
  };
}

export function normalizeOrder(order: RawOrder): Order {
  const items = Array.isArray(order.items) ? order.items.map(normalizeOrderItem) : [];
  const subtotal =
    order.subtotal ??
    order.taxSummary?.subtotal ??
    items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax =
    order.tax ??
    order.taxSummary?.totalTax ??
    items.reduce((sum, item) => sum + (item.taxAmount ?? 0), 0);
  const total = order.total ?? order.totalPrice ?? subtotal + tax + (order.shipping ?? 0);
  const paymentStatus =
    order.paymentStatus ?? (order.isPaid ? OrderPaymentStatus.PAID : OrderPaymentStatus.UNPAID);

  return {
    _id: order._id ?? '',
    orderNumber: order.orderNumber ?? '',
    userId: order.userId,
    user: order.user,
    guestId: order.guestId,
    customerEmail: order.customerEmail ?? '',
    customerName: order.customerName ?? '',
    items,
    subtotal,
    tax,
    taxLines: order.taxLines,
    taxSummary: order.taxSummary,
    shipping: order.shipping ?? 0,
    total,
    totalPrice: order.totalPrice ?? total,
    status: order.status ?? OrderStatus.PENDING,
    paymentStatus,
    isPaid: order.isPaid ?? paymentStatus === OrderPaymentStatus.PAID,
    paymentMethod: order.paymentMethod,
    shippingAddress: order.shippingAddress ?? EMPTY_ADDRESS,
    billingAddress: order.billingAddress,
    trackingNumber: order.trackingNumber,
    phone: order.phone,
    notes: order.notes,
    exchangeRequest: order.exchangeRequest,
    websiteId: order.websiteId,
    websiteName: order.websiteName,
    ownerEmail: order.ownerEmail,
    createdAt: order.createdAt ?? '',
    updatedAt: order.updatedAt ?? order.createdAt ?? '',
    paidAt: order.paidAt,
    shippedAt: order.shippedAt,
    deliveredAt: order.deliveredAt,
  };
}

export function normalizePaginatedOrders(response: PaginatedOrders): PaginatedOrders {
  return {
    ...response,
    data: response.data.map(normalizeOrder),
  };
}

export function normalizeCreateOrderResponse(
  response: OrderCreationResponse,
): { order: Order; payment?: OrderCreationPayment } {
  return {
    order: normalizeOrder(response.data),
    payment: response.payment,
  };
}

export function normalizeOrderCreateData(orderData: OrderCreateData): OrderCreateData {
  if (!orderData.shippingAddress) {
    return orderData;
  }

  return {
    ...orderData,
    shippingAddress: {
      ...orderData.shippingAddress,
      phone: orderData.shippingAddress.phone ?? orderData.phone,
    },
  };
}
