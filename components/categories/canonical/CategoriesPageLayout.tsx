import type { ReactNode } from 'react';

export function CategoriesPageLayout({ breadcrumbs, intro, trending, departments }: { breadcrumbs?: ReactNode; intro?: ReactNode; trending?: ReactNode; departments?: ReactNode }) {
  return <main className="min-h-screen bg-bg-base text-text-base"><div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">{breadcrumbs}{intro}{trending}{departments}</div></main>;
}
