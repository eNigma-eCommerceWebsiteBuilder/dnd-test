import { cn } from '@/lib/utils/cn';

interface SubscriptionsEmptyViewProps {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export const puckComponentName = 'SubscriptionsEmpty';
export const puckLabel = 'Subscriptions Empty State';
export const puckCategory = 'Account';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  message: { type: 'textarea' as const, label: 'Message' },
  ctaLabel: { type: 'text' as const, label: 'CTA Button Label' },
  ctaHref: { type: 'text' as const, label: 'CTA Button Link' },
};

export const puckDefaults = {
  title: 'No Subscriptions',
  message: 'Subscribe to your favorite products and have them delivered on your schedule.',
  ctaLabel: 'Browse Products',
  ctaHref: '/products',
};

export function SubscriptionsEmptyView({ title = '', message = '', ctaLabel = 'Browse Products', ctaHref = '/products', className }: SubscriptionsEmptyViewProps) {
  return (
    <div className={cn('@container flex flex-col items-center justify-center text-center py-12 @md:py-16', className)}>
      <div className="w-20 h-20 @md:w-24 @md:h-24 rounded-full bg-bg-sunken flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl @md:text-5xl text-text-muted">autorenew</span>
      </div>
      <h2 className="text-xl @md:text-2xl font-bold text-text-base mb-2">{title}</h2>
      <p className="text-sm @md:text-base text-text-muted mb-6 max-w-md">{message}</p>
      <a href={ctaHref} className="inline-flex items-center gap-2 px-6 @md:px-8 py-3 @md:py-4 bg-primary text-on-primary font-semibold rounded-button hover:bg-primary-dark transition-all shadow-button hover:shadow-button-hover hover:-translate-y-0.5">
        <span className="material-symbols-outlined text-lg @md:text-xl">shopping_bag</span>
        {ctaLabel}
      </a>
    </div>
  );
}
