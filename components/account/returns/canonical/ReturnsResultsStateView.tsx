import { ReturnsResultsState as ReturnsResultsStateRenderer } from '@/enigma-components/returns/canonical/ReturnsPageSections';
import { loadAccountReturnsRuntime } from './accountReturnsRuntime';
import { puckTransparentSlotProps, type AccountReturnsSlot } from './types';
import { resolveAccountReturnsData } from './viewData';

interface Props { previewState?: 'results' | 'empty'; results?: AccountReturnsSlot; empty?: AccountReturnsSlot; data?: Awaited<ReturnType<typeof loadAccountReturnsRuntime>> | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnsResultsState'; export const puckLabel = 'Returns Results State'; export const puckCategory = 'Account';
export const puckFields = { previewState: { type: 'select' as const, label: 'Preview State', options: [{ label: 'Return requests', value: 'results' }, { label: 'No return requests', value: 'empty' }] }, results: { type: 'slot' as const, allow: ['ReturnsCardsList'] }, empty: { type: 'slot' as const, allow: ['ReturnsEmptyRegion'] } };
export const puckDefaults = { previewState: 'results', results: [], empty: [] };
export const puckAst = { kind: 'runtime', slots: ['results', 'empty'], sourceJsxNames: ['ReturnsResultsState'], sourceImportPaths: ['@/components/returns/canonical/ReturnsPageSections'], role: 'returns-results-state', slotTarget: 'results', conditional: 'hasReturns ? results : empty', runtimeSignals: ['returns.length'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadAccountReturnsRuntime>[0]) { return loadAccountReturnsRuntime(context); }
export function ReturnsResultsState(props: Props) { const value = resolveAccountReturnsData(props); if (!value) return null; const data = props.puck?.isEditing && props.previewState === 'empty' ? { ...value, returns: [] } : value; return <ReturnsResultsStateRenderer hasReturns={data.returns.length > 0} results={props.results?.(puckTransparentSlotProps)} empty={props.empty?.(puckTransparentSlotProps)} />; }
