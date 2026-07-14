'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    className?: string;
}

/**
 * Pagination Component
 * 
 * Page navigation with URL search param sync.
 * Shows first, last, current, and neighboring pages with ellipsis.
 */
export function Pagination({ currentPage, totalPages, className }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = useCallback((page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;

        const params = new URLSearchParams(searchParams.toString());

        if (page === 1) {
            params.delete('page');
        } else {
            params.set('page', page.toString());
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: true });
    }, [router, pathname, searchParams, currentPage, totalPages]);

    // Generate page numbers to display
    const getPageNumbers = (): (number | 'ellipsis')[] => {
        const pages: (number | 'ellipsis')[] = [];
        const showEllipsisThreshold = 7;

        if (totalPages <= showEllipsisThreshold) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Left ellipsis
            if (currentPage > 3) {
                pages.push('ellipsis');
            }

            // Pages around current
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            // Right ellipsis
            if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
            }

            // Always show last page
            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers();

    return (
        <nav
            className={cn(
                "@container flex items-center justify-center gap-2",
                className
            )}
            aria-label="Pagination"
        >
            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                    "p-2 border border-border rounded-button",
                    "hover:bg-bg-hover transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
                aria-label="Previous page"
            >
                <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === 'ellipsis') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-text-muted"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={cn(
                                "w-10 h-10 rounded-button font-bold text-sm transition-colors",
                                isActive
                                    ? "bg-primary text-on-primary"
                                    : "hover:bg-bg-hover text-text-base"
                            )}
                            aria-label={`Page ${page}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                    "p-2 border border-border rounded-button",
                    "hover:bg-bg-hover transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
                aria-label="Next page"
            >
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </nav>
    );
}

export default Pagination;
