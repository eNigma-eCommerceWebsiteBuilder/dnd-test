'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface PricingPreviewCardProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

export default function PricingPreviewCard({
    title = 'Pricing preview',
    children,
    className,
}: PricingPreviewCardProps) {
    return (
        <section
            className={cn(
                '@container w-full rounded-card border border-border bg-bg-surface/80 backdrop-blur-overlay p-6 shadow-card space-y-4',
                className
            )}
        >
            <h3 className="text-base font-semibold text-text-base">{title}</h3>
            <div className="space-y-3">
                {children}
            </div>
        </section>
    );
}
