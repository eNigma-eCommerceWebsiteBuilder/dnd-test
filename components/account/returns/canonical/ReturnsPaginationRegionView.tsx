import { ReturnsPaginationRegion as ReturnsPaginationRegionRenderer } from '@/enigma-components/returns/canonical/ReturnsPageSections';
import { loadAccountReturnsRuntime } from './accountReturnsRuntime';
import { resolveAccountReturnsData } from './viewData';

interface Props { data?: Awaited<ReturnType<typeof loadAccountReturnsRuntime>> | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnsPaginationRegion'; export const puckLabel = 'Returns Pagination'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnsPaginationRegion', 'ReturnsPagination'], sourceImportPaths: ['@/components/returns/canonical/ReturnsPageSections'], role: 'returns-pagination-region', slotTarget: 'pagination', conditional: 'page > 1 || returns.length === limit', runtimeSignals: ['page', 'returns.length'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadAccountReturnsRuntime>[0]) { return loadAccountReturnsRuntime(context); }
export function ReturnsPaginationRegion(props: Props) { const data = resolveAccountReturnsData(props); return data ? <ReturnsPaginationRegionRenderer page={data.page} hasNextPage={data.returns.length === 10} /> : null; }
