import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import type { SubscriptionDetailsPageData } from './subscriptionDetailsRuntime';

// Owns the route's original missing-subscription branch. There is deliberately
// no Puck-only error or empty-state replacement for this native 404 behavior.
export function SubscriptionDetailsPageState({
  pageData,
  content,
}: {
  pageData: SubscriptionDetailsPageData | null;
  content: ReactNode;
}) {
  if (!pageData?.details?.subscription) {
    notFound();
  }

  return <>{content}</>;
}
