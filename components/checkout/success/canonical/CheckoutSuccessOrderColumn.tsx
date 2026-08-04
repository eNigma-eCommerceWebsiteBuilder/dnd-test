import type { ReactNode } from 'react';

export function CheckoutSuccessOrderColumn({
  items,
  summary,
}: {
  items?: ReactNode;
  summary?: ReactNode;
}) {
  return (
    <div className="lg:col-span-7 space-y-6 md:space-y-8">
      <h2 className="text-xl md:text-2xl font-bold font-heading">
        Order Summary
      </h2>
      {items}
      {summary}
    </div>
  );
}
