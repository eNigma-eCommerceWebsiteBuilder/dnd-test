'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * OrderStatusFilter Component (Client)
 * 
 * Tab-based filter for order status that updates URL search params.
 * 
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 1.2:
 * - Interactive UI component that handles user interactions
 * - Updates URL params (SSR-friendly filtering pattern)
 * 
 * Per Section 2.3:
 * - Uses @container on root element
 * 
 * Per Section 2.4:
 * - Tab labels are hardcoded (functional UI)
 */
interface OrderStatusFilterProps {
    activeStatus?: string;
    className?: string;
    basePath?: string;
}

const FILTER_OPTIONS = [
    { value: undefined, label: 'All' },
    { value: 'processing', label: 'In Progress' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
] as const;

export function OrderStatusFilter({
    activeStatus,
    className,
    basePath = '/account/orders',
}: OrderStatusFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleStatusChange = useCallback((status: string | undefined) => {
        const params = new URLSearchParams(searchParams.toString());

        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }

        // Reset to page 1 when changing filter
        params.delete('page');

        router.push(`${basePath}?${params.toString()}`);
    }, [basePath, router, searchParams]);

    return (
        <div
            className={cn(
                '@container bg-bg-surface rounded-card border border-border shadow-card mb-6 w-full',
                className
            )}
        >
            <nav className="flex overflow-x-auto px-4 gap-6 @md:gap-8 scrollbar-hide">
                {FILTER_OPTIONS.map((option) => {
                    const isActive = activeStatus === option.value ||
                        (option.value === undefined && !activeStatus);

                    return (
                        <button
                            key={option.label}
                            onClick={() => handleStatusChange(option.value)}
                            className={cn(
                                'flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 whitespace-nowrap transition-colors',
                                isActive
                                    ? 'border-b-primary text-primary'
                                    : 'border-b-transparent text-text-muted hover:text-text-base'
                            )}
                        >
                            <span className="text-sm font-bold leading-normal tracking-[0.015em]">
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
