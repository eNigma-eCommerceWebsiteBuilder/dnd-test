import Link from 'next/link';
import { getUserProfile } from '@/lib/api/services/users/profile';
import type { User } from '@/lib/api/types/auth';
import { AddressManager } from '@/components/addresses/AddressManager';
import { ROUTES } from '@/lib/utils/constants';

interface AccountAddressesStateSectionViewProps {
  state?: 'content' | 'empty' | 'error';
  user?: User | null;
  errorMessage?: string;
}

export const puckComponentName = 'AccountAddressesStateSection';
export const puckLabel = 'Account Addresses State Section';
export const puckCategory = 'Account';

export const puckFields = {
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Content', value: 'content' },
      { label: 'Empty', value: 'empty' },
      { label: 'Error', value: 'error' },
    ],
  },
};

export const puckDefaults = {
  state: 'content',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  runtimeSignals: ['userProfile', 'user.addresses'],
  matches: [
    { pageIncludes: ['app/account/addresses/page.tsx'], component: 'AccountAddressesStateSection' },
  ],
};

export async function puckDataFetcher() {
  try {
    const user = await getUserProfile();
    return {
      user,
      state: user.addresses?.length ? 'content' : 'empty',
    };
  } catch (error) {
    return {
      state: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unable to load addresses.',
    };
  }
}

export function AccountAddressesStateSectionView({
  state = 'content',
  user,
  errorMessage = 'Unable to load addresses.',
}: AccountAddressesStateSectionViewProps) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 md:py-12 lg:px-12">
        <div className="mb-8 flex items-center gap-2">
          <Link
            href={ROUTES.HOME}
            className="text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >
            Home
          </Link>
          <span className="material-symbols-outlined text-xs text-text-muted">chevron_right</span>
          <Link
            href={ROUTES.ACCOUNT}
            className="text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >
            Account
          </Link>
          <span className="material-symbols-outlined text-xs text-text-muted">chevron_right</span>
          <span className="text-sm font-semibold text-primary">Addresses</span>
        </div>

        {state === 'error' ? (
          <div className="rounded-card border border-danger bg-danger-subtle p-6 text-danger">{errorMessage}</div>
        ) : user ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <aside className="lg:col-span-3">
              <div className="sticky top-28 space-y-6">
                <div>
                  <h1 className="mb-1 text-xl font-bold text-text-base">My Account</h1>
                  <p className="text-sm text-text-muted">Manage your account experience</p>
                </div>
                <nav className="flex flex-col gap-2">
                  <AccountNavLink href="/account/orders" icon="package" label="Order History" />
                  <AccountNavLink href="/account/payment-methods" icon="credit_card" label="Payment Methods" />
                  <AccountNavLink href="/account/addresses" icon="location_on" label="Addresses" active />
                  <AccountNavLink href="/account/settings" icon="person" label="Profile Settings" />
                </nav>
              </div>
            </aside>

            <div className="flex flex-col gap-6 lg:col-span-9">
              <header className="flex flex-col gap-2">
                <h2 className="font-heading text-2xl font-bold text-text-base md:text-3xl">
                  Shipping Addresses
                </h2>
                <p className="text-sm text-text-muted md:text-base">
                  Organize your primary and alternative delivery locations.
                </p>
              </header>

              <AddressManager user={user} />
            </div>
          </div>
        ) : (
          <div className="rounded-card border border-border bg-bg-surface p-8 text-center shadow-card">
            <h2 className="text-xl font-heading font-bold text-text-base">No account profile</h2>
            <p className="mt-2 text-sm text-text-muted">Sign in to add and manage delivery locations.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function AccountNavLink({
  active = false,
  href,
  icon,
  label,
}: {
  active?: boolean;
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'flex items-center gap-3 rounded-card border border-primary/10 bg-bg-surface px-4 py-3 text-primary shadow-card transition-all'
          : 'flex items-center gap-3 rounded-card px-4 py-3 transition-all hover:bg-bg-surface'
      }
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className={active ? 'text-sm font-semibold' : 'text-sm font-medium'}>{label}</span>
    </Link>
  );
}
