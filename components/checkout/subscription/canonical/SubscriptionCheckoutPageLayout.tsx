import type { ReactNode } from 'react';

export function SubscriptionCheckoutPageLayout({ content }: { content: ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-12 lg:px-20">
        {content}
      </div>
    </main>
  );
}
