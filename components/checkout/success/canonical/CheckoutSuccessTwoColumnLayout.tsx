import type { ReactNode } from 'react';

export function CheckoutSuccessTwoColumnLayout({
  order,
  details,
}: {
  order?: ReactNode;
  details?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {order}
      {details}
    </div>
  );
}
