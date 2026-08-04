'use client';

import type { ReactNode } from 'react';
import type { Cart } from '@/lib/api/types/cart';
import { CheckoutFlowProvider } from './CheckoutFlowProvider';
import { CheckoutPageLayout } from './CheckoutPageLayout';

export function CheckoutPageSlotLayout({
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
  initialCart: Cart;
  initialEmail?: string;
  steps: ReactNode;
  header: ReactNode;
  error: ReactNode;
  shipping: ReactNode;
  payment: ReactNode;
  review: ReactNode;
  confirmation: ReactNode;
  summary: ReactNode;
}) {
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
