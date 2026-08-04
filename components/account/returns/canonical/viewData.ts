import type { ReturnsPageData } from '@/enigma-components/returns/canonical/returnsPageRuntime';
import { accountReturnsPreview } from './preview';

export interface AccountReturnsRuntimeProps {
    data?: ReturnsPageData | null;
    puck?: { isEditing?: boolean };
}

export function resolveAccountReturnsData({ data = null, puck }: AccountReturnsRuntimeProps): ReturnsPageData | null {
    return puck?.isEditing ? accountReturnsPreview : data;
}
