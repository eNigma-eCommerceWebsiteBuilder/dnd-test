'use client';

import { useMemo } from 'react';
import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { useLicenseInfo } from '@/lib/hooks/digital-products/useLicenseInfo';
import { formatLicenseStatus } from '@/lib/utils/digital-products';

function formatDate(value?: string | null): string {
  if (!value) return 'No expiration';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'No expiration' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function LicenseInfoPanel({ licenseKey, initialLicenseInfo }: { licenseKey: string; initialLicenseInfo: LicenseInfo | null }) {
  const { licenseInfo, loading, error, loadLicenseInfo } = useLicenseInfo();
  const displayInfo = licenseInfo ?? initialLicenseInfo;
  const isMissingKey = !licenseKey;
  const statusDisplay = useMemo(() => formatLicenseStatus(displayInfo?.status ?? null), [displayInfo]);
  const downloadsRemaining = useMemo(() => !displayInfo ? 'Unavailable' : displayInfo.downloadsRemaining === null ? 'Unlimited' : displayInfo.downloadsRemaining.toString(), [displayInfo]);
  const expirationDate = useMemo(() => !displayInfo ? 'Unavailable' : formatDate(displayInfo.expiresAt), [displayInfo]);
  return <section className="@container"><div className="mb-6 flex flex-col gap-3 @md:flex-row @md:items-center @md:justify-between"><h2 className="flex items-center gap-2 text-lg font-heading font-bold text-heading"><span className="material-symbols-outlined text-primary">license</span>License Information</h2><button type="button" onClick={() => loadLicenseInfo(licenseKey)} className="inline-flex items-center gap-2 rounded-button border border-border bg-bg-elevated px-4 py-2 text-xs font-semibold uppercase tracking-widest text-text-base transition-colors hover:bg-bg-hover disabled:opacity-disabled" disabled={loading || isMissingKey} aria-label="Refresh license status"><span className="material-symbols-outlined text-base">refresh</span>{loading ? 'Refreshing' : 'Refresh Status'}</button></div>{isMissingKey && <p className="mb-4 text-sm text-danger" role="status" aria-live="polite">License key is missing. Refresh is unavailable.</p>}{error && <p className="mb-4 text-sm text-danger" role="status" aria-live="polite">{error}</p>}<div className="grid gap-4 @md:grid-cols-3"><InfoCard label="Status" value={statusDisplay.label} pulse /><InfoCard label="Downloads Remaining" value={downloadsRemaining} /><InfoCard label="Expiration Date" value={expirationDate} /></div><div className="mt-4 rounded-card border border-border bg-bg-surface p-5"><div className="flex flex-col gap-4 @md:flex-row @md:items-center @md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-text-muted">License Key</p><code className="mt-2 inline-block rounded-card bg-bg-base px-3 py-2 text-sm font-mono text-text-base">{licenseKey}</code></div><button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-primary" aria-label="Copy license key"><span className="material-symbols-outlined text-base">content_copy</span>Copy Key</button></div></div></section>;
}

function InfoCard({ label, value, pulse = false }: { label: string; value: string; pulse?: boolean }) {
  return <div className="rounded-card border border-border bg-bg-surface p-5"><p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{label}</p><p className="mt-2 flex items-center gap-2 text-lg font-bold text-text-base">{value}{pulse && <span className="size-2 rounded-full bg-primary animate-pulse" />}</p></div>;
}
