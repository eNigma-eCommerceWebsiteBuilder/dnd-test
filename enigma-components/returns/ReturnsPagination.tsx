'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useReturns } from '@/lib/hooks';

interface ReturnsPaginationProps {
    currentPage: number;
    totalPages?: number;
    hasNextPage?: boolean;
    className?: string;
}

export function ReturnsPagination({ currentPage, totalPages, hasNextPage, className }: ReturnsPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { filter, loadReturns } = useReturns();

    const handlePageChange = useCallback((page: number) => {
        if (page < 1) return;
        if (typeof totalPages === 'number' && page > totalPages) return;

        void loadReturns(filter || undefined, page, 10);

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        const query = params.toString();
        router.push(`/account/returns${query ? `?${query}` : ''}`);
    }, [filter, loadReturns, router, searchParams, totalPages]);

    const showPagination = typeof totalPages === 'number'
        ? totalPages > 1
        : currentPage > 1 || Boolean(hasNextPage);

    if (!showPagination) {
        return null;
    }

    const canGoNext = typeof totalPages === 'number'
        ? currentPage < totalPages
        : Boolean(hasNextPage);

    return (
        <nav
            className={cn('@container w-full flex items-center justify-between px-2 pt-6', className)}
            aria-label="Returns pagination"
        >
            <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={cn(
                    'flex items-center gap-2 font-bold text-sm transition-colors',
                    currentPage <= 1
                        ? 'text-text-disabled cursor-not-allowed'
                        : 'text-text-muted hover:text-primary'
                )}
            >
                <span className="material-symbols-outlined">chevron_left</span>
                Previous
            </button>

            {typeof totalPages === 'number' ? (
                <div className="flex items-center gap-1 @md:gap-2">
                    {generatePageNumbers(currentPage, totalPages).map((pageNum, index) => (
                        pageNum === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-text-muted">...</span>
                        ) : (
                            <button
                                key={`page-${pageNum}`}
                                type="button"
                                onClick={() => handlePageChange(Number(pageNum))}
                                className={cn(
                                    'px-3 py-1 rounded text-sm font-bold transition-colors',
                                    currentPage === pageNum
                                        ? 'bg-primary text-on-primary'
                                        : 'hover:bg-hover text-text-muted'
                                )}
                            >
                                {pageNum}
                            </button>
                        )
                    ))}
                </div>
            ) : (
                <span className="text-sm font-semibold text-text-muted">Page {currentPage}</span>
            )}

            <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!canGoNext}
                className={cn(
                    'flex items-center gap-2 font-bold text-sm transition-colors',
                    !canGoNext
                        ? 'text-text-disabled cursor-not-allowed'
                        : 'text-text-muted hover:text-primary'
                )}
            >
                Next
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </nav>
    );
}

function generatePageNumbers(currentPage: number, totalPages: number): Array<number | '...'> {
    const pages: Array<number | '...'> = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i += 1) {
            pages.push(i);
        }

        return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
        pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i += 1) {
        pages.push(i);
    }

    if (currentPage < totalPages - 2) {
        pages.push('...');
    }

    pages.push(totalPages);

    return pages;
}
