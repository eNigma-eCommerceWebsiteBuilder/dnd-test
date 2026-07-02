import { cn } from '@/lib/utils/cn';
import { calculateWishlistSavings } from '@/lib/utils/wishlist';
import { formatPrice } from '@/lib/utils/formatters';
import type { Wishlist } from '@/lib/api/types/wishlist';

interface WishlistSavingsCardProps {
  wishlist: Wishlist | null | undefined;
  className?: string;
}

/**
 * WishlistSavingsCard Component (Server)
 *
 * Displays estimated value and potential savings for wishlist items.
 * Uses @container queries for responsive layout.
 * Uses theme variables from tailwind.config.ts.
 */
export function WishlistSavingsCard({ wishlist, className }: WishlistSavingsCardProps) {
  const savings = calculateWishlistSavings(wishlist);

  return (
    <section
      className={cn(
        '@container w-full bg-bg-surface border border-border rounded-card shadow-card p-6',
        className
      )}
    >
      <div className="flex flex-col @md:flex-row @md:items-center gap-6">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-1">
            Estimated Value
          </p>
          <p className="text-2xl font-bold text-text-base">
            {formatPrice(savings.potentialValue)}
          </p>
        </div>

        <div className="hidden @md:block w-px h-10 bg-divider" />

        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-1">
            Potential Savings
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(savings.totalSavings)}
          </p>
        </div>

        <button className="w-full @md:w-auto bg-cta-primary hover:bg-cta-primary-hover text-on-primary px-4 py-2 rounded-button text-sm font-semibold transition-colors">
          Apply Offers
        </button>
      </div>
    </section>
  );
}
