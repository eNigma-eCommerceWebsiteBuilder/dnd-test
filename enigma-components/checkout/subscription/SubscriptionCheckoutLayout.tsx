'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface SubscriptionCheckoutLayoutProps {
    header?: ReactNode;
    steps?: ReactNode;
    leftColumn: ReactNode;
    rightColumn: ReactNode;
    footer?: ReactNode;
    className?: string;
}

export default function SubscriptionCheckoutLayout({
    header,
    steps,
    leftColumn,
    rightColumn,
    footer,
    className,
}: SubscriptionCheckoutLayoutProps) {
    return (
        <div className={cn('@container w-full space-y-10', className)}>
            {header ? <div className="space-y-3">{header}</div> : null}
            {steps ? <div>{steps}</div> : null}
            <div className="grid grid-cols-1 gap-10 @lg:grid-cols-12 @lg:gap-12">
                <div className="space-y-10 @lg:col-span-7">
                    {leftColumn}
                </div>
                <div className="@lg:col-span-5">
                    {rightColumn}
                </div>
            </div>
            {footer ? <div>{footer}</div> : null}
        </div>
    );
}
