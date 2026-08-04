import type { ReactNode } from 'react';

interface SearchPageLayoutProps {
  breadcrumbs?: ReactNode;
  header?: ReactNode;
  analytics?: ReactNode;
  recentSearches?: ReactNode;
  content?: ReactNode;
}

export function SearchPageLayout({ breadcrumbs, header, analytics, recentSearches, content }: SearchPageLayoutProps) {
  return <main className="min-h-screen bg-bg-base text-text-base"><div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">{breadcrumbs}{header}{analytics}{recentSearches}{content}</div></main>;
}
