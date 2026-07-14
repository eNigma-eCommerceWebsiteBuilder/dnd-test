import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface OrderEmptyViewProps {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export const puckComponentName = 'OrderEmpty';
export const puckLabel = 'Order Empty State';
export const puckCategory = 'Account';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  message: { type: 'textarea' as const, label: 'Message' },
  ctaLabel: { type: 'text' as const, label: 'CTA Button Label' },
  ctaHref: { type: 'text' as const, label: 'CTA Button Link' },
};

export const puckDefaults = {
  title: 'No Orders Yet',
  message: "When you place an order, it will appear here so you can track its status, review details, and request returns if needed.",
  ctaLabel: 'Start Shopping',
  ctaHref: '/products',
};

export function OrderEmptyView({
  title = 'No Orders Yet',
  message = '',
  ctaLabel = 'Start Shopping',
  ctaHref = '/products',
  className,
}: OrderEmptyViewProps) {
  return (
    <div className={cn('@container flex flex-col items-center justify-center text-center py-12 @md:py-16 @lg:py-20', className)}>
      <div className="w-20 h-20 @md:w-24 @md:h-24 rounded-full bg-bg-sunken flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl @md:text-5xl text-text-muted">receipt_long</span>
      </div>
      <h2 className="text-xl @md:text-2xl font-bold text-text-base mb-2">{title}</h2>
      <p className="text-sm @md:text-base text-text-muted mb-6 @md:mb-8 max-w-md">{message}</p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 px-6 @md:px-8 py-3 @md:py-4 bg-primary text-on-primary font-semibold rounded-button hover:bg-primary-dark transition-all shadow-button hover:shadow-button-hover hover:-translate-y-0.5"
      >
        <span className="material-symbols-outlined text-lg @md:text-xl">shopping_bag</span>
        {ctaLabel}
      </Link>
    </div>
  );
}
