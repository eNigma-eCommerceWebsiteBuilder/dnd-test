import type { ReactNode } from 'react';

interface CollectionsPageLayoutProps {
  header?: ReactNode;
  filters?: ReactNode;
  featured?: ReactNode;
  collections?: ReactNode;
  inspiration?: ReactNode;
}

export function CollectionsPageLayout({
  header,
  filters,
  featured,
  collections,
  inspiration,
}: CollectionsPageLayoutProps) {
  return (
    <main className="min-h-screen w-full bg-bg-base text-text-base">
      {header}
      {filters}
      {featured}
      {collections}
      {inspiration}
    </main>
  );
}
