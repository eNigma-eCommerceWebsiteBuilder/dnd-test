import type { ReactNode } from 'react';
import Link from 'next/link';

export const accountDashboardLinks = [
  {
    href: '/account/orders',
    title: 'Orders',
    description: 'Track purchases, returns, and fulfillment updates.',
  },
  {
    href: '/account/wishlist',
    title: 'Wishlist',
    description: 'Keep an eye on saved items and future picks.',
  },
  {
    href: '/account/addresses',
    title: 'Addresses',
    description: 'Review delivery details and defaults.',
  },
  {
    href: '/account/settings',
    title: 'Identity settings',
    description: 'See how your hosted sign-in is managed.',
  },
];

export function AccountDashboardPageLayout({
  hero,
  links,
}: {
  hero?: ReactNode;
  links?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg-base px-4 py-10 text-text-base">
      <div className="mx-auto grid max-w-[1180px] gap-8 pt-[96px]">
        {hero}
        {links}
      </div>
    </main>
  );
}

export function AccountDashboardHeroLayout({
  welcome,
  identity,
}: {
  welcome?: ReactNode;
  identity?: ReactNode;
}) {
  return (
    <section className="@container overflow-hidden rounded-card border border-border bg-bg-surface shadow-card">
      <div className="grid grid-cols-1 gap-8 p-8 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] @md:p-10">
        {welcome}
        {identity}
      </div>
    </section>
  );
}

export function AccountDashboardWelcome({ firstName }: { firstName: string }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">
        Welcome back
      </p>
      <h1 className="text-4xl font-heading font-black tracking-tight text-text-base">
        Hi, {firstName}.
      </h1>
      <p className="max-w-[58ch] text-sm leading-7 text-text-muted">
        Your storefront sign-in now runs through eNigma Identity. The old local credential flow has been removed, and the main customer account tools now follow the hosted identity model consistently.
      </p>
    </div>
  );
}

export function AccountDashboardIdentity({ email }: { email?: string | null }) {
  return (
    <div className="rounded-card border border-border bg-bg-base/80 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
        Signed in as
      </p>
      <p className="mt-3 text-xl font-semibold text-text-base">
        {email}
      </p>
      <p className="mt-3 text-sm leading-7 text-text-muted">
        The storefront keeps a secure session cookie only. Passwords, verification, and social identity live in the hosted identity service.
      </p>
    </div>
  );
}

export function AccountDashboardLinks() {
  return (
    <section className="@container grid grid-cols-1 gap-4 @3xl:grid-cols-2">
      {accountDashboardLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="@container rounded-card border border-border bg-bg-surface p-6 shadow-card transition-transform duration-200 hover:-translate-y-0.5"
        >
          <p className="text-lg font-bold text-text-base">{link.title}</p>
          <p className="mt-2 text-sm leading-7 text-text-muted">{link.description}</p>
        </Link>
      ))}
    </section>
  );
}
