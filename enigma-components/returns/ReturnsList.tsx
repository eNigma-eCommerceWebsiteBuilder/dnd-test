import type { ReturnStatus, ReturnsListResponse } from '@/lib/api/types/returns';
import {
    ReturnsCardsList,
    ReturnsEmptyRegion,
    ReturnsListLayout,
    ReturnsPaginationRegion,
    ReturnsProcessingNotice,
    ReturnsResultsState,
    ReturnsStatusFilterRegion,
} from '@/enigma-components/returns/canonical/ReturnsPageSections';

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
        <ReturnsListLayout
            filter={<ReturnsStatusFilterRegion status={status} />}
            notice={<ReturnsProcessingNotice />}
            results={
                <ReturnsResultsState
                    hasReturns={hasReturns}
                    results={<ReturnsCardsList returns={returns} />}
                    empty={<ReturnsEmptyRegion />}
                />
            }
            pagination={<ReturnsPaginationRegion page={page} hasNextPage={hasNextPage} />}
        />
    );
}
