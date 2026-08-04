import { redirect } from 'next/navigation';
import type { Order } from '@/lib/api/types';
import { ROUTES } from '@/lib/utils';
import type { ReactNode } from 'react';

export function CheckoutSuccessPageState({
  order,
  content,
}: {
  order: Order | null;
  content?: ReactNode;
}) {
  if (!order) {
    redirect(ROUTES.HOME);
  }

  return <>{content}</>;
}
