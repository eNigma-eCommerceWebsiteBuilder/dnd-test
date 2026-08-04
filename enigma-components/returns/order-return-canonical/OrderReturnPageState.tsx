import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import type { OrderReturnPageData } from './orderReturnRuntime';

export function OrderReturnPageState({ pageData, content }: { pageData: OrderReturnPageData | null; content: ReactNode }) {
  if (!pageData?.order) notFound();
  return <>{content}</>;
}
