import Link from 'next/link';
import type { ReactNode } from 'react';
import { LicenseKeyDisplay } from '@/enigma-components/orders/LicenseKeyDisplay';
import { OrderDigitalDownloads } from '@/enigma-components/orders/OrderDigitalDownloads';
import { formatOrderNumber } from '@/lib/utils';
import type { OrderDownloadsPageData } from './orderDownloadsRuntime';

export function OrderDownloadsPageLayout({ breadcrumbs, header, paymentPending, downloads, back }: { breadcrumbs: ReactNode; header: ReactNode; paymentPending: ReactNode; downloads: ReactNode; back: ReactNode }) {
  return <main className="min-h-screen bg-bg-base text-text-base"><div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 md:py-12 lg:px-12">{breadcrumbs}{header}{paymentPending}{downloads}{back}</div></main>;
}

export function OrderDownloadsBreadcrumbs({ data }: { data: OrderDownloadsPageData }) {
  const { order } = data;
  return <nav className="mb-6 md:mb-8"><ol className="flex items-center gap-2 text-sm text-text-muted"><li><Link href="/account/orders" className="transition-colors hover:text-primary">Orders</Link></li><li><span className="material-symbols-outlined text-sm">chevron_right</span></li><li><Link href={`/account/orders/${order._id}`} className="transition-colors hover:text-primary">{formatOrderNumber(order.orderNumber)}</Link></li><li><span className="material-symbols-outlined text-sm">chevron_right</span></li><li className="font-medium text-text-base">Downloads</li></ol></nav>;
}

export function OrderDownloadsHeader({ data }: { data: OrderDownloadsPageData }) {
  return <div className="mb-8 md:mb-10"><h1 className="mb-2 font-heading text-2xl font-bold md:text-3xl">Digital Downloads</h1><p className="text-sm text-text-muted md:text-base">Download your digital purchases from order{' '}{formatOrderNumber(data.order.orderNumber)}</p></div>;
}

export function OrderDownloadsPaymentPendingCondition({ data, content }: { data: OrderDownloadsPageData; content: ReactNode }) {
  return !data.isPaid ? <>{content}</> : null;
}

export function OrderDownloadsPaymentPendingNotice() {
  return <div className="mb-6 rounded-card border border-warning bg-warning-subtle p-4 md:mb-8 md:p-6"><div className="flex items-start gap-3"><span className="material-symbols-outlined flex-shrink-0 text-warning">info</span><div><h2 className="mb-1 font-semibold text-text-base">Payment Pending</h2><p className="text-sm text-text-muted">Your downloads will be available once payment is confirmed. Please complete payment to access your digital items.</p></div></div></div>;
}

export function OrderDownloadsAssetsState({ data, assets, empty }: { data: OrderDownloadsPageData; assets: ReactNode; empty: ReactNode }) {
  return data.digitalAssets?.assets?.length ? <>{assets}</> : <>{empty}</>;
}

export function OrderDownloadsAssetsLayout({ downloads, licenses }: { downloads: ReactNode; licenses: ReactNode }) {
  return <div className="space-y-6 md:space-y-8">{downloads}{licenses}</div>;
}

export function OrderDownloadsListRegion({ data }: { data: OrderDownloadsPageData }) {
  return data.digitalAssets?.assets ? <OrderDigitalDownloads assets={data.digitalAssets.assets} isPaid={data.isPaid} /> : null;
}

export function OrderDownloadsLicenseKeysRegion({ data }: { data: OrderDownloadsPageData }) {
  const assets = data.digitalAssets?.assets ?? [];
  return <div className="rounded-card border border-border bg-bg-surface p-4 shadow-card md:p-6"><h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold"><span className="material-symbols-outlined text-primary">vpn_key</span>License Keys</h2><div className="space-y-4">{assets.map((asset, index) => <LicenseKeyDisplay key={asset.licenseKey || index} licenseKey={asset.licenseKey} productName={asset.productName} />)}</div></div>;
}

export function OrderDownloadsEmptyRegion() {
  return <div className="py-12 text-center md:py-16"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-sunken md:h-20 md:w-20"><span className="material-symbols-outlined text-3xl text-text-muted md:text-4xl">cloud_off</span></div><h2 className="mb-2 font-heading text-lg font-bold md:text-xl">No Downloads Available</h2><p className="mx-auto max-w-md text-sm text-text-muted md:text-base">There are no digital downloads available for this order yet. Please check back later or contact support.</p></div>;
}

export function OrderDownloadsBackLink({ data }: { data: OrderDownloadsPageData }) {
  return <div className="mt-8 border-t border-divider pt-6 md:mt-12"><Link href={`/account/orders/${data.order._id}`} className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-dark"><span className="material-symbols-outlined">arrow_back</span>Back to Order Details</Link></div>;
}
