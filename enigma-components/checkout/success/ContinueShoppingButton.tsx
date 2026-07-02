import Link from 'next/link';
import { ROUTES } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';

interface ContinueShoppingButtonProps {
    className?: string;
}

/**
 * ContinueShoppingButton Component
 * 
 * Navigation button returning to products page.
 * 
 * Design Principles:
 * - Server Component using Next.js Link
 * - Secondary button styling (outlined)
 * - Fluid width on mobile, auto on desktop
 */
export function ContinueShoppingButton({ className }: ContinueShoppingButtonProps) {
    return (
        <div className={cn("@container w-full", className)}>
            <Link
                href={ROUTES.PRODUCTS}
                className={cn(
                    "inline-flex w-full items-center justify-center @sm:w-auto",
                    "px-8 py-3 @sm:px-10 @sm:py-4",
                    "rounded-button border border-border bg-bg-surface",
                    "text-sm font-semibold text-text-base",
                    "transition-all duration-normal text-center",
                    "hover:border-border-hover hover:bg-bg-hover hover:-translate-y-0.5"
                )}
            >
                Continue Shopping
            </Link>
        </div>
    );
}
