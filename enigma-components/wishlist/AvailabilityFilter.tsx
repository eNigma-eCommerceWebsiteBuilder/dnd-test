'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { WishlistItem } from '@/lib/api/types/wishlist';
import { groupWishlistByAvailability } from '@/lib/utils/wishlist';

type AvailabilityOption = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

interface AvailabilityFilterProps {
  items: WishlistItem[];
  value: AvailabilityOption;
  onChange: (value: AvailabilityOption) => void;
  className?: string;
}

export function AvailabilityFilter({ items, value, onChange, className }: AvailabilityFilterProps) {
  const counts = useMemo(() => {
    const grouped = groupWishlistByAvailability({
      _id: '',
      items,
      totalItems: items.length,
      lastUpdated: new Date().toISOString(),
    });

    return {
      all: items.length,
      'in-stock': grouped.available.length,
      'low-stock': grouped.lowStock.length,
      'out-of-stock': grouped.outOfStock.length,
    };
  }, [items]);

  const options: Array<{ value: AvailabilityOption; label: string }> = [
    { value: 'all', label: `All (${counts.all})` },
    { value: 'in-stock', label: `In Stock (${counts['in-stock']})` },
    { value: 'low-stock', label: `Low Stock (${counts['low-stock']})` },
    { value: 'out-of-stock', label: `Out of Stock (${counts['out-of-stock']})` },
  ];

  return (
    <div
      className={cn('@container flex flex-wrap items-center gap-2 bg-bg-sunken rounded-card p-1', className)}
      role="group"
      aria-label="Availability filter"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              'px-4 py-1.5 rounded-button-sm text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-sunken',
              isActive
                ? 'bg-bg-elevated text-text-base shadow-card'
                : 'text-text-muted hover:text-text-base'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
