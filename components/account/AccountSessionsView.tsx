import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface AccountSessionsViewProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  infoText?: string;
  className?: string;
}

export const puckComponentName = 'AccountSessions';
export const puckLabel = 'Account Sessions';
export const puckCategory = 'Account';

export const puckFields = {
  eyebrow: { type: 'text' as const, label: 'Eyebrow Label' },
  title: { type: 'text' as const, label: 'Title' },
  description: { type: 'textarea' as const, label: 'Description' },
  infoText: { type: 'textarea' as const, label: 'Info Box Text' },
};

export const puckDefaults = {
  eyebrow: 'Identity migration',
  title: 'Session management moved to eNigma Identity.',
  description: 'The storefront no longer keeps its own device session registry. Sign-in and sign-out now use the hosted identity flow, and the old local session dashboard has been retired as part of the auth replacement.',
  infoText: 'This placeholder stays available so account navigation remains stable even though active device session management now lives entirely in the hosted identity service.',
};

export function AccountSessionsView({
  eyebrow = '',
  title = '',
  description = '',
  infoText = '',
  className,
}: AccountSessionsViewProps) {
  return (
    <div className={cn('@container', className)}>
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/" className="font-medium transition hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link href="/account" className="font-medium transition hover:text-primary">Account</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-semibold text-primary">Sessions</span>
      </div>
      <section className="@container mt-8 rounded-card border border-border bg-bg-surface p-8 shadow-card @md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">{eyebrow}</p>
        <h1 className="mt-4 text-3xl font-heading font-black tracking-tight text-text-base">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-text-muted">{description}</p>
        <div className="mt-6 rounded-card border border-border bg-bg-base/80 p-5 text-sm leading-7 text-text-muted">
          {infoText}
        </div>
      </section>
    </div>
  );
}
