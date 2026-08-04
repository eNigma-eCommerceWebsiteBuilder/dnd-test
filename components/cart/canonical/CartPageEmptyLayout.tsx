import type { ReactNode } from 'react';

export function CartPageEmptyLayout({ content }: { content?: ReactNode }) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-12 md:py-12 lg:px-20">
        {content}
      </div>
    </main>
  );
}
