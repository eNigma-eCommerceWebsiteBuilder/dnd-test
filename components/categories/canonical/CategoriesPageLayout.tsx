import type { ReactNode } from 'react';

interface CategoriesPageLayoutProps {
  breadcrumbs: ReactNode;
  intro: ReactNode;
  trending: ReactNode;
  departments: ReactNode;
}

// Extracted from app/categories/page.tsx. This owns only the source page shell.
export function CategoriesPageLayout({
  breadcrumbs,
  intro,
  trending,
  departments,
}: CategoriesPageLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
        {breadcrumbs}
        {intro}
        {trending}
        {departments}
      </div>
    </main>
  );
}
