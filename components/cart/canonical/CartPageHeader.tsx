'use client';

import { useCartPageRuntime } from './CartPageState';

export function CartPageHeader() {
  const { itemCount: activeItemCount } = useCartPageRuntime();

  return (
    <div className="mb-6 flex flex-col gap-1 md:mb-8 md:gap-2">
      <h1 className="text-2xl font-bold tracking-tight text-text-base md:text-3xl lg:text-4xl">
        Your Shopping Bag
      </h1>
      <p className="text-sm text-text-muted md:text-base">
        {activeItemCount} {activeItemCount === 1 ? 'item' : 'items'} in your cart
      </p>
    </div>
  );
}
