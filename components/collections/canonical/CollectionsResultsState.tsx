import type { ReactNode } from 'react';

export function CollectionsResultsState({
  hasCollections,
  results,
  empty,
}: {
  hasCollections: boolean;
  results?: ReactNode;
  empty?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 pb-16 lg:px-12">
      {hasCollections ? results : empty}
    </section>
  );
}
