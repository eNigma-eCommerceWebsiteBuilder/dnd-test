'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useDigitalDownload } from '@/lib/hooks/digital-products/useDigitalDownload';
import { DownloadProgress } from './DownloadProgress';

export function DownloadButton({ licenseKey, disabled = false }: { licenseKey: string; disabled?: boolean }) {
  const { download, downloading, error, clearError } = useDigitalDownload();
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const isMissingKey = !licenseKey;
  const isDisabled = disabled || downloading || isMissingKey;

  useEffect(() => {
    if (!downloading) {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = window.setInterval(() => setProgress((current) => current >= 90 ? current : current + Math.max(1, Math.floor((90 - current) / 10))), 400);
    return () => { if (intervalRef.current !== null) window.clearInterval(intervalRef.current); };
  }, [downloading]);

  const handleDownload = async () => {
    if (isDisabled) return;
    clearError();
    setStarted(true);
    setProgress(5);
    try { await download(licenseKey); setProgress(100); } catch { /* The hook supplies the error state. */ }
  };

  const displayProgress = useMemo(() => error && started ? 0 : !downloading && started && !error ? 100 : progress, [downloading, error, progress, started]);
  const statusLabel = useMemo(() => isMissingKey ? 'License key required' : error ? 'Download failed' : downloading ? 'Starting download...' : started ? 'Preparing download...' : 'Ready to download', [downloading, error, isMissingKey, started]);
  const detailLabel = useMemo(() => isMissingKey ? 'Status: Missing license key' : error || (downloading ? 'Status: Initializing connection' : started ? 'Status: Preparing your file' : 'Status: Awaiting download'), [downloading, error, isMissingKey, started]);
  const etaLabel = useMemo(() => isMissingKey ? 'Estimated time: --' : error ? 'Estimated time: N/A' : downloading || started ? 'Estimated time: 2 mins' : 'Estimated time: --', [downloading, error, isMissingKey, started]);

  return <div className="@container flex flex-col gap-4"><button type="button" onClick={handleDownload} disabled={isDisabled} className="w-full rounded-button bg-cta-primary py-4 text-sm font-semibold text-on-primary shadow-button transition-colors hover:bg-cta-primary-hover focus-visible:shadow-focus disabled:opacity-disabled" aria-label="Download digital product"><span className="inline-flex items-center justify-center gap-2"><span className="material-symbols-outlined text-base">download</span>Download Now</span></button>{(started || downloading || error || isMissingKey) ? <DownloadProgress progress={displayProgress} statusLabel={statusLabel} detailLabel={detailLabel} etaLabel={etaLabel} errorMessage={error} /> : <div className="rounded-card border border-border bg-bg-base p-4" role="status" aria-live="polite"><p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Download status</p><p className="mt-2 text-sm text-text-muted">Ready to start when you click download.</p></div>}</div>;
}
