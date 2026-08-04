import type { ReactNode } from 'react';

export function CheckoutSuccessHeaderLayout({
  header,
  orderNumber,
}: {
  header?: ReactNode;
  orderNumber?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center mb-12 md:mb-16">
      {header}
      {orderNumber}
    </div>
  );
}
