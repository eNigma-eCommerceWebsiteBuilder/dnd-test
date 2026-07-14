import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface ContinueShoppingButtonViewProps {
  buttonText: string;
  href: string;
  className?: string;
}

export const puckComponentName = 'ContinueShoppingButton';
export const puckLabel = 'Continue Shopping Button';
export const puckCategory = 'Checkout';

export const puckFields = {
  buttonText: { type: 'text' as const, label: 'Button Text' },
  href: { type: 'text' as const, label: 'Link URL' },
};

export const puckDefaults = {
  buttonText: 'Continue Shopping',
  href: '/products',
};


export function ContinueShoppingButtonView({ buttonText = 'Continue Shopping', href = '/products', className }: ContinueShoppingButtonViewProps) {
  return (
    <div className={cn('@container w-full', className)}>
      <Link
        href={href}
        className={cn(
          'inline-flex w-full items-center justify-center @sm:w-auto',
          'px-8 py-3 @sm:px-10 @sm:py-4',
          'rounded-button border border-border bg-bg-surface',
          'text-sm font-semibold text-text-base',
          'transition-all duration-normal text-center',
          'hover:border-border-hover hover:bg-bg-hover hover:-translate-y-0.5',
        )}
      >
        {buttonText}
      </Link>
    </div>
  );
}
