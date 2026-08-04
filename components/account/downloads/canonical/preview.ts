import { LicenseStatusCode, type DownloadStats, type LicenseInfo } from '@/lib/api/types/digital-products';
import type { DigitalLibraryPageData } from '@/enigma-components/account/downloads/canonical/digitalLibraryRuntime';

const licenseInfo: LicenseInfo = {
    assetName: 'Professional Texture Library',
    fileSize: 52428800,
    mimeType: 'application/zip',
    status: LicenseStatusCode.ACTIVE,
    downloadsRemaining: 4,
    downloadCount: 1,
    expiresAt: '2030-01-01T00:00:00.000Z',
    createdAt: '2026-07-01T00:00:00.000Z',
    lastAccessedAt: '2026-07-12T00:00:00.000Z',
    isValid: true,
};

const downloadStats: DownloadStats = {
    downloadCount: 1,
    downloadsRemaining: 4,
    lastAccessedAt: '2026-07-12T00:00:00.000Z',
    accessLogCount: 1,
};

export const accountDownloadsPreview: DigitalLibraryPageData = {
    currentTimeMs: new Date('2026-07-27T00:00:00.000Z').getTime(),
    entries: [
        {
            licenseKey: 'PREVIEW-DIGITAL-ASSET-001',
            licenseInfo,
            downloadStats,
            downloadLimit: 5,
        },
    ],
};
