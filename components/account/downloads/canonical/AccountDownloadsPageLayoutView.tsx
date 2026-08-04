import { AccountDownloadsPageLayout as AccountDownloadsPageLayoutRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';
import { puckTransparentSlotProps, type AccountDownloadsSlot } from './types';

interface Props { content?: AccountDownloadsSlot; }

export const puckComponentName = 'AccountDownloadsPageLayout';
export const puckLabel = 'Account Downloads Page Layout';
export const puckCategory = 'Account';
export const puckFields = { content: { type: 'slot' as const, allow: ['DigitalLibraryLayout'] } };
export const puckDefaults = { content: [] };
export const puckAst = { kind: 'static', topLevel: true, slots: ['content'], sourceJsxNames: ['AccountDownloadsPageLayout'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'account-downloads-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'md:py-12'] };

export function AccountDownloadsPageLayout({ content }: Props) {
    return <AccountDownloadsPageLayoutRenderer>{content?.(puckTransparentSlotProps)}</AccountDownloadsPageLayoutRenderer>;
}
