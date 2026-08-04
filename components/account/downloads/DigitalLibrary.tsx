import type { DigitalLibraryEntry } from '@/enigma-components/account/downloads/canonical/digitalLibraryRuntime';
import {
    DigitalLibraryAssetsMetric,
    DigitalLibraryAssetsState,
    DigitalLibraryAttentionMetric,
    DigitalLibraryBackground,
    DigitalLibraryDownloadsMetric,
    DigitalLibraryEmptyRegion,
    DigitalLibraryEntriesGrid,
    DigitalLibraryHeader,
    DigitalLibraryHistoryRegion,
    DigitalLibraryLayout,
    DigitalLibraryMetricsLayout,
} from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';
import { getDigitalLibraryMetrics } from '@/enigma-components/account/downloads/canonical/digitalLibraryRuntime';

interface DigitalLibraryProps {
    currentTimeMs: number;
    entries: DigitalLibraryEntry[];
}

export function DigitalLibrary({ currentTimeMs, entries }: DigitalLibraryProps) {
    return (
        <DigitalLibraryLayout
            header={<DigitalLibraryHeader />}
            metrics={
                <DigitalLibraryMetricsLayout>
                    <DigitalLibraryDownloadsMetric metrics={getDigitalLibraryMetrics({ currentTimeMs, entries })} entriesCount={entries.length} />
                    <DigitalLibraryAttentionMetric metrics={getDigitalLibraryMetrics({ currentTimeMs, entries })} entriesCount={entries.length} />
                    <DigitalLibraryAssetsMetric entriesCount={entries.length} />
                </DigitalLibraryMetricsLayout>
            }
            assets={
                <DigitalLibraryAssetsState
                    entries={entries}
                    assets={<DigitalLibraryEntriesGrid entries={entries} />}
                    empty={<DigitalLibraryEmptyRegion />}
                />
            }
            history={<DigitalLibraryHistoryRegion entries={entries} />}
            background={<DigitalLibraryBackground />}
        />
    );
}
