import Link from 'next/link';
import type { LicenseInfo } from '@/lib/api/types/digital-products';
import {
  formatLicenseStatus,
  hasDownloadsRemaining,
  isLicenseValid,
} from '@/lib/utils/digital-products';
import { ExpirationNotice } from '@/components/downloads/ExpirationNotice';
import { InvalidLicense } from '@/components/downloads/InvalidLicense';
import { LicenseValidation } from '@/components/downloads/LicenseValidation';
import { DownloadButton } from '@/components/downloads/DownloadButton';
import { LicenseInfoPanel } from '@/components/downloads/LicenseInfoPanel';

export interface DownloadPageProps {
  licenseInfo: LicenseInfo | null;
  licenseKey: string;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return 'Unknown size';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function DownloadPage({ licenseInfo, licenseKey }: DownloadPageProps) {
  const licenseSnapshot = licenseInfo
    ? {
        downloadsRemaining: licenseInfo.downloadsRemaining,
        expiresAt: licenseInfo.expiresAt ?? undefined,
        isValid: licenseInfo.isValid,
        status: licenseInfo.status,
      }
    : null;
  const isValid = isLicenseValid(licenseSnapshot);
  const hasRemaining = hasDownloadsRemaining(licenseSnapshot);
  const statusDisplay = formatLicenseStatus(licenseInfo?.status ?? null);

  return (
    <main className="@container min-h-screen w-full bg-bg-base text-text-base">
      <header className="sticky top-0 z-sticky border-b border-border bg-bg-surface/70 backdrop-blur-nav">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-4 @sm:px-6 @lg:px-12">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-lg font-heading font-bold tracking-[0.4em] text-text-base">
              LUXE
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-text-muted @md:flex">
            <Link className="transition-colors hover:text-primary" href="#">
              Products
            </Link>
            <Link className="border-b-2 border-primary pb-1 text-primary" href="#">
              My Library
            </Link>
            <Link className="transition-colors hover:text-primary" href="#">
              Support
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-card border border-border bg-bg-elevated p-2 text-text-base"
              aria-label="Theme settings"
            >
              <span className="material-symbols-outlined text-base">dark_mode</span>
            </button>
            <div className="size-10 rounded-full border border-primary/20 bg-bg-sunken" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 py-8 @sm:px-6 @lg:px-10">
        <ExpirationNotice licenseInfo={licenseInfo} />

        {!licenseInfo || !isValid || !hasRemaining ? (
          <InvalidLicense licenseKey={licenseKey} />
        ) : (
          <section className="rounded-card border border-border bg-bg-surface shadow-card">
            <div className="flex flex-col @lg:flex-row">
              <div
                className="aspect-square w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_rgba(0,0,0,0.2))] bg-cover bg-center @lg:w-1/3"
                aria-hidden="true"
              />
              <div className="flex w-full flex-col justify-between gap-6 p-6 @md:p-8 @lg:w-2/3">
                <div>
                  <LicenseValidation licenseInfo={licenseInfo} />
                  <h1 className="mt-4 text-2xl font-heading font-bold text-text-base @md:text-3xl">
                    {licenseInfo.assetName}
                  </h1>
                  <p className="mt-3 text-sm text-text-muted">
                    Your digital asset is ready for download. Keep this page open while your download starts.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">database</span>
                      {formatBytes(licenseInfo.fileSize)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">verified_user</span>
                      License status: {statusDisplay.label}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <DownloadButton licenseKey={licenseKey} />
                </div>
              </div>
            </div>
          </section>
        )}

        <LicenseInfoPanel
          initialLicenseInfo={licenseInfo}
          licenseKey={licenseKey}
        />

        <section className="border-t border-divider pt-10 pb-14">
          <div className="grid gap-8 text-center @md:grid-cols-4">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">security</span>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-base">
                Secure Server
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">verified</span>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-base">
                Verified License
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">headset_mic</span>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-base">
                24/7 Support
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">cloud_done</span>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-base">
                Lifetime Sync
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-6 text-sm text-text-muted @md:flex-row">
            <div className="flex flex-wrap items-center gap-6">
              <Link className="transition-colors hover:text-primary" href="#">
                Help Center
              </Link>
              <Link className="transition-colors hover:text-primary" href="#">
                Installation Guide
              </Link>
              <Link className="transition-colors hover:text-primary" href="#">
                Terms of Service
              </Link>
            </div>
            <p>(c) 2026 LUXE Digital Collective. All rights reserved.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
