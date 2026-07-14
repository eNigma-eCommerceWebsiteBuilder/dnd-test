import { cn } from '@/lib/utils/cn';
import { getCart } from '@/lib/api/services/cart';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface SummaryItem {
  productName: string;
  image: string;
  quantity: number;
  price: number;
  variantName?: string;
}

interface CheckoutOrderSummaryViewProps {
  items: SummaryItem[];
  subtotal: number;
  shippingMethod?: string;
  shippingPrice?: number;
  tax?: number;
  discount?: number;
  total: number;
  itemCount: number;
  compact?: string;
  className?: string;
}

export const puckComponentName = 'CheckoutOrderSummary';
export const puckLabel = 'Checkout Order Summary';
export const puckCategory = 'Checkout';

export const puckFields = {
  subtotal: { type: 'number' as const, label: 'Subtotal' },
  shippingMethod: { type: 'text' as const, label: 'Shipping Method Name' },
  shippingPrice: { type: 'number' as const, label: 'Shipping Price (0 = Free)' },
  tax: { type: 'number' as const, label: 'Estimated Tax' },
  discount: { type: 'number' as const, label: 'Discount' },
  total: { type: 'number' as const, label: 'Total' },
  itemCount: { type: 'number' as const, label: 'Item Count' },
  compact: {
    type: 'select' as const,
    label: 'Compact Mode (hide item list)',
    options: [
      { label: 'No', value: 'false' },
      { label: 'Yes', value: 'true' },
    ],
  },
  items: {
    type: 'array' as const,
    label: 'Items',
    arrayFields: {
      productName: { type: 'text' as const, label: 'Product Name' },
      image: { type: 'text' as const, label: 'Image URL' },
      quantity: { type: 'number' as const, label: 'Quantity' },
      price: { type: 'number' as const, label: 'Price' },
      variantName: { type: 'text' as const, label: 'Variant Name (optional)' },
    },
    defaultItemProps: {
      productName: 'New Product',
      image: '',
      quantity: 1,
      price: 0,
      variantName: '',
    },
    getItemSummary: (item: SummaryItem) => `${item.productName} x${item.quantity}`,
    max: 50,
  },
};

export const puckDefaults = {
  subtotal: 1930,
  shippingMethod: '',
  shippingPrice: 0,
  tax: 0,
  discount: 0,
  total: 1930,
  itemCount: 3,
  compact: 'false',
  items: [
    { productName: 'Premium Wool Coat', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&q=80', quantity: 1, price: 1290, variantName: 'Size: L, Color: Camel' },
    { productName: 'Cashmere Sweater', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&q=80', quantity: 2, price: 320, variantName: 'Size: M, Color: Charcoal' },
  ],
};

export async function puckDataFetcher(
  _props: CheckoutOrderSummaryViewProps,
  context?: PuckFetcherContext,
) {
  const cart = await getCart({ cookies: context?.metadata?.requestCookies });
  const subtotal = cart.subtotal ?? cart.totalPrice ?? 0;
  const total = cart.total ?? cart.totalPrice ?? subtotal;
  return {
    items: (cart.items || []).map((item) => ({
      productName: item.product?.name || 'Product',
      image: item.product?.images?.[0] || item.product?.imageUrl || item.productSnapshot?.image || '',
      quantity: item.quantity,
      price: item.price,
      variantName: item.variant?.name || '',
    })),
    subtotal,
    tax: cart.tax ?? 0,
    total,
    itemCount: cart.totalItems,
  };
}

export function CheckoutOrderSummaryView({
  items,
  subtotal = 0,
  shippingMethod,
  shippingPrice,
  tax = 0,
  discount = 0,
  total = 0,
  itemCount = 0,
  compact = 'false',
  className,
}: CheckoutOrderSummaryViewProps) {
  const shippingCost = shippingPrice ?? 0;
  const finalTotal = total || (subtotal - discount + shippingCost + tax);

  return (
    <div className={cn('@container w-full bg-bg-surface border border-border rounded-card p-4 @sm:p-6 @lg:p-8 shadow-card', className)}>
      <h2 className="text-lg @sm:text-xl font-bold text-text-base mb-4 @sm:mb-6">Order Summary</h2>
      {compact === 'false' && items.length > 0 && (
        <div className="space-y-3 @sm:space-y-4 max-h-[250px] @sm:max-h-[300px] overflow-y-auto pr-1 @sm:pr-2 mb-4 @sm:mb-6">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 @sm:gap-4">
              <div
                className="w-14 h-18 @sm:w-16 @sm:h-20 bg-bg-skeleton rounded-image bg-cover bg-center shrink-0"
                style={{ backgroundImage: item.image ? `url(${item.image})` : undefined }}
                role="img"
                aria-label={item.productName}
              />
              <div className="flex flex-col justify-between py-0.5 @sm:py-1 flex-1 min-w-0">
                <div>
                  <p className="font-semibold text-xs @sm:text-sm text-text-base line-clamp-2">{item.productName}</p>
                  {item.variantName && <p className="text-[10px] @sm:text-xs text-text-muted mt-0.5">{item.variantName}</p>}
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-[10px] @sm:text-xs text-text-muted">Qty: {item.quantity}</p>
                  <p className="font-semibold text-xs @sm:text-sm text-text-base">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {compact === 'true' && (
        <p className="text-sm text-text-muted mb-4">{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</p>
      )}
      <div className="space-y-2 @sm:space-y-3 pt-3 @sm:pt-4 border-t border-divider">
        <div className="flex justify-between text-xs @sm:text-sm">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-medium text-text-base">${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-xs @sm:text-sm">
            <span className="text-success">Discount</span>
            <span className="font-medium text-success">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs @sm:text-sm">
          <span className="text-text-muted">Shipping</span>
          <span className="font-medium text-text-base">
            {shippingMethod ? (shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`) : 'Calculated at next step'}
          </span>
        </div>
        <div className="flex justify-between text-xs @sm:text-sm">
          <span className="text-text-muted">Estimated Tax</span>
          <span className="font-medium text-text-base">{tax > 0 ? `$${tax.toFixed(2)}` : 'Calculated at checkout'}</span>
        </div>
        <div className="pt-3 @sm:pt-4 mt-1 @sm:mt-2 border-t border-divider flex justify-between items-end">
          <div>
            <p className="text-[10px] @sm:text-xs text-text-muted uppercase tracking-widest font-bold">Total</p>
            <p className="text-xl @sm:text-2xl @lg:text-3xl font-bold text-primary">${finalTotal.toFixed(2)}</p>
          </div>
          <p className="text-[10px] @sm:text-xs text-text-muted text-right">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
        </div>
      </div>
      <div className="mt-4 @sm:mt-6 pt-3 @sm:pt-4 border-t border-divider flex flex-col items-center gap-2 @sm:gap-3">
        <div className="flex items-center gap-1.5 @sm:gap-2 text-[10px] @sm:text-xs text-text-muted font-medium">
          <span className="material-symbols-outlined text-[12px] @sm:text-[14px]">verified_user</span>
          <span>SSL Encrypted Secure Checkout</span>
        </div>
      </div>
    </div>
  );
}
