import { DigitalLibraryLayout as DigitalLibraryLayoutRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';
import { puckTransparentSlotProps, type AccountDownloadsSlot } from './types';

interface Props { header?: AccountDownloadsSlot; metrics?: AccountDownloadsSlot; assets?: AccountDownloadsSlot; history?: AccountDownloadsSlot; background?: AccountDownloadsSlot; }

export const puckComponentName = 'DigitalLibraryLayout';
export const puckLabel = 'Digital Library Layout';
export const puckCategory = 'Account';
export const puckFields = { header: { type: 'slot' as const, allow: ['DigitalLibraryHeader'] }, metrics: { type: 'slot' as const, allow: ['DigitalLibraryMetricsLayout'] }, assets: { type: 'slot' as const, allow: ['DigitalLibraryAssetsState'] }, history: { type: 'slot' as const, allow: ['DigitalLibraryHistoryRegion'] }, background: { type: 'slot' as const, allow: ['DigitalLibraryBackground'] } };
export const puckDefaults = { header: [], metrics: [], assets: [], history: [], background: [] };
export const puckAst = { kind: 'static', slots: ['header', 'metrics', 'assets', 'history', 'background'], sourceJsxNames: ['DigitalLibraryLayout'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-layout', requiredClasses: ['@container', 'relative', 'space-y-8'] };

export function DigitalLibraryLayout({ header, metrics, assets, history, background }: Props) {
    return <DigitalLibraryLayoutRenderer header={header?.(puckTransparentSlotProps)} metrics={metrics?.(puckTransparentSlotProps)} assets={assets?.(puckTransparentSlotProps)} history={history?.(puckTransparentSlotProps)} background={background?.(puckTransparentSlotProps)} />;
}
