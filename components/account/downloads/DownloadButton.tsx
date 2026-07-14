'use client';

import { useEffect, useMemo } from 'react';
import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { useDigitalDownload, useLicenseInfo } from '@/lib/hooks';
import { formatDownloadsRemaining, getExpiryInfo, hasDownloadsRemaining, isLicenseValid } from '@/lib/utils/digital-products';

interface DownloadButtonProps {
    licenseKey: string;
    initialLicenseInfo: LicenseInfo;
    downloadLimit: number | null;
}

export function DownloadButton({ licenseKey, initialLicenseInfo, downloadLimit }: DownloadButtonProps) {
    const {
        licenseInfo,
        loading,
        loadLicenseInfo,
        error: licenseError,
        clearError: clearLicenseError,
    } = useLicenseInfo();
    const {
        downloading,
        download,
        error: downloadError,
        clearError: clearDownloadError,
    } = useDigitalDownload();

    useEffect(() => {
        loadLicenseInfo(licenseKey);
    }, [licenseKey, loadLicenseInfo]);

    const activeLicense = licenseInfo ?? initialLicenseInfo;
    const licenseSnapshot = useMemo(() => ({
        isValid: activeLicense.isValid,
        status: activeLicense.status,
        downloadsRemaining: activeLicense.downloadsRemaining,
        downloadLimit,
        expiresAt: activeLicense.expiresAt ?? undefined,
    }), [activeLicense, downloadLimit]);

    const expiryInfo = getExpiryInfo(licenseSnapshot);
    const canDownload = isLicenseValid(licenseSnapshot) && hasDownloadsRemaining(licenseSnapshot) && !expiryInfo.isExpired;

    const helperText = formatDownloadsRemaining(licenseSnapshot);
    const errorMessage = downloadError || licenseError;

    const handleDownload = async () => {
        clearDownloadError();
        clearLicenseError();
        await download(licenseKey);
    };

    const label = downloading ? 'Preparing download...' : 'Download';

    return (
        <div className="@container w-full space-y-2">
            <button
                type="button"
                onClick={handleDownload}
                className="w-full rounded-button bg-cta-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-button transition hover:bg-cta-primary-hover disabled:opacity-60"
                disabled={!canDownload || downloading || loading}
            >
                {label}
            </button>
            <p className="text-xs text-text-muted">{helperText}</p>
            {errorMessage ? (
                <p className="text-xs text-danger" role="status">
                    {errorMessage}
                </p>
            ) : null}
        </div>
    );
}
