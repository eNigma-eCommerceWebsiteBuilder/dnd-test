import type { ReactNode } from 'react';
import type { ReturnStatus, ReturnsListResponse } from '@/lib/api/types/returns';
import { RETURNS } from '@/lib/utils/constants';
import { CancelReturnButton } from '@/enigma-components/returns/CancelReturnButton';
import { ReturnCard } from '@/enigma-components/returns/ReturnCard';
import { ReturnsEmpty } from '@/enigma-components/returns/ReturnsEmpty';
import { ReturnsPagination } from '@/enigma-components/returns/ReturnsPagination';
import { ReturnStatusFilter } from '@/enigma-components/returns/ReturnStatusFilter';

interface RegionProps {
    children?: ReactNode;
}

export function ReturnsPageLayout({ header, content }: { header?: ReactNode; content?: ReactNode }) {
    return (
        <main className="min-h-screen bg-bg-base text-text-base">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
                {header}
                {content}
            </div>
        </main>
    );
}

export function ReturnsPageHeader() {
    return (
        <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold font-heading">My Returns</h1>
            <p className="text-sm md:text-base text-text-muted mt-1">
                Track return requests and refund status
            </p>
        </div>
    );
}

export function ReturnsListLayout({ filter, notice, results, pagination }: {
    filter?: ReactNode;
    notice?: ReactNode;
    results?: ReactNode;
    pagination?: ReactNode;
}) {
    return (
        <section className="@container w-full flex flex-col gap-6">
            {filter}
            {notice}
            {results}
            {pagination}
        </section>
    );
}

export function ReturnsStatusFilterRegion({ status }: { status?: ReturnStatus }) {
    return <ReturnStatusFilter activeStatus={status ?? null} />;
}

export function ReturnsProcessingNotice() {
    return (
        <p className="text-xs text-text-muted">
            Refunds are processed in {RETURNS.REFUND_PROCESSING_DAYS} business days once a return is approved.
        </p>
    );
}

export function ReturnsResultsState({ hasReturns, results, empty }: { hasReturns: boolean; results?: ReactNode; empty?: ReactNode }) {
    return hasReturns ? results : empty;
}

export function ReturnsCardsList({ returns }: { returns: ReturnsListResponse['data'] }) {
    return (
        <div className="flex flex-col gap-4">
            {returns.map((returnRequest) => (
                <ReturnCard
                    key={returnRequest._id}
                    returnRequest={returnRequest}
                    detailsHref={`/account/returns/${returnRequest._id}`}
                    footer={
                        <CancelReturnButton
                            returnId={returnRequest._id}
                            status={returnRequest.status}
                        />
                    }
                />
            ))}
        </div>
    );
}

export function ReturnsEmptyRegion() {
    return <ReturnsEmpty />;
}

export function ReturnsPaginationRegion({ page, hasNextPage }: { page: number; hasNextPage: boolean }) {
    return <ReturnsPagination currentPage={page} hasNextPage={hasNextPage} />;
}
