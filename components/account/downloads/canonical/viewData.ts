import type { DigitalLibraryPageData } from '@/enigma-components/account/downloads/canonical/digitalLibraryRuntime';
import { accountDownloadsPreview } from './preview';

export interface AccountDownloadsRuntimeProps {
    data?: DigitalLibraryPageData | null;
    puck?: { isEditing?: boolean };
}

export function resolveAccountDownloadsData(
    { data = null, puck }: AccountDownloadsRuntimeProps,
): DigitalLibraryPageData | null {
    return puck?.isEditing ? accountDownloadsPreview : data;
}
