import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';

interface WishlistEmptyProps {
  className?: string;
}

/**
 * WishlistEmpty Component (Server)
 *
 * Empty state shown when wishlist has no items.
 * Uses @container queries for responsive layout.
 * Uses theme variables from tailwind.config.ts.
 */
export function WishlistEmpty({ className }: WishlistEmptyProps) {
  return (
    <div
      className={cn(
        '@container w-full flex flex-col items-center justify-center text-center py-12 @md:py-16 @lg:py-20 px-4',
        className
      )}
    >
      <div className="w-20 h-20 @md:w-24 @md:h-24 rounded-full bg-bg-sunken flex items-center justify-center mb-4 @md:mb-6">
        <span className="material-symbols-outlined text-4xl @md:text-5xl text-text-muted">
          favorite
        </span>
      </div>

      <h2 className="text-lg @md:text-xl @lg:text-2xl font-bold font-heading text-text-base mb-2">
        Your Wishlist is Empty
      </h2>

      <p className="text-sm @md:text-base text-text-muted max-w-md mb-6 @md:mb-8">
        Save the pieces you love and keep them ready for later.
      </p>

      <Link
        href={ROUTES.PRODUCTS}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-button shadow-button hover:bg-primary-dark hover:shadow-button-hover transition-all"
      >
        <span className="material-symbols-outlined text-lg">storefront</span>
        Start Shopping
      </Link>
    </div>
  );
}
