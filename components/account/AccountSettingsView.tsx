import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface AccountSettingsViewProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  displayName?: string;
  email?: string;
  emailVerified?: string;
  verifiedMessage?: string;
  unverifiedMessage?: string;
  className?: string;
}

export const puckComponentName = 'AccountSettings';
export const puckLabel = 'Account Settings';
export const puckCategory = 'Account';

export const puckFields = {
  eyebrow: { type: 'text' as const, label: 'Eyebrow Label' },
  title: { type: 'text' as const, label: 'Title' },
  description: { type: 'textarea' as const, label: 'Description' },
  displayName: { type: 'text' as const, label: 'Display Name' },
  email: { type: 'text' as const, label: 'Email' },
  emailVerified: {
    type: 'select' as const,
    label: 'Email Verified',
    options: [
      { label: 'No', value: 'false' },
      { label: 'Yes', value: 'true' },
    ],
  },
  verifiedMessage: { type: 'textarea' as const, label: 'Verified Message' },
  unverifiedMessage: { type: 'textarea' as const, label: 'Unverified Message' },
};

export const puckDefaults = {
  eyebrow: 'Hosted identity',
  title: 'Sign-in is managed outside the storefront.',
  description: 'We have fully removed the local storefront password, reset, and verification flow. Customer authentication now lives in eNigma Identity so the storefront can stay lightweight and secure.',
  displayName: 'John Doe',
  email: 'customer@example.com',
  emailVerified: 'true',
  verifiedMessage: 'Your identity provider has marked this email as verified.',
  unverifiedMessage: 'Verification is controlled by the identity provider and no longer handled inside the storefront.',
};

export function AccountSettingsView({
  eyebrow = 'Hosted identity',
  title = '',
  description = '',
  displayName = '',
  email = '',
  emailVerified = 'false',
  verifiedMessage = '',
  unverifiedMessage = '',
  className,
}: AccountSettingsViewProps) {
  return (
    <div className={cn('@container', className)}>
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/" className="font-medium transition hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link href="/account" className="font-medium transition hover:text-primary">Account</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-semibold text-primary">Identity settings</span>
      </div>
      <section className="mt-8 overflow-hidden rounded-card border border-border bg-bg-surface shadow-card">
        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:p-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">{eyebrow}</p>
            <h1 className="text-3xl font-heading font-black tracking-tight text-text-base">{title}</h1>
            <p className="text-sm leading-7 text-text-muted">{description}</p>
          </div>
          <div className="space-y-4 rounded-card border border-border bg-bg-base/80 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">Display name</p>
              <p className="mt-2 text-lg font-semibold text-text-base">{displayName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">Email</p>
              <p className="mt-2 text-lg font-semibold text-text-base">{email || 'Unavailable'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">Verification</p>
              <p className="mt-2 text-sm leading-7 text-text-muted">
                {emailVerified === 'true' ? verifiedMessage : unverifiedMessage}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
