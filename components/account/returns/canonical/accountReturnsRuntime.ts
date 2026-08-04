import { cache } from 'react';
import { fetchReturnsPageData, type ReturnsPageData } from '@/enigma-components/returns/canonical/returnsPageRuntime';
import { getSearchParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

const loadByRequest = cache(async (status?: string, page?: string): Promise<ReturnsPageData> => {
    return fetchReturnsPageData({ status, page });
});

export function loadAccountReturnsRuntime(context?: PuckFetcherContext): Promise<ReturnsPageData> {
    return loadByRequest(getSearchParam(context, 'status'), getSearchParam(context, 'page'));
}
