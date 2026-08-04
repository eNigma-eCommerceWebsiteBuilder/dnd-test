import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/utils/constants';
import type { CheckoutPageData } from './checkoutPageRuntime';

export function CheckoutPageState({
  checkoutData,
  children,
}: {
  checkoutData: CheckoutPageData;
  children: ReactNode;
}) {
  if (!checkoutData.cart?.items?.length) {
    redirect(ROUTES.CART);
  }

  return <>{children}</>;
}
