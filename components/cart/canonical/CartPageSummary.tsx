'use client';

import { CartSummary } from '@/components/cart/CartSummary';
import { useCartPageRuntime } from './CartPageState';

export function CartPageSummary() {
  const { totals, items, itemCount, estimateTax } = useCartPageRuntime();
  return (
    <CartSummary
      subtotal={totals.subtotal}
      shipping={totals.shipping === 0 ? 0 : null}
      tax={totals.tax > 0 ? totals.tax : null}
      total={totals.total}
      itemCount={itemCount}
      items={items}
      onEstimateTax={estimateTax}
    />
  );
}
