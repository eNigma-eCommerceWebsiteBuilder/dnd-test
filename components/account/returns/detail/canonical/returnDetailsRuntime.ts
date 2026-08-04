import { cache } from 'react';
import type { ReturnRequest } from '@/lib/api/types';
import { fetchReturnDetails } from '@/enigma-components/returns/canonical/returnDetailsRuntime';
import { getRouteParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface ReturnDetailsRuntime { returnDetails: ReturnRequest | null; returnId: string; }
export function resolveReturnDetailsId(context?: PuckFetcherContext): string { return getRouteParam(context, 'id') || ''; }
const loadById = cache(async (returnId: string): Promise<ReturnDetailsRuntime> => (
  returnId ? { returnId, returnDetails: await fetchReturnDetails(returnId) } : { returnId, returnDetails: null }
));
export function loadReturnDetailsRuntime(context?: PuckFetcherContext): Promise<ReturnDetailsRuntime> { return loadById(resolveReturnDetailsId(context)); }
