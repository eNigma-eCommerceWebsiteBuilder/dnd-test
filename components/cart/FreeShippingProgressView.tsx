import { cn } from '@/lib/utils/cn';
import { getCart } from '@/lib/api/services/cart';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface FreeShippingProgressViewProps {
  currentTotal?: number;
  threshold?: number;
  className?: string;
}

export const puckComponentName = 'FreeShippingProgress';
export const puckLabel = 'Free Shipping Progress';
export const puckCategory = 'Cart';

export const puckFields = {
  currentTotal: { type: 'number' as const, label: 'Current Cart Total' },
  threshold: { type: 'number' as const, label: 'Free Shipping Threshold' },
};

export const puckDefaults = {
  currentTotal: 0,
  threshold: 100,
};

export async function puckDataFetcher(
  _props: FreeShippingProgressViewProps,
  context?: PuckFetcherContext,
) {
  const cart = await getCart({ cookies: context?.metadata?.requestCookies });
  return {
    currentTotal: cart.subtotal ?? cart.totalPrice ?? 0,
  };
}

export function FreeShippingProgressView({
  currentTotal = 0,
  threshold = 100,
  className,
}: FreeShippingProgressViewProps) {
  const progress = Math.min((currentTotal / threshold) * 100, 100);
  const remaining = Math.max(threshold - currentTotal, 0);
  const hasAchieved = remaining <= 0;

  return (
    <div className={cn(
      '@container bg-bg-surface p-4 @sm:p-6 rounded-card border border-border',
      className
    )}>
      <div className="flex justify-between items-center mb-2 @sm:mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg @sm:text-xl">
            local_shipping
          </span>
          <p className="text-xs @sm:text-sm font-medium text-text-base">
            Free Shipping Progress
          </p>
        </div>
        <p className="text-xs @sm:text-sm font-bold text-primary">
          {Math.round(progress)}%
        </p>
      </div>
      <div className="w-full bg-bg-sunken h-1.5 @sm:h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 @sm:mt-3 text-[10px] @sm:text-xs text-text-muted">
        {hasAchieved ? (
          <span className="text-success font-medium">
            You&apos;ve unlocked free shipping!
          </span>
        ) : (
          <>
            <span>You&apos;re </span>
            <span className="font-bold text-text-base">
              ${remaining.toFixed(2)}
            </span>
            <span> away from free shipping.</span>
          </>
        )}
      </p>
    </div>
  );
}
