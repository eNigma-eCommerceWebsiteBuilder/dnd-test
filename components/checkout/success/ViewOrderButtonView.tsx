import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface ViewOrderButtonViewProps {
  buttonText: string;
  orderId: string;
  className?: string;
}

export const puckComponentName = 'ViewOrderButton';
export const puckLabel = 'View Order Button';
export const puckCategory = 'Checkout';

export const puckFields = {
  buttonText: { type: 'text' as const, label: 'Button Text' },
  orderId: { type: 'text' as const, label: 'Order ID' },
};

export const puckDefaults = {
  buttonText: 'View Detailed Order',
  orderId: 'order-001',
};


export function ViewOrderButtonView({ buttonText, orderId, className }: ViewOrderButtonViewProps) {
  return (
    <div className={cn('@container w-full', className)}>
      <Link
        href={`/account/orders/${orderId}`}
        className={cn(
          'inline-flex w-full items-center justify-center @sm:w-auto',
          'px-8 py-3 @sm:px-10 @sm:py-4',
          'rounded-button bg-cta-primary text-on-primary',
          'text-sm font-semibold shadow-button',
          'transition-all duration-normal text-center',
          'hover:-translate-y-0.5 hover:bg-cta-primary-hover hover:shadow-button-hover',
        )}
      >
        {buttonText}
      </Link>
    </div>
  );
}
