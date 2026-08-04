import type { ReactNode } from 'react';

export function CollectionsFilterSection({ content }: { content?: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-10 lg:px-12">
      {content}
    </section>
  );
}
