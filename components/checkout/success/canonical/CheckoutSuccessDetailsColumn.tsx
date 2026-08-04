import type { ReactNode } from 'react';

export function CheckoutSuccessDetailsColumn({
  digital,
  shipping,
  nextSteps,
}: {
  digital?: ReactNode;
  shipping?: ReactNode;
  nextSteps?: ReactNode;
}) {
  return (
    <div className="lg:col-span-5 space-y-4 md:space-y-6">
      {digital}
      {shipping}
      {nextSteps}
    </div>
  );
}
