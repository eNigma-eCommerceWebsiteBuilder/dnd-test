import type { ReactNode } from 'react';

interface ProductDetailPageLayoutProps {
  promotion?: ReactNode;
  breadcrumbs?: ReactNode;
  media?: ReactNode;
  purchase?: ReactNode;
  mobileTabs?: ReactNode;
  reviews?: ReactNode;
  testimonials?: ReactNode;
  related?: ReactNode;
}

export function ProductDetailPageLayout({
  promotion,
  breadcrumbs,
  media,
  purchase,
  mobileTabs,
  reviews,
  testimonials,
  related,
}: ProductDetailPageLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      {promotion}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {breadcrumbs}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {media}
          {purchase}
        </div>
        {mobileTabs}
        {reviews}
        {testimonials}
        {related}
      </div>
    </main>
  );
}
