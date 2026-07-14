'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Category } from '@/lib/api/types';

interface CategoryFilterProps {
    categories: Category[];
    className?: string;
}

/**
 * CategoryFilter Component
 * 
 * Checkbox list of categories with product counts.
 * Syncs selection with URL search params.
 */
export function CategoryFilter({ categories, className }: CategoryFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedCategory = searchParams.get('category');

    const handleCategoryChange = useCallback((categoryValue: string, isChecked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());

        if (isChecked) {
            params.set('category', categoryValue);
        } else {
            params.delete('category');
        }

        // Reset to page 1 when filter changes
        params.delete('page');

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [router, pathname, searchParams]);

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className={cn("@container", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-text-base">
                    Category
                </h3>
                <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-text-base transition-colors">
                    expand_less
                </span>
            </div>

            {/* Category List */}
            <div
                className="space-y-3"
                style={{
                    '--checkbox-tick-svg': `url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27white%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')`
                } as React.CSSProperties}
            >
                {categories.map((category) => {
                    const categoryValue = getCategoryFilterValue(category);
                    const isSelected = selectedCategory === categoryValue
                        || selectedCategory === category._id
                        || selectedCategory === category.name;

                    return (
                        <label
                            key={category._id}
                            className="flex items-center gap-3 group cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleCategoryChange(categoryValue, e.target.checked)}
                                className={cn(
                                    "h-5 w-5 rounded border-border",
                                    "text-primary focus:ring-primary",
                                    "checked:bg-primary checked:border-primary",
                                    "cursor-pointer"
                                )}
                            />
                            <span className="text-sm font-medium text-text-base group-hover:text-primary transition-colors">
                                {category.name}
                                {category.productCount !== undefined && (
                                    <span className="text-text-muted ml-1">
                                        ({category.productCount})
                                    </span>
                                )}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

export default CategoryFilter;

function getCategoryFilterValue(category: Category): string {
    return category.slug || category.name || category._id;
}
