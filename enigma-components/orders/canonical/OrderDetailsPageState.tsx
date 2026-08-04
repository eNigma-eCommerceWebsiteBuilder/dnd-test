import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Order } from '@/lib/api/types/orders';

export function OrderDetailsPageState({
  order,
  content,
}: {
  order: Order | null;
  content: ReactNode;
}) {
  if (!order) notFound();

  return <>{content}</>;
}
