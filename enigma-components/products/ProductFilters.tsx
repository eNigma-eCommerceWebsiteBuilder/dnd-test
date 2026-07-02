'use client';

import { cn } from '@/lib/utils/cn';
import { CategoryFilter } from './CategoryFilter';
import { PriceRangeSlider } from './PriceRangeSlider';
import { AvailabilityFilter } from './AvailabilityFilter';
import type { Category } from '@/lib/api/types';

interface ProductFiltersProps {
    categories: Category[];
    className?: string;
}

/**
 * ProductFilters Component
 * 
 * Sidebar filter panel combining all filter components.
 * Sticky positioning on desktop for better UX.
 */
export function ProductFilters({ categories, className }: ProductFiltersProps) {
    return (
        <aside className={cn("@container w-full", className)}>
            <div className="sticky top-28 space-y-8">
                {/* Category Filter */}
                <CategoryFilter categories={categories} />

                {/* Price Range Filter */}
                <PriceRangeSlider minValue={0} maxValue={5000} />

                {/* Availability Filter */}
                <AvailabilityFilter />
            </div>
        </aside>
    );
}

export default ProductFilters;
