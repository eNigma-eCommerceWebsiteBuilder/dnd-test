import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface ViewOrderButtonProps {
    orderId: string;
    className?: string;
}

/**
 * ViewOrderButton Component
 * 
 * Navigation button to view detailed order.
 * 
 * Design Principles:
 * - Server Component using Next.js Link
 * - Primary button styling (solid)
 * - Fluid width on mobile, auto on desktop
 */
export function ViewOrderButton({ orderId, className }: ViewOrderButtonProps) {
    return (
        <div className={cn("@container w-full", className)}>
            <Link
                href={`/account/orders/${orderId}`}
                className={cn(
                    "inline-flex w-full items-center justify-center @sm:w-auto",
                    "px-8 py-3 @sm:px-10 @sm:py-4",
                    "rounded-button bg-cta-primary text-on-primary",
                    "text-sm font-semibold shadow-button",
                    "transition-all duration-normal text-center",
                    "hover:-translate-y-0.5 hover:bg-cta-primary-hover hover:shadow-button-hover"
                )}
            >
                View Detailed Order
            </Link>
        </div>
    );
}
