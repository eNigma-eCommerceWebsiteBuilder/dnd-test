import { ReturnsStatusFilterRegion as ReturnsStatusFilterRegionRenderer } from '@/enigma-components/returns/canonical/ReturnsPageSections';
import { loadAccountReturnsRuntime } from './accountReturnsRuntime';
import { resolveAccountReturnsData } from './viewData';

interface Props { data?: Awaited<ReturnType<typeof loadAccountReturnsRuntime>> | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnsStatusFilterRegion'; export const puckLabel = 'Return Status Filter'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnsStatusFilterRegion', 'ReturnStatusFilter'], sourceImportPaths: ['@/components/returns/canonical/ReturnsPageSections'], role: 'returns-status-filter-region', slotTarget: 'filter', runtimeSignals: ['searchParams.status'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadAccountReturnsRuntime>[0]) { return loadAccountReturnsRuntime(context); }
export function ReturnsStatusFilterRegion(props: Props) { const data = resolveAccountReturnsData(props); return data ? <ReturnsStatusFilterRegionRenderer status={data.status} /> : null; }
