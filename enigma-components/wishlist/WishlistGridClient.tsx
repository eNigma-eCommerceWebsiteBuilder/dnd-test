'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { WishlistItem } from '@/components/wishlist/WishlistItem';
import { WishlistBulkActionsBar } from '@/components/wishlist/WishlistBulkActionsBar';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { getWishlistItemKey, groupWishlistByAvailability, isProductInWishlist } from '@/lib/utils/wishlist';
import type { Wishlist, WishlistItem as WishlistItemType } from '@/lib/api/types/wishlist';

type AvailabilityOption = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

interface WishlistGridClientProps {
  wishlist: Wishlist;
  className?: string;
}

export function WishlistGridClient({ wishlist, className }: WishlistGridClientProps) {
  const hydrateWishlist = useWishlistStore((state) => state.hydrateWishlist);
  const activeWishlist = useWishlistStore((state) => state.wishlist) || wishlist;
  const [filter, setFilter] = useState<AvailabilityOption>('all');

  useEffect(() => {
    hydrateWishlist(wishlist);
  }, [hydrateWishlist, wishlist]);

  const uniqueItems = useMemo(() => {
    const seen = new Set<string>();

    return activeWishlist.items.filter((item) => {
      const key = getWishlistItemKey(item.productId, item.variantId);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);

      return isProductInWishlist(activeWishlist, item.productId, item.variantId);
    });
  }, [activeWishlist]);

  const filteredItems = useMemo((): WishlistItemType[] => {
    if (filter === 'all') {
      return uniqueItems;
    }

    const grouped = groupWishlistByAvailability({
      ...activeWishlist,
      items: uniqueItems,
    });

    switch (filter) {
      case 'in-stock':
        return grouped.available;
      case 'low-stock':
        return grouped.lowStock;
      case 'out-of-stock':
        return grouped.outOfStock;
      default:
        return uniqueItems;
    }
  }, [filter, uniqueItems, activeWishlist]);

  return (
    <div className={cn("@container w-full", className)}>
      <WishlistBulkActionsBar
        items={uniqueItems}
        filter={filter}
        onFilterChange={setFilter}
        className="mb-8"
      />

      {filteredItems.length === 0 ? (
        <div className="@container w-full bg-bg-surface border border-border rounded-card p-6 text-center text-text-muted">
          No items match this filter.
        </div>
      ) : (
        <div className="@container grid grid-cols-1 gap-6 @sm:grid-cols-2 @lg:grid-cols-4">
          {filteredItems.map((item) => (
            <WishlistItem
              key={getWishlistItemKey(item.productId, item.variantId)}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}
