'use client';

export function DownloadProgress({ progress, statusLabel, detailLabel, etaLabel, errorMessage }: { progress: number; statusLabel: string; detailLabel: string; etaLabel: string; errorMessage?: string | null }) {
  const clampedProgress = Math.min(Math.max(Number.isFinite(progress) ? progress : 0, 0), 100);
  const displayStatus = errorMessage ? 'Download failed' : statusLabel;
  const displayDetail = errorMessage || detailLabel;
  return <div className="@container flex flex-col gap-3" role="status" aria-live="polite"><div className="flex items-end justify-between"><span className={`text-sm font-medium ${errorMessage ? 'text-danger' : 'text-text-muted'}`}>{displayStatus}</span><span className="text-sm font-semibold text-primary">{Math.round(clampedProgress)}%</span></div><div className="h-2 w-full overflow-hidden rounded-full bg-bg-sunken" role="progressbar" aria-valuenow={Math.round(clampedProgress)} aria-valuemin={0} aria-valuemax={100} aria-label="Download progress"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${clampedProgress}%` }} /></div><div className="flex items-center justify-between text-xs text-text-muted"><span>{displayDetail}</span><span className="italic">{etaLabel}</span></div></div>;
}
