export enum LicenseStatusCode {
    ACTIVE = 'active',
    REVOKED = 'revoked',
    EXPIRED = 'expired',
}

export type LicenseStatus = `${LicenseStatusCode}`;

export interface LicenseInfo {
    assetName: string;
    fileSize: number;
    mimeType: string;
    status: LicenseStatus;
    downloadsRemaining: number | null;
    downloadCount: number;
    expiresAt: string | null;
    createdAt: string;
    lastAccessedAt: string | null;
    isValid: boolean;
}

export interface DownloadStats {
    downloadCount: number;
    downloadsRemaining: number | null;
    lastAccessedAt: string | null;
    accessLogCount: number;
}

export interface LicenseInfoResponse {
    success: boolean;
    data: LicenseInfo;
}

export interface DownloadStatsResponse {
    success: boolean;
    data: DownloadStats;
}

export interface DownloadRedirectInfo {
    isRedirect: true;
    downloadUrl: string;
}
