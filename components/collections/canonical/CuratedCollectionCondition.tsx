import type { ReactNode } from 'react';

export function CuratedCollectionCondition({
  visible,
  content,
}: {
  visible: boolean;
  content?: ReactNode;
}) {
  return visible ? (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-16 lg:px-12">
      {content}
    </section>
  ) : null;
}
