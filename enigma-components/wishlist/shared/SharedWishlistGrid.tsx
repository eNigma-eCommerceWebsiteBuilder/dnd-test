import type { WishlistItem } from '@/lib/api/types/wishlist';
import { SharedWishlistItem } from '@/enigma-components/wishlist/shared/SharedWishlistItem';

interface SharedWishlistGridProps {
  items: WishlistItem[];
}

export function SharedWishlistGrid({ items }: SharedWishlistGridProps) {
  return (
    <section className="@container w-full">
      <div className="grid grid-cols-1 gap-6 @md:grid-cols-2 @lg:grid-cols-4">
        {items.map((item) => (
          <SharedWishlistItem key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
