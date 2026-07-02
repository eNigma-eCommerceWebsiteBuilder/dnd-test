import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';

/**
 * OrderEmpty Component (Server)
 * 
 * Empty state shown when user has no orders.
 * 
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Uses @container on root element
 * 
 * Per Section 2.4:
 * - All text is hardcoded (functional UI, not marketing)
 * - "Your Bag is Empty" example in docs - similar pattern
 */
interface OrderEmptyProps {
    className?: string;
}

export function OrderEmpty({ className }: OrderEmptyProps) {
    return (
        <div
            className={cn(
                '@container w-full flex flex-col items-center justify-center text-center py-12 @md:py-16 @lg:py-20 px-4',
                className
            )}
        >
            {/* Icon */}
            <div className="w-20 h-20 @md:w-24 @md:h-24 rounded-full bg-bg-sunken flex items-center justify-center mb-4 @md:mb-6">
                <span className="material-symbols-outlined text-4xl @md:text-5xl text-text-muted">
                    receipt_long
                </span>
            </div>

            {/* Title - Hardcoded functional UI */}
            <h2 className="text-lg @md:text-xl @lg:text-2xl font-bold font-heading text-text-base mb-2">
                No Orders Yet
            </h2>

            {/* Message - Hardcoded functional UI */}
            <p className="text-sm @md:text-base text-text-muted max-w-md mb-6 @md:mb-8">
                When you place an order, it will appear here. Start shopping to see your order history.
            </p>

            {/* CTA Button */}
            <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-button shadow-button hover:bg-primary-dark hover:shadow-button-hover transition-all"
            >
                <span className="material-symbols-outlined text-lg">shopping_bag</span>
                Start Shopping
            </Link>
        </div>
    );
}
