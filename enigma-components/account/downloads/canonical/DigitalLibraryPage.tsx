import { DigitalLibrary } from '@/components/account/downloads/DigitalLibrary';
import type { DigitalLibraryPageData } from './digitalLibraryRuntime';
import { AccountDownloadsPageLayout } from './DigitalLibrarySections';

interface DigitalLibraryPageProps {
    data: DigitalLibraryPageData;
}

export function DigitalLibraryPage({ data }: DigitalLibraryPageProps) {
    return (
        <AccountDownloadsPageLayout>
            <DigitalLibrary currentTimeMs={data.currentTimeMs} entries={data.entries} />
        </AccountDownloadsPageLayout>
    );
}
