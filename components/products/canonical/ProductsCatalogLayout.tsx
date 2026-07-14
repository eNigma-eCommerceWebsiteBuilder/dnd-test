import type { ReactNode } from 'react';

interface ProductsCatalogLayoutProps {
  header?: ReactNode;
  activeFilters?: ReactNode;
  content?: ReactNode;
}

// Extracted from app/products/page.tsx. Puck adapters only supply its regions.
export function ProductsCatalogLayout({ header, activeFilters, content }: ProductsCatalogLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {header}
        {activeFilters}
        {content}
      </div>
    </main>
  );
}
