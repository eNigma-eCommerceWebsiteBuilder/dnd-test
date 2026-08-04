import Link from 'next/link';
import type { ReactNode } from 'react';
import { AddressManager } from '@/enigma-components/addresses/AddressManager';
import { ROUTES } from '@/lib/utils/constants';
import type { AddressesPageData } from './addressesRuntime';

export function AddressesPageLayout({ breadcrumbs, account }: { breadcrumbs: ReactNode; account: ReactNode }) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        {breadcrumbs}
        {account}
      </div>
    </main>
  );
}

export function AddressesBreadcrumbs() {
  return (
    <div className="flex items-center gap-2 mb-8">
      <Link href={ROUTES.HOME} className="text-text-muted text-sm font-medium hover:text-primary transition-colors">Home</Link>
      <span className="material-symbols-outlined text-text-muted text-xs">chevron_right</span>
      <Link href={ROUTES.ACCOUNT} className="text-text-muted text-sm font-medium hover:text-primary transition-colors">Account</Link>
      <span className="material-symbols-outlined text-text-muted text-xs">chevron_right</span>
      <span className="text-primary text-sm font-semibold">Addresses</span>
    </div>
  );
}

export function AddressesAccountLayout({ sidebar, content }: { sidebar: ReactNode; content: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <aside className="lg:col-span-3">{sidebar}</aside>
      {content}
    </div>
  );
}

export function AddressesAccountSidebar() {
  return (
    <div className="sticky top-28 space-y-6">
      <div>
        <h1 className="text-xl font-bold mb-1 text-text-base">My Account</h1>
        <p className="text-text-muted text-sm">Manage your account experience</p>
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-card hover:bg-bg-surface transition-all"><span className="material-symbols-outlined">package</span><span className="text-sm font-medium">Order History</span></Link>
        <Link href="/account/payment-methods" className="flex items-center gap-3 px-4 py-3 rounded-card hover:bg-bg-surface transition-all"><span className="material-symbols-outlined">credit_card</span><span className="text-sm font-medium">Payment Methods</span></Link>
        <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-card bg-bg-surface text-primary shadow-card border border-primary/10 transition-all"><span className="material-symbols-outlined">location_on</span><span className="text-sm font-semibold">Addresses</span></Link>
        <Link href="/account/settings" className="flex items-center gap-3 px-4 py-3 rounded-card hover:bg-bg-surface transition-all"><span className="material-symbols-outlined">person</span><span className="text-sm font-medium">Profile Settings</span></Link>
      </nav>
    </div>
  );
}

export function AddressesContentLayout({ addressManager }: { addressManager: ReactNode }) {
  return (
    <div className="lg:col-span-9 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-text-base">Shipping Addresses</h2>
        <p className="text-sm md:text-base text-text-muted">Organize your primary and alternative delivery locations.</p>
      </header>
      {addressManager}
    </div>
  );
}

export function AddressesManagerRegion({ pageData }: { pageData: AddressesPageData }) {
  return <AddressManager user={pageData.user} />;
}
