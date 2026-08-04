import type { ReactNode } from 'react';

export function CollectionDetailPageLayout({
  hero,
  curated,
  inspiration,
}: {
  hero?: ReactNode;
  curated?: ReactNode;
  inspiration?: ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-bg-base text-text-base">
      {hero}
      {curated}
      {inspiration}
    </main>
  );
}
