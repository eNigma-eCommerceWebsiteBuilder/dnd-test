'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { WishlistItem } from '@/lib/api/types/wishlist';
import { AvailabilityFilter } from '@/enigma-components/wishlist/AvailabilityFilter';
import { MoveAllToCartButton } from '@/enigma-components/wishlist/MoveAllToCartButton';
import { ShareWishlistButton } from '@/enigma-components/wishlist/ShareWishlistButton';
import { ClearWishlistButton } from '@/enigma-components/wishlist/ClearWishlistButton';

type AvailabilityOption = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

interface WishlistBulkActionsBarProps {
  items: WishlistItem[];
  filter?: AvailabilityOption;
  onFilterChange?: (value: AvailabilityOption) => void;
  className?: string;
}

export function WishlistBulkActionsBar({
  items,
  filter: controlledFilter,
  onFilterChange,
  className,
}: WishlistBulkActionsBarProps) {
  const [uncontrolledFilter, setUncontrolledFilter] = useState<AvailabilityOption>('all');
  const filter = controlledFilter ?? uncontrolledFilter;

  const handleFilterChange = (value: AvailabilityOption) => {
    if (controlledFilter === undefined) {
      setUncontrolledFilter(value);
    }
    onFilterChange?.(value);
  };

  const isEmpty = useMemo(() => items.length === 0, [items.length]);

  return (
    <div
      className={cn(
        '@container flex flex-col gap-4 rounded-card border border-border bg-bg-surface p-4 shadow-card @md:flex-row @md:items-center @md:justify-between',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <MoveAllToCartButton disabled={isEmpty} />
        <ShareWishlistButton itemCount={items.length} disabled={isEmpty} />
        <ClearWishlistButton disabled={isEmpty} />
      </div>

      <AvailabilityFilter items={items} value={filter} onChange={handleFilterChange} />
    </div>
  );
}
