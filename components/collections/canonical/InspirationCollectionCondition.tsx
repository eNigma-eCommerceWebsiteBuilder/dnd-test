import type { ReactNode } from 'react';

export function InspirationCollectionCondition({
  visible,
  content,
}: {
  visible: boolean;
  content?: ReactNode;
}) {
  return visible ? (
    <section className="mx-auto w-full max-w-[1440px] px-6 pb-20 lg:px-12">
      {content}
    </section>
  ) : null;
}
