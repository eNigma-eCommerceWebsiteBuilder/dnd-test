import { cn } from '@/lib/utils/cn';
import { getCart } from '@/lib/api/services/cart';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CartHeaderViewProps {
  title?: string;
  itemCount?: number;
  className?: string;
}

export const puckComponentName = 'CartHeader';
export const puckLabel = 'Cart Header';
export const puckCategory = 'Cart';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  itemCount: { type: 'number' as const, label: 'Item Count' },
};

export const puckDefaults = {
  title: 'Your Shopping Bag',
  itemCount: 3,
};

export async function puckDataFetcher(
  _props: CartHeaderViewProps,
  context?: PuckFetcherContext,
) {
  const cart = await getCart({ cookies: context?.metadata?.requestCookies });
  return {
    itemCount: cart.totalItems,
  };
}

export function CartHeaderView({
  title = 'Your Shopping Bag',
  itemCount = 0,
  className,
}: CartHeaderViewProps) {
  return (
    <div className={cn('@container mb-6 md:mb-8', className)}>
      <div className="flex flex-col gap-1 md:gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-text-base md:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-text-muted md:text-base">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>
    </div>
  );
}
