import { DigitalLibraryAttentionMetric as DigitalLibraryAttentionMetricRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';
import { getDigitalLibraryMetrics } from '@/enigma-components/account/downloads/canonical/digitalLibraryRuntime';
import { loadAccountDownloadsRuntime } from './accountDownloadsRuntime';
import { resolveAccountDownloadsData } from './viewData';

interface Props { data?: Awaited<ReturnType<typeof loadAccountDownloadsRuntime>> | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'DigitalLibraryAttentionMetric'; export const puckLabel = 'Digital Library Attention Metric'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['DigitalLibraryAttentionMetric'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-attention-metric', slotTarget: 'metrics', runtimeSignals: ['entries', 'licenseInfo.expiresAt'] };
export async function puckDataFetcher() { return loadAccountDownloadsRuntime(); }
export function DigitalLibraryAttentionMetric(props: Props) { const data = resolveAccountDownloadsData(props); return data ? <DigitalLibraryAttentionMetricRenderer metrics={getDigitalLibraryMetrics(data)} entriesCount={data.entries.length} /> : null; }
