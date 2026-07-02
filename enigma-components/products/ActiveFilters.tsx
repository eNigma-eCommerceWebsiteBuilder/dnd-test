'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';

interface ActiveFilter {
    key: string;
    label: string;
    value: string;
}

interface ActiveFiltersProps {
    className?: string;
}

/**
 * ActiveFilters Component
 * 
 * Displays currently applied filters as removable pills.
 * Reads from URL search params for SSR compatibility.
 */
export function ActiveFilters({ className }: ActiveFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Parse active filters from URL
    const activeFilters = useMemo((): ActiveFilter[] => {
        const filters: ActiveFilter[] = [];

        // Category filter
        const category = searchParams.get('category');
        if (category) {
            filters.push({
                key: 'category',
                label: 'Category',
                value: category,
            });
        }

        // Price range filter
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice || maxPrice) {
            const min = minPrice ? `$${minPrice}` : '$0';
            const max = maxPrice ? `$${maxPrice}` : '$∞';
            filters.push({
                key: 'price',
                label: 'Price Range',
                value: `${min} - ${max}`,
            });
        }

        // In stock filter
        const inStock = searchParams.get('inStock');
        if (inStock === 'true') {
            filters.push({
                key: 'inStock',
                label: 'Availability',
                value: 'In Stock',
            });
        }

        // On sale filter
        const onSale = searchParams.get('onSale');
        if (onSale === 'true') {
            filters.push({
                key: 'onSale',
                label: 'Availability',
                value: 'On Sale',
            });
        }

        return filters;
    }, [searchParams]);

    const removeFilter = useCallback((filterKey: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (filterKey === 'price') {
            params.delete('minPrice');
            params.delete('maxPrice');
        } else {
            params.delete(filterKey);
        }

        // Reset to page 1
        params.delete('page');

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [router, pathname, searchParams]);

    const clearAllFilters = useCallback(() => {
        const params = new URLSearchParams();

        // Preserve sort and view preferences
        const sort = searchParams.get('sort');
        const view = searchParams.get('view');
        if (sort) params.set('sort', sort);
        if (view) params.set('view', view);

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [router, pathname, searchParams]);

    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <div className={cn("@container flex flex-wrap items-center gap-3", className)}>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted mr-2">
                Active Filters:
            </span>

            {activeFilters.map((filter) => (
                <div
                    key={filter.key}
                    className={cn(
                        "flex items-center gap-2",
                        "px-3 py-1.5",
                        "bg-primary/10 text-primary",
                        "border border-primary/20",
                        "rounded-full",
                        "text-xs font-bold"
                    )}
                >
                    {filter.value}
                    <button
                        onClick={() => removeFilter(filter.key)}
                        className="hover:text-primary-dark transition-colors"
                        aria-label={`Remove ${filter.label} filter`}
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            ))}

            <button
                onClick={clearAllFilters}
                className={cn(
                    "text-xs font-bold text-text-muted",
                    "hover:text-primary underline underline-offset-4 ml-2"
                )}
            >
                Clear All
            </button>
        </div>
    );
}

export default ActiveFilters;
