'use client';

import { cn } from '@/lib/utils/cn';

interface CheckoutLayoutProps {
    /** Current step ID */
    currentStep: string;
    /** Children to render */
    children: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * CheckoutLayout Component (Client)
 * 
 * Multi-step checkout wrapper that:
 * - Provides consistent layout structure for checkout steps
 * - Uses @container queries for responsive behavior
 * - Theme-agnostic using tailwind.config.ts variables
 * 
 * Component Design Rules (from PAGE_AND_COMPONENTS_PLAN.md):
 * - Section 2.3: Every structural component must have `@container` on root
 * - Section 2.1: Use theme variables from tailwind.config.ts
 * - Section 2.2: Start with `w-full` for fluidity
 */
export function CheckoutLayout({
    currentStep,
    children,
    className
}: CheckoutLayoutProps) {
    return (
        <div
            className={cn(
                "@container w-full",
                className
            )}
            data-checkout-step={currentStep}
        >
            {/* Main content area - fills available space */}
            <div className="w-full space-y-6 @sm:space-y-8 @lg:space-y-12">
                {children}
            </div>
        </div>
    );
}

export default CheckoutLayout;
