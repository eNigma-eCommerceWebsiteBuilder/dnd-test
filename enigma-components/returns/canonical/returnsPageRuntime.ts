import { getMyReturns } from '@/lib/api/services/returns';
import { ReturnRequestStatus, type ReturnStatus, type ReturnsListResponse } from '@/lib/api/types/returns';

export interface ReturnsPageSearchParams {
    status?: string;
    page?: string;
}

export interface ReturnsPageData {
    returns: ReturnsListResponse['data'];
    status?: ReturnStatus;
    page: number;
}

export function parseReturnsPageSearchParams(params: ReturnsPageSearchParams): Pick<ReturnsPageData, 'status' | 'page'> {
    const statusParam = params.status || undefined;
    const pageParam = parseInt(params.page || '1', 10);
    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const validStatuses: ReturnStatus[] = Object.values(ReturnRequestStatus);
    const status = validStatuses.includes(statusParam as ReturnStatus)
        ? (statusParam as ReturnStatus)
        : undefined;

    return { status, page };
}

// Preserve the original list route's filter, pagination, logging, and rethrow behavior.
export async function fetchReturnsPageData(params: ReturnsPageSearchParams): Promise<ReturnsPageData> {
    const { status, page } = parseReturnsPageSearchParams(params);
    let returnsData: ReturnsListResponse['data'] = [];

    try {
        returnsData = await getMyReturns(status, page, 10);
    } catch (error) {
        console.error('Error fetching returns:', error);
        throw error;
    }

    return { returns: returnsData, status, page };
}
