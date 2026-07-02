'use client';

import { cn } from '@/lib/utils/cn';

interface CheckoutButtonProps {
    label?: string;
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}

export default function CheckoutButton({
    label = 'Proceed to payment',
    isLoading = false,
    disabled = false,
    onClick,
    className,
}: CheckoutButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || isLoading}
            className={cn(
                '@container w-full rounded-button bg-primary px-5 py-4 text-sm font-semibold text-on-primary shadow-button transition-all hover:bg-primary-dark hover:shadow-button-hover active:scale-[0.98] disabled:bg-bg-disabled disabled:text-text-disabled flex items-center justify-center gap-2',
                className
            )}
        >
            <span>{isLoading ? 'Redirecting...' : label}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
    );
}
