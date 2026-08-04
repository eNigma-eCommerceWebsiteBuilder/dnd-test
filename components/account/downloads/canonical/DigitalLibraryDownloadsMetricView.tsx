import { DigitalLibraryDownloadsMetric as DigitalLibraryDownloadsMetricRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';
import { getDigitalLibraryMetrics } from '@/enigma-components/account/downloads/canonical/digitalLibraryRuntime';
import { loadAccountDownloadsRuntime } from './accountDownloadsRuntime';
import { resolveAccountDownloadsData } from './viewData';

interface Props { data?: Awaited<ReturnType<typeof loadAccountDownloadsRuntime>> | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'DigitalLibraryDownloadsMetric'; export const puckLabel = 'Downloads Remaining Metric'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['DigitalLibraryDownloadsMetric'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-downloads-metric', slotTarget: 'metrics', runtimeSignals: ['entries', 'downloadStats'] };
export async function puckDataFetcher() { return loadAccountDownloadsRuntime(); }
export function DigitalLibraryDownloadsMetric(props: Props) { const data = resolveAccountDownloadsData(props); return data ? <DigitalLibraryDownloadsMetricRenderer metrics={getDigitalLibraryMetrics(data)} entriesCount={data.entries.length} /> : null; }
