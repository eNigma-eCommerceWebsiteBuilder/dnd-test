import { DigitalLibraryAssetsState as DigitalLibraryAssetsStateRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';
import { loadAccountDownloadsRuntime } from './accountDownloadsRuntime';
import { puckTransparentSlotProps, type AccountDownloadsSlot } from './types';
import { resolveAccountDownloadsData } from './viewData';

interface Props { previewState?: 'assets' | 'empty'; assets?: AccountDownloadsSlot; empty?: AccountDownloadsSlot; data?: Awaited<ReturnType<typeof loadAccountDownloadsRuntime>> | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'DigitalLibraryAssetsState'; export const puckLabel = 'Digital Library Assets State'; export const puckCategory = 'Account';
export const puckFields = { previewState: { type: 'select' as const, label: 'Preview State', options: [{ label: 'Library assets', value: 'assets' }, { label: 'Empty library', value: 'empty' }] }, assets: { type: 'slot' as const, allow: ['DigitalLibraryEntriesGrid'] }, empty: { type: 'slot' as const, allow: ['DigitalLibraryEmptyRegion'] } };
export const puckDefaults = { previewState: 'assets', assets: [], empty: [] };
export const puckAst = { kind: 'runtime', slots: ['assets', 'empty'], sourceJsxNames: ['DigitalLibraryAssetsState'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-assets-state', slotTarget: 'assets', conditional: 'entries.length === 0 ? empty : assets', runtimeSignals: ['entries'] };
export async function puckDataFetcher() { return loadAccountDownloadsRuntime(); }
export function DigitalLibraryAssetsState(props: Props) { const value = resolveAccountDownloadsData(props); if (!value) return null; const data = props.puck?.isEditing && props.previewState === 'empty' ? { ...value, entries: [] } : value; return <DigitalLibraryAssetsStateRenderer entries={data.entries} assets={props.assets?.(puckTransparentSlotProps)} empty={props.empty?.(puckTransparentSlotProps)} />; }
