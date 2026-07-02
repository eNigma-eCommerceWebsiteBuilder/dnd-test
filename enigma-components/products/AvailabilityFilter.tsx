'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

interface AvailabilityFilterProps {
    className?: string;
}

/**
 * AvailabilityFilter Component
 * 
 * Toggle buttons for In Stock and On Sale filters.
 * Syncs with URL search params.
 */
export function AvailabilityFilter({ className }: AvailabilityFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const inStock = searchParams.get('inStock') === 'true';
    const onSale = searchParams.get('onSale') === 'true';

    const handleFilterToggle = useCallback((filter: 'inStock' | 'onSale') => {
        const params = new URLSearchParams(searchParams.toString());
        const currentValue = params.get(filter) === 'true';

        if (currentValue) {
            params.delete(filter);
        } else {
            params.set(filter, 'true');
        }

        // Reset to page 1
        params.delete('page');

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [router, pathname, searchParams]);

    return (
        <div className={cn("@container", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-text-base">
                    Availability
                </h3>
                <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-text-base transition-colors">
                    expand_less
                </span>
            </div>

            {/* Toggle Buttons */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => handleFilterToggle('inStock')}
                    className={cn(
                        "flex-1 px-4 py-2 rounded-card text-xs font-bold text-center transition-colors",
                        inStock
                            ? "border-2 border-primary text-primary bg-primary/5"
                            : "border border-border text-text-base hover:border-primary/50"
                    )}
                >
                    In Stock
                </button>
                <button
                    onClick={() => handleFilterToggle('onSale')}
                    className={cn(
                        "flex-1 px-4 py-2 rounded-card text-xs font-bold text-center transition-colors",
                        onSale
                            ? "border-2 border-primary text-primary bg-primary/5"
                            : "border border-border text-text-base hover:border-primary/50"
                    )}
                >
                    On Sale
                </button>
            </div>
        </div>
    );
}

export default AvailabilityFilter;
