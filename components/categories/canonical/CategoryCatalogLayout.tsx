import type { ReactNode } from 'react';

interface CategoryCatalogLayoutProps {
  breadcrumbs?: ReactNode;
  hero?: ReactNode;
  subcategories?: ReactNode;
  activeFilters?: ReactNode;
  content?: ReactNode;
}

export function CategoryCatalogLayout({ breadcrumbs, hero, subcategories, activeFilters, content }: CategoryCatalogLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {breadcrumbs}
        {hero}
        {subcategories}
        {activeFilters}
        {content}
      </div>
    </main>
  );
}
