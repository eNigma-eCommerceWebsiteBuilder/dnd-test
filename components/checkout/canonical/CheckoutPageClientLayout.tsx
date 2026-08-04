'use client';

import type { ReactNode } from 'react';
import type { Cart } from '@/lib/api/types/cart';
import { CheckoutFlowProvider } from '@/enigma-components/templates/checkout/canonical/CheckoutFlowProvider';
import { CheckoutPageLayout } from '@/enigma-components/templates/checkout/canonical/CheckoutPageLayout';

// This is the Puck-capable form of the production CheckoutPageSlotLayout.
export function CheckoutPageClientLayout({
  initialCart,
  initialEmail,
  steps,
  header,
  error,
  shipping,
  payment,
  review,
  confirmation,
  summary,
}: {
  initialCart?: Cart | null;
  initialEmail?: string;
  steps?: ReactNode;
  header?: ReactNode;
  error?: ReactNode;
  shipping?: ReactNode;
  payment?: ReactNode;
  review?: ReactNode;
  confirmation?: ReactNode;
  summary?: ReactNode;
}) {
  if (!initialCart) {
    return null;
  }

  return (
    <CheckoutFlowProvider initialCart={initialCart} initialEmail={initialEmail}>
      <CheckoutPageLayout
        steps={steps}
        header={header}
        error={error}
        shipping={shipping}
        payment={payment}
        review={review}
        confirmation={confirmation}
        summary={summary}
      />
    </CheckoutFlowProvider>
  );
}
