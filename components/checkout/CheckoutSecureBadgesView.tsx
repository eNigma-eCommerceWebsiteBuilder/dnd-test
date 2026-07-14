import { cn } from '@/lib/utils/cn';

interface CheckoutSecureBadgesViewProps {
  variant?: 'simple' | 'detailed';
  className?: string;
}

export const puckComponentName = 'CheckoutSecureBadges';
export const puckLabel = 'Secure Checkout Badges';
export const puckCategory = 'Checkout';

export const puckFields = {
  variant: {
    type: 'select' as const,
    label: 'Variant',
    options: [
      { label: 'Simple (payment icons)', value: 'simple' },
      { label: 'Detailed (SSL info)', value: 'detailed' },
    ],
  },
};

export const puckDefaults = {
  variant: 'simple',
};

export function CheckoutSecureBadgesView({ variant = 'simple', className }: CheckoutSecureBadgesViewProps) {
  if (variant === 'detailed') {
    return (
      <div className={cn('@container w-full space-y-4', className)}>
        <div className="flex flex-col @sm:flex-row gap-4 p-4 bg-bg-surface border border-border rounded-card">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-success text-2xl">lock</span>
            <div>
              <p className="font-semibold text-sm text-text-base">Secure SSL Encryption</p>
              <p className="text-xs text-text-muted">Your transaction is protected with 256-bit SSL encryption.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('@container w-full', className)}>
      <div className="flex flex-wrap items-center justify-center gap-3 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
        <div className="h-6 w-10 bg-bg-skeleton rounded flex items-center justify-center text-[8px] font-bold text-text-muted border border-border">VISA</div>
        <div className="h-6 w-10 bg-bg-skeleton rounded flex items-center justify-center text-[8px] font-bold text-text-muted border border-border">MC</div>
        <div className="h-6 w-10 bg-bg-skeleton rounded flex items-center justify-center text-[8px] font-bold text-text-muted border border-border">AMEX</div>
        <div className="h-6 w-10 bg-bg-skeleton rounded flex items-center justify-center text-[8px] font-bold text-text-muted border border-border">PAYPAL</div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-muted">
        <span className="material-symbols-outlined text-[14px]">lock</span>
        <span>Guaranteed Safe Checkout</span>
      </div>
    </div>
  );
}
