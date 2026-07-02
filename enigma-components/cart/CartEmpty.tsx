import Link from 'next/link';
import { ROUTES } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';

interface CartEmptyProps {
    className?: string;
}

/**
 * CartEmpty Component (Server)
 * 
 * Displayed when the user's cart is empty.
 * Shows an icon, message, and CTA to start shopping.
 * Uses @container queries for responsive layout.
 * Uses theme variables from tailwind.config.ts
 */
export function CartEmpty({ className }: CartEmptyProps) {
    return (
        <div className={cn(
            "@container flex flex-col items-center justify-center text-center py-12 @sm:py-16 @md:py-20 px-4 @sm:px-6",
            className
        )}>
            {/* Empty Cart Icon */}
            <div className="w-20 h-20 @sm:w-24 @sm:h-24 @md:w-28 @md:h-28 rounded-full bg-bg-sunken flex items-center justify-center mb-6 @sm:mb-8">
                <span className="material-symbols-outlined text-4xl @sm:text-5xl @md:text-6xl text-text-muted">
                    shopping_cart
                </span>
            </div>

            {/* Title */}
            <h2 className="text-xl @sm:text-2xl @md:text-3xl font-bold text-text-base mb-2 @sm:mb-3">
                Your Bag is Empty
            </h2>

            {/* Description */}
            <p className="text-sm @sm:text-base text-text-muted mb-6 @sm:mb-8 max-w-md">
                Looks like you haven&apos;t added anything to your bag yet. Start shopping to fill it up!
            </p>

            {/* CTA Button - using theme variables */}
            <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2 px-6 @sm:px-8 py-3 @sm:py-4 bg-primary text-on-primary font-semibold rounded-button hover:bg-primary-dark transition-all shadow-button hover:shadow-button-hover hover:-translate-y-0.5"
            >
                <span className="material-symbols-outlined text-lg @sm:text-xl">
                    storefront
                </span>
                Start Shopping
            </Link>
        </div>
    );
}

export default CartEmpty;
