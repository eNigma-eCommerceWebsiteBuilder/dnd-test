import type { ReactNode } from 'react';

export function CheckoutSuccessDigitalAssetsCondition({
  available,
  content,
}: {
  available: boolean;
  content?: ReactNode;
}) {
  return available ? <div className="space-y-4">{content}</div> : null;
}
