/**
 * Digital Products Hooks - Type Definitions
 */

import type { LicenseInfo, DownloadStats } from '@/lib/api/types/digital-products';

/**
 * Return type for useLicenseInfo hook
 */
export interface UseLicenseInfoReturn {
    /** License information */
    licenseInfo: LicenseInfo | null;
    /** Loading state */
    loading: boolean;
    /** Error message if any */
    error: string | null;
    /** Load license info by key */
    loadLicenseInfo: (licenseKey: string) => Promise<void>;
    /** Refresh current license info */
    refresh: () => Promise<void>;
    /** Clear error state */
    clearError: () => void;
    /** Check if license is valid for download */
    canDownload: boolean;
}

/**
 * Return type for useDownloadStats hook
 */
export interface UseDownloadStatsReturn {
    /** Download statistics */
    stats: DownloadStats | null;
    /** Loading state */
    loading: boolean;
    /** Error message if any */
    error: string | null;
    /** Load stats by license key */
    loadStats: (licenseKey: string) => Promise<void>;
    /** Refresh current stats */
    refresh: () => Promise<void>;
    /** Clear error state */
    clearError: () => void;
}

/**
 * Return type for useDigitalDownload hook
 */
export interface UseDigitalDownloadReturn {
    /** Download in progress */
    downloading: boolean;
    /** Error message if any */
    error: string | null;
    /** Initiate download with validation */
    download: (licenseKey: string) => Promise<void>;
    /** Get download URL without initiating download */
    getUrl: (licenseKey: string) => string;
    /** Clear error state */
    clearError: () => void;
}
