import { getLicenseInfo } from '@/lib/api/services/digital-products';
import type { LicenseInfo } from '@/lib/api/types/digital-products';
import {
  getRouteParam,
  getSearchParam,
  type PuckFetcherContext,
} from '@/lib/puck-route-metadata';

interface DownloadLicenseStateSectionViewProps {
  licenseKey?: string;
  state?: string;
  assetName?: string;
  fileSize?: number;
  downloadsRemaining?: number | null;
  downloadCount?: number;
  expiresAt?: string | null;
}

export const puckComponentName = 'DownloadLicenseStateSection';
export const puckLabel = 'Download License State Section';
export const puckCategory = 'Downloads';

export const puckFields = {
  licenseKey: { type: 'text' as const, label: 'License Key' },
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Valid', value: 'valid' },
      { label: 'Invalid', value: 'invalid' },
    ],
  },
  assetName: { type: 'text' as const, label: 'Asset Name' },
  fileSize: { type: 'number' as const, label: 'File Size' },
  downloadsRemaining: { type: 'number' as const, label: 'Downloads Remaining' },
  downloadCount: { type: 'number' as const, label: 'Download Count' },
  expiresAt: { type: 'text' as const, label: 'Expires At' },
};

export const puckDefaults = {
  licenseKey: '',
  state: 'invalid',
  assetName: 'Digital asset',
  fileSize: 0,
  downloadsRemaining: null,
  downloadCount: 0,
  expiresAt: null,
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  runtimeSignals: ['params.key', 'licenseInfo'],
  matches: [
    { pageIncludes: ['app/downloads/[key]/page.tsx'], component: 'DownloadLicenseStateSection' },
  ],
};

export async function puckDataFetcher(
  props: { licenseKey?: string },
  context?: PuckFetcherContext,
) {
  const licenseKey = props.licenseKey
    || getRouteParam(context, 'key')
    || getSearchParam(context, 'key')
    || getSearchParam(context, 'licenseKey');

  if (!licenseKey) return { state: 'invalid' };

  try {
    const licenseInfo = await getLicenseInfo(licenseKey);
    return {
      licenseKey,
      state: isDownloadable(licenseInfo) ? 'valid' : 'invalid',
      assetName: licenseInfo.assetName,
      fileSize: licenseInfo.fileSize,
      downloadsRemaining: licenseInfo.downloadsRemaining,
      downloadCount: licenseInfo.downloadCount,
      expiresAt: licenseInfo.expiresAt,
    };
  } catch {
    return { state: 'invalid' };
  }
}

export function DownloadLicenseStateSectionView({
  licenseKey = '',
  state = 'invalid',
  assetName = 'Digital asset',
  fileSize = 0,
  downloadsRemaining = null,
  downloadCount = 0,
  expiresAt = null,
}: DownloadLicenseStateSectionViewProps) {
  const valid = state === 'valid';

  return (
    <main className="@container min-h-screen w-full bg-bg-base text-text-base">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 py-8 @sm:px-6 @lg:px-10">
        <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card @md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
            Digital download
          </p>
          <h1 className="mt-4 text-3xl font-heading font-bold text-text-base">
            {valid ? assetName : 'License unavailable'}
          </h1>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            {valid
              ? 'Your digital asset is ready for download. Keep this page open while your download starts.'
              : 'The license key is invalid, expired, revoked, or has no downloads remaining.'}
          </p>

          <div className="mt-6 grid gap-3 text-sm text-text-muted @md:grid-cols-3">
            <InfoCard label="License key" value={licenseKey || 'Missing'} />
            <InfoCard label="File size" value={formatBytes(fileSize)} />
            <InfoCard label="Downloads remaining" value={downloadsRemaining === null ? 'Unlimited' : String(downloadsRemaining)} />
          </div>

          <button
            type="button"
            disabled={!valid}
            className="mt-6 rounded-button bg-primary px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {valid ? 'Download File' : 'Download unavailable'}
          </button>

          <p className="mt-4 text-xs text-text-muted">
            Downloaded {downloadCount} times{expiresAt ? `, expires ${new Date(expiresAt).toLocaleDateString()}` : ''}.
          </p>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-bg-base/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">{label}</p>
      <p className="mt-2 font-semibold text-text-base">{value}</p>
    </div>
  );
}

function isDownloadable(licenseInfo: LicenseInfo): boolean {
  const remaining = licenseInfo.downloadsRemaining;
  const expiresAt = licenseInfo.expiresAt ? new Date(licenseInfo.expiresAt).getTime() : null;
  return licenseInfo.isValid && (remaining === null || remaining > 0) && (!expiresAt || expiresAt > Date.now());
}

function formatBytes(bytes?: number): string {
  if (!Number.isFinite(bytes) || !bytes || bytes <= 0) return 'Unknown size';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}
