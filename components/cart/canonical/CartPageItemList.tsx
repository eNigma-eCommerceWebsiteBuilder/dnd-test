'use client';

import { CartItemList } from '@/components/cart/CartItemList';
import { useCartPageRuntime } from './CartPageState';

export function CartPageItemList() {
  const { items, updateQuantity, remove, isPending } = useCartPageRuntime();
  return <CartItemList items={items} onUpdateQuantity={updateQuantity} onRemove={remove} isPending={isPending} />;
}
