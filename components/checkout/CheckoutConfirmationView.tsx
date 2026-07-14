import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface CheckoutConfirmationViewProps {
  title?: string;
  message?: string;
  orderId?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export const puckComponentName = 'CheckoutConfirmation';
export const puckLabel = 'Checkout Confirmation';
export const puckCategory = 'Checkout';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  message: { type: 'textarea' as const, label: 'Message' },
  orderId: { type: 'text' as const, label: 'Order ID' },
  ctaLabel: { type: 'text' as const, label: 'CTA Button Label' },
  ctaHref: { type: 'text' as const, label: 'CTA Button Link' },
};

export const puckDefaults = {
  title: 'Order Confirmed!',
  message: 'Thank you for your order.',
  orderId: 'ORD-12345',
  ctaLabel: 'Continue Shopping',
  ctaHref: '/products',
};

export function CheckoutConfirmationView({
  title = 'Order Confirmed!',
  message = 'Thank you for your order.',
  orderId = '',
  ctaLabel = 'Continue Shopping',
  ctaHref = '/products',
  className,
}: CheckoutConfirmationViewProps) {
  return (
    <section className={cn('py-8 text-center', className)}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-subtle md:mb-6 md:h-20 md:w-20">
        <span className="material-symbols-outlined text-3xl text-success md:text-4xl">
          check_circle
        </span>
      </div>
      <h2 className="mb-2 text-2xl font-bold md:text-3xl">{title}</h2>
      <p className="mb-6 text-text-muted">
        {message} {orderId && <>Your order ID is: {orderId}</>}
      </p>
      <Link
        href={ctaHref}
        className="inline-block rounded-button bg-primary px-6 py-3 font-semibold text-on-primary shadow-button transition-all hover:bg-primary-dark"
      >
        {ctaLabel}
      </Link>
    </section>
  );
}
