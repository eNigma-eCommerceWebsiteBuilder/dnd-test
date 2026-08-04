import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatOrderNumber } from '@/lib/utils/formatters';
import { NotEligibleMessage } from '@/enigma-components/returns/NotEligibleMessage';
import { ReturnPolicyReminder } from '@/enigma-components/returns/ReturnPolicyReminder';
import { ReturnRequestForm } from '@/enigma-components/returns/ReturnRequestForm';
import { ReturnWindowExpired } from '@/enigma-components/returns/ReturnWindowExpired';
import type { OrderReturnPageData } from './orderReturnRuntime';

export function OrderReturnPageLayout({ breadcrumbs, header, state }: { breadcrumbs: ReactNode; header: ReactNode; state: ReactNode }) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        {breadcrumbs}
        {header}
        {state}
      </div>
    </main>
  );
}

export function OrderReturnBreadcrumbs({ pageData }: { pageData: OrderReturnPageData }) {
  const order = pageData.order;
  if (!order) return null;
  return (
    <nav className="mb-6 md:mb-8">
      <ol className="flex items-center gap-2 text-sm text-text-muted">
        <li><Link href="/account/orders" className="hover:text-primary transition-colors">Orders</Link></li>
        <li><span className="material-symbols-outlined text-sm">chevron_right</span></li>
        <li><Link href={`/account/orders/${order._id}`} className="hover:text-primary transition-colors">{formatOrderNumber(order.orderNumber)}</Link></li>
        <li><span className="material-symbols-outlined text-sm">chevron_right</span></li>
        <li className="text-text-base font-medium">Request Return</li>
      </ol>
    </nav>
  );
}

export function OrderReturnHeader() {
  return (
    <div className="mb-6 md:mb-8">
      <h1 className="text-2xl md:text-3xl font-bold font-heading">Request Return</h1>
      <p className="text-sm md:text-base text-text-muted mt-1">
        Select the items you want to return and share a reason for the request.
      </p>
    </div>
  );
}

export function OrderReturnEligibilityState({ pageData, expired, ineligible, eligible }: {
  pageData: OrderReturnPageData;
  expired: ReactNode;
  ineligible: ReactNode;
  eligible: ReactNode;
}) {
  if (pageData.isWindowExpired) return <>{expired}</>;
  if (!pageData.eligibility.valid) return <>{ineligible}</>;
  return <>{eligible}</>;
}

export function OrderReturnWindowExpiredRegion({ pageData }: { pageData: OrderReturnPageData }) {
  const { deadline, order } = pageData;
  if (!deadline || !order) return null;
  return <ReturnWindowExpired orderNumber={formatOrderNumber(order.orderNumber)} deadline={deadline} />;
}

export function OrderReturnNotEligibleRegion({ pageData }: { pageData: OrderReturnPageData }) {
  const { order, eligibility } = pageData;
  if (!order) return null;
  return <NotEligibleMessage orderId={order._id} orderNumber={formatOrderNumber(order.orderNumber)} message={eligibility.error || 'This order is not eligible for return.'} />;
}

export function OrderReturnEligibleLayout({ form, policy }: { form: ReactNode; policy: ReactNode }) {
  return <div className="flex flex-col gap-6">{form}{policy}</div>;
}

export function OrderReturnRequestFormRegion({ pageData }: { pageData: OrderReturnPageData }) {
  return pageData.order ? <ReturnRequestForm order={pageData.order} /> : null;
}

export function OrderReturnPolicyReminderRegion() {
  return <ReturnPolicyReminder />;
}
