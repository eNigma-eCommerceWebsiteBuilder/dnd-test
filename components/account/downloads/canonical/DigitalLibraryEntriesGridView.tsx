import { DigitalLibraryEntriesGrid as DigitalLibraryEntriesGridRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';
import { loadAccountDownloadsRuntime } from './accountDownloadsRuntime';
import { resolveAccountDownloadsData } from './viewData';

interface Props { data?: Awaited<ReturnType<typeof loadAccountDownloadsRuntime>> | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'DigitalLibraryEntriesGrid'; export const puckLabel = 'Digital Library Asset Grid'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['DigitalLibraryEntriesGrid', 'DigitalProductCard'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-entries-grid', slotTarget: 'assets', runtimeSignals: ['entries.map', 'licenseInfo', 'downloadStats'] };
export async function puckDataFetcher() { return loadAccountDownloadsRuntime(); }
export function DigitalLibraryEntriesGrid(props: Props) { const data = resolveAccountDownloadsData(props); return data ? <DigitalLibraryEntriesGridRenderer entries={data.entries} /> : null; }
