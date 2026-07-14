import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface AccountLink {
  href: string;
  title: string;
  description: string;
}

interface AccountDashboardViewProps {
  firstName?: string;
  email?: string;
  welcomeLabel?: string;
  description?: string;
  signedInLabel?: string;
  signedInDescription?: string;
  links: AccountLink[];
  className?: string;
}

export const puckComponentName = 'AccountDashboard';
export const puckLabel = 'Account Dashboard';
export const puckCategory = 'Account';

export const puckFields = {
  firstName: { type: 'text' as const, label: 'First Name' },
  email: { type: 'text' as const, label: 'Email' },
  welcomeLabel: { type: 'text' as const, label: 'Welcome Label' },
  description: { type: 'textarea' as const, label: 'Description' },
  signedInLabel: { type: 'text' as const, label: 'Signed In Label' },
  signedInDescription: { type: 'textarea' as const, label: 'Signed In Description' },
  links: {
    type: 'array' as const,
    label: 'Account Links',
    arrayFields: {
      href: { type: 'text' as const, label: 'Link URL' },
      title: { type: 'text' as const, label: 'Title' },
      description: { type: 'text' as const, label: 'Description' },
    },
    defaultItemProps: {
      href: '/account',
      title: 'New Link',
      description: 'Description here.',
    },
    getItemSummary: (item: AccountLink) => item.title,
    max: 8,
  },
};

export const puckDefaults = {
  firstName: 'there',
  email: 'customer@example.com',
  welcomeLabel: 'Welcome back',
  description: 'Your storefront sign-in now runs through eNigma Identity. The old local credential flow has been removed, and the main customer account tools now follow the hosted identity model consistently.',
  signedInLabel: 'Signed in as',
  signedInDescription: 'The storefront keeps a secure session cookie only. Passwords, verification, and social identity live in the hosted identity service.',
  links: [
    { href: '/account/orders', title: 'Orders', description: 'Track purchases, returns, and fulfillment updates.' },
    { href: '/account/wishlist', title: 'Wishlist', description: 'Keep an eye on saved items and future picks.' },
    { href: '/account/addresses', title: 'Addresses', description: 'Review delivery details and defaults.' },
    { href: '/account/settings', title: 'Identity settings', description: 'See how your hosted sign-in is managed.' },
  ],
};

export function AccountDashboardView({
  firstName = 'there',
  email = '',
  welcomeLabel = 'Welcome back',
  description = '',
  signedInLabel = 'Signed in as',
  signedInDescription = '',
  links,
  className,
}: AccountDashboardViewProps) {
  return (
    <div className={cn('@container', className)}>
      <section className="@container overflow-hidden rounded-card border border-border bg-bg-surface shadow-card">
        <div className="grid grid-cols-1 gap-8 p-8 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] @md:p-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">{welcomeLabel}</p>
            <h1 className="text-4xl font-heading font-black tracking-tight text-text-base">Hi, {firstName}.</h1>
            <p className="max-w-[58ch] text-sm leading-7 text-text-muted">{description}</p>
          </div>
          <div className="rounded-card border border-border bg-bg-base/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">{signedInLabel}</p>
            <p className="mt-3 text-xl font-semibold text-text-base">{email}</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">{signedInDescription}</p>
          </div>
        </div>
      </section>
      <section className="@container mt-8 grid grid-cols-1 gap-4 @3xl:grid-cols-2">
        {links.map((link) => (
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
    </div>
  );
}
