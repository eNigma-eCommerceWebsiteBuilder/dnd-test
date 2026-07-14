import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface CartEmptyViewProps {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export const puckComponentName = 'CartEmpty';
export const puckLabel = 'Cart Empty State';
export const puckCategory = 'Cart';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  message: { type: 'textarea' as const, label: 'Message' },
  ctaLabel: { type: 'text' as const, label: 'CTA Button Label' },
  ctaHref: { type: 'text' as const, label: 'CTA Button Link' },
};

export const puckDefaults = {
  title: 'Your Bag is Empty',
  message: "Looks like you haven't added anything to your bag yet. Start shopping to fill it up!",
  ctaLabel: 'Start Shopping',
  ctaHref: '/products',
};

export function CartEmptyView({
  title = 'Your Bag is Empty',
  message = "Looks like you haven't added anything to your bag yet. Start shopping to fill it up!",
  ctaLabel = 'Start Shopping',
  ctaHref = '/products',
  className,
}: CartEmptyViewProps) {
  return (
    <div className={cn(
      '@container flex flex-col items-center justify-center text-center py-12 @sm:py-16 @md:py-20 px-4 @sm:px-6',
      className
    )}>
      <div className="w-20 h-20 @sm:w-24 @sm:h-24 @md:w-28 @md:h-28 rounded-full bg-bg-sunken flex items-center justify-center mb-6 @sm:mb-8">
        <span className="material-symbols-outlined text-4xl @sm:text-5xl @md:text-6xl text-text-muted">
          shopping_cart
        </span>
      </div>
      <h2 className="text-xl @sm:text-2xl @md:text-3xl font-bold text-text-base mb-2 @sm:mb-3">
        {title}
      </h2>
      <p className="text-sm @sm:text-base text-text-muted mb-6 @sm:mb-8 max-w-md">
        {message}
      </p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 px-6 @sm:px-8 py-3 @sm:py-4 bg-primary text-on-primary font-semibold rounded-button hover:bg-primary-dark transition-all shadow-button hover:shadow-button-hover hover:-translate-y-0.5"
      >
        <span className="material-symbols-outlined text-lg @sm:text-xl">
          storefront
        </span>
        {ctaLabel}
      </Link>
    </div>
  );
}
