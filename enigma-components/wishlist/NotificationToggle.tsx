'use client';

import { useMemo, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks';
import { useWishlistNotifications } from '@/lib/hooks';

interface NotificationToggleProps {
  productId: string;
  variantId?: string;
  inStock: boolean;
  className?: string;
}

export function NotificationToggle({
  productId,
  variantId,
  inStock,
  className,
}: NotificationToggleProps) {
  const { success, error } = useToast();
  const {
    getNotificationSettings,
    enablePriceDropAlert,
    enableStockAlert,
    disableNotifications,
    loading,
  } = useWishlistNotifications();
  const [isPending, startTransition] = useTransition();

  const settings = getNotificationSettings(productId, variantId);
  const toggleOn = inStock
    ? settings?.notifyOnPriceDrop ?? false
    : settings?.notifyOnBackInStock ?? false;

  const label = useMemo(
    () => (inStock ? 'Price Drop Alert' : 'Back in Stock Alert'),
    [inStock]
  );

  const handleToggle = () => {
    startTransition(async () => {
      try {
        if (toggleOn) {
          await disableNotifications(productId, variantId);
          success('Notifications disabled');
          return;
        }

        if (inStock) {
          await enablePriceDropAlert(productId, variantId);
        } else {
          await enableStockAlert(productId, variantId);
        }

        success('Notifications updated');
      } catch {
        error('Failed to update notifications');
      }
    });
  };

  const isDisabled = loading || isPending;

  return (
    <div className={cn('@container flex items-center justify-between gap-3', className)}>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
          {label}
        </span>
        <span className="text-xs font-semibold text-text-base">Notify me</span>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={toggleOn}
          onChange={handleToggle}
          disabled={isDisabled}
        />
        <div className="w-9 h-5 bg-bg-sunken peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-border after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-bg-elevated after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-disabled:opacity-50" />
      </label>
    </div>
  );
}
