import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import type { OrderDownloadsPageData } from './orderDownloadsRuntime';

export function OrderDownloadsPageState({ data, orderId, content }: { data: OrderDownloadsPageData | null; orderId: string; content: ReactNode }) {
  if (!data) redirect(`/account/orders/${orderId}`);
  return <>{content}</>;
}
