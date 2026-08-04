import { DigitalLibraryHistoryRegion as DigitalLibraryHistoryRegionRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';
import { loadAccountDownloadsRuntime } from './accountDownloadsRuntime';
import { resolveAccountDownloadsData } from './viewData';

interface Props { data?: Awaited<ReturnType<typeof loadAccountDownloadsRuntime>> | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'DigitalLibraryHistoryRegion'; export const puckLabel = 'Digital Library History'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['DigitalLibraryHistoryRegion', 'DownloadHistory'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-history-region', slotTarget: 'history', runtimeSignals: ['entries', 'downloadStats'] };
export async function puckDataFetcher() { return loadAccountDownloadsRuntime(); }
export function DigitalLibraryHistoryRegion(props: Props) { const data = resolveAccountDownloadsData(props); return data ? <DigitalLibraryHistoryRegionRenderer entries={data.entries} /> : null; }
