import type { ReactNode } from 'react';

export function CheckoutPageLayout({
  steps,
  header,
  error,
  shipping,
  payment,
  review,
  confirmation,
  summary,
}: {
  steps: ReactNode;
  header: ReactNode;
  error: ReactNode;
  shipping: ReactNode;
  payment: ReactNode;
  review: ReactNode;
  confirmation: ReactNode;
  summary: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-12 lg:px-20">
        {steps}

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="flex-1 space-y-8 md:space-y-12">
            {header}
            {error}
            {shipping}
            {payment}
            {review}
            {confirmation}
          </div>

          <div className="w-full flex-shrink-0 lg:w-[400px]">
            <div className="lg:sticky lg:top-24">{summary}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
