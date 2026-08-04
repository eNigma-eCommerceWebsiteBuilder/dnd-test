import type { ReactNode } from 'react';

export function SharedWishlistPageLayout({
  schema,
  header,
  content,
}: {
  schema?: ReactNode;
  header?: ReactNode;
  content?: ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-bg-base text-text-base">
      {schema}
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 lg:px-12">
        {header}
        {content}
      </div>
    </main>
  );
}
