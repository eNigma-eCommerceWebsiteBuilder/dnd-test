'use client';

import { useState, useTransition } from 'react';
import { updateSubscriptionPaymentAction } from '@/lib/actions/subscription-actions';

interface PaymentMethodFormProps {
  subscriptionId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentMethodForm({ subscriptionId, onSuccess, onCancel }: PaymentMethodFormProps) {
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      setError(null);
      setSuccess(false);
      const result = await updateSubscriptionPaymentAction(null, {
        subscriptionId,
        paymentMethodId: paymentMethodId.trim(),
      });
      if (!result.success) {
        setError(result.error || 'Failed to update payment method');
        return;
      }
      setPaymentMethodId('');
      setSuccess(true);
      onSuccess?.();
    });
  };

  return (
    <div className="@container w-full space-y-4 rounded-card border border-border bg-bg-surface p-4">
      <div>
        <h4 className="text-sm font-semibold text-text-base">Update payment method</h4>
        <p className="text-xs text-text-muted">Enter a payment method ID from Stripe.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="subscription-payment-method" className="text-sm font-medium text-text-base">
          Payment method ID
        </label>
        <input
          id="subscription-payment-method"
          type="text"
          value={paymentMethodId}
          onChange={(event) => setPaymentMethodId(event.target.value)}
          className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base"
          placeholder="pm_123"
        />
      </div>

      {error ? (
        <p className="text-sm text-danger" role="status" aria-live="polite">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-success" role="status" aria-live="polite">
          Payment method updated.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-button border border-border text-sm font-semibold text-text-base hover:bg-bg-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || paymentMethodId.trim().length === 0}
          className="px-4 py-2 rounded-button bg-cta-primary text-on-primary text-sm font-semibold shadow-button hover:bg-cta-primary-hover hover:shadow-button-hover transition-all disabled:opacity-disabled"
        >
          {isPending ? 'Updating...' : 'Update payment'}
        </button>
      </div>
    </div>
  );
}
