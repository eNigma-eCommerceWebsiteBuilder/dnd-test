'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useReturns } from '@/lib/hooks';
import { formatReturnStatus } from '@/lib/utils/returns';
import { ReturnRequestStatus, type ReturnStatus } from '@/lib/api/types/returns';

interface ReturnStatusFilterProps {
    activeStatus?: ReturnStatus | null;
    className?: string;
}

const STATUS_OPTIONS: Array<ReturnStatus | null> = [
    null,
    ReturnRequestStatus.PENDING,
    ReturnRequestStatus.APPROVED,
    ReturnRequestStatus.PROCESSING,
    ReturnRequestStatus.COMPLETED,
    ReturnRequestStatus.REJECTED,
    ReturnRequestStatus.CANCELLED,
];

export function ReturnStatusFilter({ activeStatus = null, className }: ReturnStatusFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { filter, filterByStatus } = useReturns();

    const currentStatus = activeStatus ?? filter;

    const handleStatusChange = useCallback((status: ReturnStatus | null) => {
        filterByStatus(status);

        const params = new URLSearchParams(searchParams.toString());
        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }

        params.delete('page');
        const query = params.toString();
        router.push(`/account/returns${query ? `?${query}` : ''}`);
    }, [filterByStatus, router, searchParams]);

    return (
        <div className={cn('@container w-full bg-surface border border-border rounded-card shadow-card', className)}>
            <nav className="flex overflow-x-auto gap-6 @md:gap-8 px-4">
                {STATUS_OPTIONS.map((statusOption) => {
                    const isActive = currentStatus === statusOption || (!currentStatus && statusOption === null);
                    const label = statusOption ? formatReturnStatus(statusOption).text : 'All';

                    return (
                        <button
                            key={statusOption ?? 'all'}
                            type="button"
                            onClick={() => handleStatusChange(statusOption)}
                            className={cn(
                                'flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 whitespace-nowrap transition-colors',
                                isActive
                                    ? 'border-b-primary text-primary'
                                    : 'border-b-transparent text-text-muted hover:text-text-base'
                            )}
                        >
                            <span className="text-sm font-bold leading-normal tracking-[0.015em]">
                                {label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
