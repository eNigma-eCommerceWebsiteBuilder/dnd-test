import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface ContinueShoppingButtonViewProps {
  label?: string;
  href?: string;
  className?: string;
}

export const puckComponentName = 'CartContinueShopping';
export const puckLabel = 'Continue Shopping Button';
export const puckCategory = 'Cart';

export const puckFields = {
  label: { type: 'text' as const, label: 'Button Label' },
  href: { type: 'text' as const, label: 'Link URL' },
};

export const puckDefaults = {
  label: 'Continue Shopping',
  href: '/products',
};

export function CartContinueShoppingView({
  label = 'Continue Shopping',
  href = '/products',
  className,
}: ContinueShoppingButtonViewProps) {
  return (
    <div className={cn('@container w-full', className)}>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-xs @sm:text-sm font-bold text-primary hover:gap-3 transition-all"
      >
        <span className="material-symbols-outlined text-base @sm:text-lg">arrow_back</span>
        <span>{label}</span>
      </Link>
    </div>
  );
}
