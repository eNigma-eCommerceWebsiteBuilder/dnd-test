import { DigitalLibraryMetricsLayout as DigitalLibraryMetricsLayoutRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';
import { puckTransparentSlotProps, type AccountDownloadsSlot } from './types';

interface Props { metrics?: AccountDownloadsSlot; }

export const puckComponentName = 'DigitalLibraryMetricsLayout';
export const puckLabel = 'Digital Library Metrics Layout';
export const puckCategory = 'Account';
export const puckFields = { metrics: { type: 'slot' as const, allow: ['DigitalLibraryDownloadsMetric', 'DigitalLibraryAttentionMetric', 'DigitalLibraryAssetsMetric'] } };
export const puckDefaults = { metrics: [] };
export const puckAst = { kind: 'static', slots: ['metrics'], sourceJsxNames: ['DigitalLibraryMetricsLayout'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-metrics-layout', slotTarget: 'metrics', requiredClasses: ['grid', '@xl:grid-cols-3'] };

export function DigitalLibraryMetricsLayout({ metrics }: Props) { return <DigitalLibraryMetricsLayoutRenderer>{metrics?.(puckTransparentSlotProps)}</DigitalLibraryMetricsLayoutRenderer>; }
