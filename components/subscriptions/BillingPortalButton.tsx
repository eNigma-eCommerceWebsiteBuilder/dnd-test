'use client';

import { useState } from 'react';
import { useSubscriptionBilling } from '@/lib/hooks';

interface BillingPortalButtonProps {
  returnUrl?: string;
}

export function BillingPortalButton({ returnUrl }: BillingPortalButtonProps) {
  const { openBillingPortal } = useSubscriptionBilling();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async () => {
    setIsPending(true);
    setError(null);
    try {
      const url = await openBillingPortal(returnUrl);
      window.location.href = url;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to open billing portal.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="@container w-full space-y-2">
      <button
        type="button"
        onClick={handleOpen}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-button bg-cta-secondary px-4 py-2 text-sm font-semibold text-on-secondary hover:bg-cta-secondary-hover transition-colors disabled:opacity-disabled"
      >
        {isPending ? 'Opening portal...' : 'Open billing portal'}
      </button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
