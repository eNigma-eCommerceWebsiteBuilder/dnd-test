'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { PriceRangeSlider } from '@/components/products/PriceRangeSlider';

interface Category {
    _id: string;
    name: string;
    slug: string;
    productCount?: number;
}

interface SearchFiltersProps {
    categories: Category[];
    className?: string;
}

/**
 * SearchFilters Component - Client Component
 * 
 * Accordion-style filter panels following LUXE design:
 * - Category checkboxes
 * - Price range slider
 * - Color swatches
 * - Size buttons
 * 
 * Updates URL params on filter changes (no local state).
 */
export function SearchFilters({ categories, className }: SearchFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get current filter values from URL
    const selectedCategory = searchParams.get('category') || '';
    const inStock = searchParams.get('inStock') === 'true';
    const onSale = searchParams.get('onSale') === 'true';

    // Update URL params helper
    const updateParams = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Reset to page 1 when filters change
        params.delete('page');

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [router, pathname, searchParams]);

    // Handle category toggle
    const handleCategoryChange = (categorySlug: string) => {
        updateParams({
            category: selectedCategory === categorySlug ? null : categorySlug,
        });
    };

    // Handle availability toggle
    const handleAvailabilityChange = (key: 'inStock' | 'onSale', checked: boolean) => {
        updateParams({
            [key]: checked ? 'true' : null,
        });
    };

    // Clear all filters
    const handleClearAll = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('category');
        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('inStock');
        params.delete('onSale');
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Check if any filters are active
    const urlMinPrice = searchParams.get('minPrice');
    const urlMaxPrice = searchParams.get('maxPrice');
    const hasActiveFilters = selectedCategory || urlMinPrice || urlMaxPrice || inStock || onSale;

    return (
        <div className={cn("@container w-full sticky top-28 flex flex-col gap-6", className)}>
            {/* Header with Clear All */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-base">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="text-primary text-sm font-bold hover:underline"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="flex flex-col border-t border-border">
                {/* Category Accordion */}
                {categories.length > 0 && (
                    <details className="group py-4" open>
                        <summary className="flex cursor-pointer items-center justify-between font-bold text-sm uppercase tracking-wider text-text-base">
                            <span>Category</span>
                            <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                                expand_more
                            </span>
                        </summary>
                        <div className="mt-4 flex flex-col gap-3 pl-1">
                            {categories.map((category) => (
                                <label
                                    key={category._id}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategory === category.slug}
                                        onChange={() => handleCategoryChange(category.slug)}
                                        className="rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-text-base">
                                        {category.name}
                                        {category.productCount !== undefined && (
                                            <span className="text-text-muted ml-1">
                                                ({category.productCount})
                                            </span>
                                        )}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </details>
                )}

                {/* Price Range Accordion */}
                <details className="group py-4 border-t border-border" open>
                    <summary className="flex cursor-pointer items-center justify-between font-bold text-sm uppercase tracking-wider text-text-base">
                        <span>Price Range</span>
                        <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                            expand_more
                        </span>
                    </summary>
                    <div className="mt-6 px-1">
                        {/* PriceRangeSlider handles URL params internally */}
                        <PriceRangeSlider
                            minValue={0}
                            maxValue={1000}
                        />
                    </div>
                </details>

                {/* Availability Accordion */}
                <details className="group py-4 border-t border-border" open>
                    <summary className="flex cursor-pointer items-center justify-between font-bold text-sm uppercase tracking-wider text-text-base">
                        <span>Availability</span>
                        <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                            expand_more
                        </span>
                    </summary>
                    <div className="mt-4 flex flex-col gap-3 pl-1">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={inStock}
                                onChange={(e) => handleAvailabilityChange('inStock', e.target.checked)}
                                className="rounded border-border text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-text-base">
                                In Stock
                            </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={onSale}
                                onChange={(e) => handleAvailabilityChange('onSale', e.target.checked)}
                                className="rounded border-border text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-text-base">
                                On Sale
                            </span>
                        </label>
                    </div>
                </details>
            </div>
        </div >
    );
}

export default SearchFilters;
