import type { ReactNode } from 'react';

interface CatalogHeaderLayoutProps {
  breadcrumbs?: ReactNode;
  titleSummary?: ReactNode;
  controls?: ReactNode;
}

// Extracted from the breadcrumb and title/control region of app/products/page.tsx.
export function CatalogHeaderLayout({ breadcrumbs, titleSummary, controls }: CatalogHeaderLayoutProps) {
  return (
    <div className="mb-10">
      {breadcrumbs}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {titleSummary}
        {controls}
      </div>
    </div>
  );
}
