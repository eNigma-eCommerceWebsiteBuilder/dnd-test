import type { ReactNode } from 'react';

interface AccountOrdersLayoutProps {
  header: ReactNode;
  filters: ReactNode;
  content: ReactNode;
}

export function AccountOrdersLayout({ header, filters, content }: AccountOrdersLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        {header}
        {filters}
        {content}
      </div>
    </main>
  );
}
