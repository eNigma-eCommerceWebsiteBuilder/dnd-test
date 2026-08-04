import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import type { SubscriptionCheckoutData } from './subscriptionCheckoutRuntime';
import { ROUTES } from '@/lib/utils/constants';

export function SubscriptionCheckoutPageState({
  checkoutData,
  children,
}: {
  checkoutData: SubscriptionCheckoutData | null;
  children: ReactNode;
}) {
  if (!checkoutData) {
    redirect(ROUTES.CART);
  }

  return <>{children}</>;
}
