import type { ReactNode } from 'react';

export function CartPageLayout({
  header,
  progress,
  items,
  continueShopping,
  summary,
}: {
  header?: ReactNode;
  progress?: ReactNode;
  items?: ReactNode;
  continueShopping?: ReactNode;
  summary?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-12 lg:px-20">
        <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:gap-12">
          <div className="flex-1">
            {header}
            {progress}
            {items}
            <div className="mt-6 md:mt-8">{continueShopping}</div>
          </div>
          <div className="w-full flex-shrink-0 lg:w-[400px]">
            <div className="lg:sticky lg:top-24">{summary}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
