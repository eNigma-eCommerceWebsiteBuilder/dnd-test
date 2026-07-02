'use client';

import { cn } from '@/lib/utils/cn';
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector';
import { CHECKOUT_PAYMENT_METHODS } from './checkoutPageUtils';

interface CheckoutPaymentStepProps {
  contactEmail: string;
  emailError?: string | null;
  isLoading?: boolean;
  paymentMethodId: string;
  onBack: () => void;
  onContactEmailChange: (value: string) => void;
  onContinue: () => void;
  onPaymentMethodChange: (value: string) => void;
}

export function CheckoutPaymentStep({
  contactEmail,
  emailError,
  isLoading = false,
  paymentMethodId,
  onBack,
  onContactEmailChange,
  onContinue,
  onPaymentMethodChange,
}: CheckoutPaymentStepProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="@container space-y-4">
        <div>
          <h3 className="text-xl font-bold text-text-base">Contact Email</h3>
          <p className="mt-1 text-sm text-text-muted">
            We&apos;ll send order updates and your receipt to this address.
          </p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="checkout-email" className="block text-sm font-medium text-text-base">
            Email Address
          </label>
          <input
            id="checkout-email"
            type="email"
            value={contactEmail}
            onChange={(event) => onContactEmailChange(event.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
            className={cn(
              'w-full rounded-input border bg-input-bg px-4 py-3 text-sm text-text-base outline-none transition-colors',
              emailError ? 'border-border-error' : 'border-input-border',
              'focus:border-input-border-focus focus:ring-1 focus:ring-primary',
              'disabled:cursor-not-allowed disabled:opacity-disabled',
            )}
          />
          {emailError ? <p className="text-xs text-danger">{emailError}</p> : null}
        </div>
      </section>

      <section className="@container space-y-4">
        <div>
          <h3 className="text-xl font-bold text-text-base">Payment Method</h3>
          <p className="mt-1 text-sm text-text-muted">Choose how you&apos;d like to pay.</p>
        </div>
        <PaymentMethodSelector
          methods={CHECKOUT_PAYMENT_METHODS}
          selectedMethodId={paymentMethodId}
          onSelect={onPaymentMethodChange}
          isLoading={isLoading}
        />
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-text-muted transition-colors hover:text-primary hover:underline"
        >
          &larr; Back to Shipping
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-button bg-primary px-8 py-3 font-bold text-on-primary shadow-button transition-all hover:bg-primary-dark hover:shadow-button-hover disabled:cursor-not-allowed disabled:opacity-disabled"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
