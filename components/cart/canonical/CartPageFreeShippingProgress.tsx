'use client';

import { FreeShippingProgress } from '@/components/cart/FreeShippingProgress';
import { useCartPageRuntime } from './CartPageState';

export function CartPageFreeShippingProgress() {
  const { totals } = useCartPageRuntime();
  return <FreeShippingProgress currentTotal={totals.subtotal} className="mb-6 md:mb-8" />;
}
