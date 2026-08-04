import { DigitalLibraryAssetsMetric as DigitalLibraryAssetsMetricRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';
import { loadAccountDownloadsRuntime } from './accountDownloadsRuntime';
import { resolveAccountDownloadsData } from './viewData';

interface Props { data?: Awaited<ReturnType<typeof loadAccountDownloadsRuntime>> | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'DigitalLibraryAssetsMetric'; export const puckLabel = 'Digital Library Assets Metric'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['DigitalLibraryAssetsMetric'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-assets-metric', slotTarget: 'metrics', runtimeSignals: ['entries'] };
export async function puckDataFetcher() { return loadAccountDownloadsRuntime(); }
export function DigitalLibraryAssetsMetric(props: Props) { const data = resolveAccountDownloadsData(props); return data ? <DigitalLibraryAssetsMetricRenderer entriesCount={data.entries.length} /> : null; }
