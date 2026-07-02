'use client';

import { cn } from '@/lib/utils/cn';

interface SecureBadgesProps {
    className?: string;
    variant?: 'detailed' | 'simple';
}

/**
 * SecureBadges Component (Client)
 * 
 * Displays security trust marks and payment icons.
 * 
 * Component Design Rules (from PAGE_AND_COMPONENTS_PLAN.md):
 * - Section 2.3: Every structural component must have `@container` on root
 * - Section 2.4: Hardcode functional UI text (marketing copy in content.ts, functional here)
 * - Section 2.1: Use theme variables
 */
export function SecureBadges({ className, variant = 'simple' }: SecureBadgesProps) {
    if (variant === 'detailed') {
        return (
            <div className={cn("@container w-full space-y-4", className)}>
                {/* Security Info */}
                <div className="flex flex-col @sm:flex-row gap-4 p-4 bg-bg-surface border border-border rounded-card">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-success text-2xl">lock</span>
                        <div>
                            <p className="font-semibold text-sm text-text-base">Secure SSL Encryption</p>
                            <p className="text-xs text-text-muted">Your transaction is protected with 256-bit SSL encryption.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default simple variant - Payment Icons
    return (
        <div className={cn("@container w-full", className)}>
            <div className="flex flex-wrap items-center justify-center gap-3 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                {/* Placeholder icons using CSS shapes/colors as per design system requirements */}
                <div className="h-6 w-10 bg-bg-skeleton rounded flex items-center justify-center text-[8px] font-bold text-text-muted border border-border">VISA</div>
                <div className="h-6 w-10 bg-bg-skeleton rounded flex items-center justify-center text-[8px] font-bold text-text-muted border border-border">MC</div>
                <div className="h-6 w-10 bg-bg-skeleton rounded flex items-center justify-center text-[8px] font-bold text-text-muted border border-border">AMEX</div>
                <div className="h-6 w-10 bg-bg-skeleton rounded flex items-center justify-center text-[8px] font-bold text-text-muted border border-border">PAYPAL</div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-muted">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Guaranteed Safe Checkout</span>
            </div>
        </div>
    );
}

export default SecureBadges;
