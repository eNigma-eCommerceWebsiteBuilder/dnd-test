import { cn } from '@/lib/utils/cn';
import type { Wishlist } from '@/lib/api/types/wishlist';
import { WishlistGridClient } from '@/components/wishlist/WishlistGridClient';

interface WishlistGridProps {
  wishlist: Wishlist;
  className?: string;
}

/**
 * WishlistGrid Component (Server)
 *
 * Server-to-client boundary for wishlist grid rendering.
 * Uses @container for responsive client rendering.
 */
export function WishlistGrid({ wishlist, className }: WishlistGridProps) {
  return (
    <section className={cn('@container w-full', className)}>
      <WishlistGridClient wishlist={wishlist} />
    </section>
  );
}
