import type { ReturnStatus, ReturnsListResponse } from '@/lib/api/types/returns';
import { RETURNS } from '@/lib/utils/constants';
import { ReturnCard } from '@/components/returns/ReturnCard';
import { ReturnStatusFilter } from '@/components/returns/ReturnStatusFilter';
import { ReturnsPagination } from '@/components/returns/ReturnsPagination';
import { ReturnsEmpty } from '@/components/returns/ReturnsEmpty';
import { CancelReturnButton } from '@/components/returns/CancelReturnButton';

interface ReturnsListProps {
    returns: ReturnsListResponse['data'];
    status?: ReturnStatus;
    page: number;
    limit: number;
}

export function ReturnsList({ returns, status, page, limit }: ReturnsListProps) {
    const hasReturns = returns.length > 0;
    const hasNextPage = returns.length === limit;

    return (
        <section className="@container w-full flex flex-col gap-6">
            <ReturnStatusFilter activeStatus={status ?? null} />

            <p className="text-xs text-text-muted">
                Refunds are processed in {RETURNS.REFUND_PROCESSING_DAYS} business days once a return is approved.
            </p>

            {hasReturns ? (
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
            ) : (
                <ReturnsEmpty />
            )}

            <ReturnsPagination currentPage={page} hasNextPage={hasNextPage} />
        </section>
    );
}
