'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { OrderCard } from './OrderCard';
import type { Order } from '@/lib/api/types';

/**
 * OrderList Component (Client)
 * 
 * Receives SSR order data and handles client-side pagination.
 * 
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 1.2:
 * - Interactive UI: Receives data via Props
 * - Handles user interactions (pagination)
 * 
 * Per Section 2.3:
 * - Uses @container on root element
 * - Uses container queries for responsive layout
 * 
 * Per Section 3.2:
 * - Client-side hooks for user-initiated actions (pagination)
 */
interface OrderListProps {
    initialOrders: Order[];
    initialPagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    statusFilter?: string;
    className?: string;
    basePath?: string;
}

export function OrderList({
    initialOrders,
    initialPagination,
    // statusFilter, // Unused
    className,
    basePath = '/account/orders',
}: OrderListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orders] = useState<Order[]>(initialOrders);
    const [pagination] = useState(initialPagination);

    const handlePageChange = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(newPage));
        router.push(`${basePath}?${params.toString()}`);
    }, [basePath, router, searchParams]);

    return (
        <div className={cn('@container w-full', className)}>
            {/* Order Cards List */}
            <div className="flex flex-col gap-4">
                {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <nav className="flex items-center justify-between px-2 pt-6" aria-label="Pagination">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className={cn(
                            'flex items-center gap-2 font-bold text-sm transition-colors',
                            pagination.page <= 1
                                ? 'text-text-disabled cursor-not-allowed'
                                : 'text-text-muted hover:text-primary'
                        )}
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 @md:gap-2">
                        {generatePageNumbers(pagination.page, pagination.totalPages).map((pageNum, idx) => (
                            pageNum === '...' ? (
                                <span key={`ellipsis-${idx}`} className="px-2 text-text-muted">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(Number(pageNum))}
                                    className={cn(
                                        'px-3 py-1 rounded text-sm font-bold transition-colors',
                                        pagination.page === pageNum
                                            ? 'bg-primary text-on-primary'
                                            : 'hover:bg-bg-hover text-text-muted'
                                    )}
                                >
                                    {pageNum}
                                </button>
                            )
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className={cn(
                            'flex items-center gap-2 font-bold text-sm transition-colors',
                            pagination.page >= pagination.totalPages
                                ? 'text-text-disabled cursor-not-allowed'
                                : 'text-text-muted hover:text-primary'
                        )}
                    >
                        Next
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </nav>
            )}
        </div>
    );
}

/**
 * Generate page numbers with ellipsis for large page counts
 */
function generatePageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        // Show pages around current
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        // Always show last page
        pages.push(totalPages);
    }

    return pages;
}
