import type { ReactNode } from 'react';

export function CheckoutSuccessPageLayout({
  tracker,
  header,
  content,
  actions,
}: {
  tracker?: ReactNode;
  header?: ReactNode;
  content?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12 lg:py-16">
        {tracker}
        {header}
        {content}
        {actions}
      </div>
    </main>
  );
}
