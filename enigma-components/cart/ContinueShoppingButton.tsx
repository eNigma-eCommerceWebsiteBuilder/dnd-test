import Link from 'next/link';
import { ROUTES } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';

interface ContinueShoppingButtonProps {
    className?: string;
}

/**
 * ContinueShoppingButton Component (Server)
 * 
 * Link back to products page with hover animation.
 * Uses @container queries for responsive layout.
 */
export function ContinueShoppingButton({ className }: ContinueShoppingButtonProps) {
    return (
        <div className={cn("@container w-full", className)}>
            <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2 text-xs @sm:text-sm font-bold text-primary hover:gap-3 transition-all"
            >
                <span className="material-symbols-outlined text-base @sm:text-lg">arrow_back</span>
                <span>Continue Shopping</span>
            </Link>
        </div>
    );
}

export default ContinueShoppingButton;
