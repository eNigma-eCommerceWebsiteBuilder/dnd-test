'use client';

import { useState } from 'react';
import { PaymentMethodForm } from '@/components/subscriptions/PaymentMethodForm';

type UpdatePaymentButtonProps = {
  subscriptionId: string;
};

export function UpdatePaymentButton({ subscriptionId }: UpdatePaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="@container w-full space-y-3">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-center rounded-button border border-border px-4 py-2 text-sm font-semibold text-text-base transition-colors hover:bg-bg-hover"
      >
        {isOpen ? 'Close payment form' : 'Update payment method'}
      </button>

      {isOpen ? (
        <PaymentMethodForm
          subscriptionId={subscriptionId}
          onCancel={() => setIsOpen(false)}
          onSuccess={() => setIsOpen(false)}
        />
      ) : null}
    </div>
  );
}
