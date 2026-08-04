import { cache } from 'react';
import {
    fetchDigitalLibraryPageData,
    type DigitalLibraryPageData,
} from '@/enigma-components/account/downloads/canonical/digitalLibraryRuntime';

// Every runtime region shares one request-scoped production loader.
export const loadAccountDownloadsRuntime = cache(
    async (): Promise<DigitalLibraryPageData> => fetchDigitalLibraryPageData(),
);
