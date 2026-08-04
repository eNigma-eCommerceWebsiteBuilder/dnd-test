import type { ReactNode } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

export function AccountSessionsPageLayout({
  breadcrumbs,
  content,
}: {
  breadcrumbs?: ReactNode;
  content?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[980px] px-4 py-8 pt-[104px]">
        {breadcrumbs}
        {content}
      </div>
    </main>
  );
}

export function AccountSessionsBreadcrumbs() {
  return (
    <div className="flex items-center gap-2 text-sm text-text-muted">
      <Link href={ROUTES.HOME} className="font-medium transition hover:text-primary">
        Home
      </Link>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <Link href={ROUTES.ACCOUNT} className="font-medium transition hover:text-primary">
        Account
      </Link>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <span className="font-semibold text-primary">Sessions</span>
    </div>
  );
}

export function AccountSessionsIdentityNotice() {
  return (
    <section className="@container mt-8 rounded-card border border-border bg-bg-surface p-8 shadow-card @md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">
        Identity migration
      </p>
      <h1 className="mt-4 text-3xl font-heading font-black tracking-tight text-text-base">
        Session management moved to eNigma Identity.
      </h1>
      <p className="mt-4 text-sm leading-7 text-text-muted">
        The storefront no longer keeps its own device session registry. Sign-in and sign-out now use the hosted identity flow, and the old local session dashboard has been retired as part of the auth replacement.
      </p>
      <div className="mt-6 rounded-card border border-border bg-bg-base/80 p-5 text-sm leading-7 text-text-muted">
        This placeholder stays available so account navigation remains stable even though active device session management now lives entirely in the hosted identity service.
      </div>
    </section>
  );
}
