'use client';

import { cn } from '@/lib/utils/cn';

interface StripeRedirectMessageProps {
    message?: string;
    className?: string;
}

export default function StripeRedirectMessage({
    message = 'Secure checkout powered by Stripe',
    className,
}: StripeRedirectMessageProps) {
    return (
        <div className={cn('@container w-full flex items-center justify-center gap-2 text-xs text-text-muted uppercase tracking-widest', className)}>
            <span className="material-symbols-outlined text-[16px]">lock</span>
            {message}
        </div>
    );
}
