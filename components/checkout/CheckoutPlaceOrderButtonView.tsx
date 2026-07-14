import { cn } from '@/lib/utils/cn';

interface CheckoutPlaceOrderButtonViewProps {
  totalAmount?: string;
  isLoading?: string;
  disabled?: string;
  termsText?: string;
  className?: string;
}

export const puckComponentName = 'CheckoutPlaceOrderButton';
export const puckLabel = 'Place Order Button';
export const puckCategory = 'Checkout';

export const puckFields = {
  totalAmount: { type: 'text' as const, label: 'Total Amount (displayed on button)' },
  isLoading: {
    type: 'select' as const,
    label: 'Loading State',
    options: [
      { label: 'No', value: 'false' },
      { label: 'Yes', value: 'true' },
    ],
  },
  disabled: {
    type: 'select' as const,
    label: 'Disabled',
    options: [
      { label: 'No', value: 'false' },
      { label: 'Yes', value: 'true' },
    ],
  },
  termsText: { type: 'textarea' as const, label: 'Terms Text' },
};

export const puckDefaults = {
  totalAmount: '$1,930.00',
  isLoading: 'false',
  disabled: 'false',
  termsText: 'By placing this order, you agree to our Terms of Service and Privacy Policy.',
};

export function CheckoutPlaceOrderButtonView({
  totalAmount = '',
  isLoading = 'false',
  disabled = 'false',
  termsText = 'By placing this order, you agree to our Terms of Service and Privacy Policy.',
  className,
}: CheckoutPlaceOrderButtonViewProps) {
  const isDisabled = disabled === 'true' || isLoading === 'true';

  return (
    <div className={cn('@container w-full', className)}>
      <button
        type="button"
        disabled
        className={cn(
          'w-full py-4 px-6 rounded-button font-bold text-lg shadow-button transition-all flex items-center justify-between',
          isDisabled
            ? 'bg-bg-disabled text-text-disabled cursor-not-allowed shadow-none'
            : 'bg-primary text-on-primary hover:bg-primary-dark hover:shadow-button-hover',
        )}
      >
        <span className="flex items-center gap-2">
          {isLoading === 'true' ? (
            <>
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Place Order</span>
              <span className="material-symbols-outlined">lock</span>
            </>
          )}
        </span>
        {totalAmount && isLoading !== 'true' && (
          <span className="opacity-90">{totalAmount}</span>
        )}
      </button>
      <p className="text-xs text-center text-text-muted mt-3">{termsText}</p>
    </div>
  );
}
