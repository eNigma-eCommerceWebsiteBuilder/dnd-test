import { ReturnsCardsList as ReturnsCardsListRenderer } from '@/enigma-components/returns/canonical/ReturnsPageSections';
import { loadAccountReturnsRuntime } from './accountReturnsRuntime';
import { resolveAccountReturnsData } from './viewData';

interface Props { data?: Awaited<ReturnType<typeof loadAccountReturnsRuntime>> | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ReturnsCardsList'; export const puckLabel = 'Return Requests List'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReturnsCardsList', 'ReturnCard', 'CancelReturnButton'], sourceImportPaths: ['@/components/returns/canonical/ReturnsPageSections'], role: 'returns-cards-list', slotTarget: 'results', runtimeSignals: ['returns.map', 'returnRequest.status'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadAccountReturnsRuntime>[0]) { return loadAccountReturnsRuntime(context); }
export function ReturnsCardsList(props: Props) { const data = resolveAccountReturnsData(props); return data ? <ReturnsCardsListRenderer returns={data.returns} /> : null; }
