import type { ReactNode } from 'react';

interface AccountSettingsLayoutProps {
  breadcrumbs: ReactNode;
  content: ReactNode;
}

export function AccountSettingsLayout({ breadcrumbs, content }: AccountSettingsLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1180px] px-4 py-8 pt-[104px]">
        {breadcrumbs}
        {content}
      </div>
    </main>
  );
}
