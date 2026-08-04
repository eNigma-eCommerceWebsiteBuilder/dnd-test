'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { SORT_OPTIONS } from '@/lib/utils/constants';

interface SortDropdownProps {
    className?: string;
}

/**
 * SortDropdown Component
 * 
 * Sort selection dropdown that updates URL search params.
 * Uses SORT_OPTIONS from constants for consistency.
 */
export function SortDropdown({ className }: SortDropdownProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get('sort') || 'new';

    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (value === 'new') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }

        // Reset to page 1 when sorting changes
        params.delete('page');

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [router, pathname, searchParams]);

    return (
        <div className={cn("flex shrink-0 items-center gap-2", className)}>
            <label htmlFor="sort-select" className="text-sm font-semibold text-text-muted whitespace-nowrap">
                Sort by:
            </label>
            <select
                id="sort-select"
                value={currentSort}
                onChange={handleSortChange}
                className={cn(
                    "bg-bg-surface border border-border rounded-input",
                    "text-sm font-semibold text-text-base",
                    "px-4 py-2",
                    "focus:ring-1 focus:ring-primary focus:border-primary",
                    "appearance-none cursor-pointer",
                    "bg-no-repeat bg-right-3",
                    // Custom dropdown arrow using CSS
                    "pr-10"
                )}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.75rem center',
                }}
            >
                {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SortDropdown;
