import type { Cart, CartItem } from '@/lib/api/types/cart';

type PricedCartItem = Pick<CartItem, 'productId' | 'price' | 'quantity'> & {
  salePrice?: number;
  product?: Pick<CartItem['product'], 'price'>;
};

export function calculateCartSubtotal(items: PricedCartItem[] = []): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function calculateCartTotal(cart: Cart | null) {
  const subtotal = cart?.subtotal ?? calculateCartSubtotal(cart?.items);
  const discount = 0;
  const shipping = 0;
  const tax = cart?.tax ?? 0;

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total: cart?.total ?? subtotal - discount + shipping + tax,
  };
}

export function calculateItemTotal(item: PricedCartItem | null): number {
  return item ? item.price * item.quantity : 0;
}

export function calculateCartSavings(items: PricedCartItem[] = []): number {
  return items.reduce((total, item) => {
    const regularPrice = item.product?.price ?? item.price;
    const salePrice = item.salePrice ?? item.price;
    return total + Math.max(regularPrice - salePrice, 0) * item.quantity;
  }, 0);
}
