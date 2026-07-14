import { cn } from '@/lib/utils/cn';

interface DownloadsEmptyViewProps {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export const puckComponentName = 'DownloadsEmpty';
export const puckLabel = 'Downloads Empty State';
export const puckCategory = 'Account';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  message: { type: 'textarea' as const, label: 'Message' },
  ctaLabel: { type: 'text' as const, label: 'CTA Button Label' },
  ctaHref: { type: 'text' as const, label: 'CTA Button Link' },
};

export const puckDefaults = {
  title: 'No Downloads Available',
  message: 'Your digital purchases will appear here once you complete an order with digital items.',
  ctaLabel: 'Browse Digital Products',
  ctaHref: '/products',
};

export function DownloadsEmptyView({ title = '', message = '', ctaLabel = 'Browse Digital Products', ctaHref = '/products', className }: DownloadsEmptyViewProps) {
  return (
    <div className={cn('@container flex flex-col items-center justify-center text-center py-12 @md:py-16', className)}>
      <div className="w-20 h-20 @md:w-24 @md:h-24 rounded-full bg-bg-sunken flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl @md:text-5xl text-text-muted">cloud_off</span>
      </div>
      <h2 className="text-xl @md:text-2xl font-bold text-text-base mb-2">{title}</h2>
      <p className="text-sm @md:text-base text-text-muted mb-6 max-w-md">{message}</p>
      <a href={ctaHref} className="inline-flex items-center gap-2 px-6 @md:px-8 py-3 @md:py-4 bg-primary text-on-primary font-semibold rounded-button hover:bg-primary-dark transition-all shadow-button hover:shadow-button-hover hover:-translate-y-0.5">
        <span className="material-symbols-outlined text-lg @md:text-xl">download</span>
        {ctaLabel}
      </a>
    </div>
  );
}
