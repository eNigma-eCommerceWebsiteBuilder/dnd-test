import type { ReactNode } from 'react';

export function CheckoutSuccessActionsLayout({
  continueShopping,
  viewOrder,
}: {
  continueShopping?: ReactNode;
  viewOrder?: ReactNode;
}) {
  return (
    <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
      {continueShopping}
      {viewOrder}
    </div>
  );
}
