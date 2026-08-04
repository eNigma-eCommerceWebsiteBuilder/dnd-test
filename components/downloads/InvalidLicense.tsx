import { cn } from '@/lib/utils/cn';

export function InvalidLicense({ licenseKey, className }: { licenseKey: string; className?: string }) {
  return <section className={cn('@container rounded-card border border-danger bg-danger-subtle/40 p-6 shadow-card @md:p-8', className)}><div className="flex flex-col gap-4"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-danger">error</span><h1 className="text-xl font-heading font-bold text-text-base @md:text-2xl">Invalid or Expired License</h1></div><p className="text-sm text-text-muted">We could not validate this license key. Please verify the key or contact support.</p><div className="rounded-card border border-border bg-bg-base px-4 py-3"><p className="text-xs font-semibold uppercase tracking-widest text-text-muted">License Key</p><p className="mt-2 break-all font-mono text-sm text-text-base">{licenseKey}</p></div></div></section>;
}
