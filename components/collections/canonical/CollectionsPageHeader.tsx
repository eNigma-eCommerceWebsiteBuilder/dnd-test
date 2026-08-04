import type { ReactNode } from 'react';

export function CollectionsPageHeader({ breadcrumbs }: { breadcrumbs?: ReactNode }) {
  return (
    <section className="border-b border-border py-10">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
        {breadcrumbs}
        <h1 className="text-4xl font-heading font-bold text-heading">
          Collections
        </h1>
      </div>
    </section>
  );
}
