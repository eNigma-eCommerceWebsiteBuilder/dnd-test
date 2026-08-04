import Link from 'next/link';
import type { ReactNode } from 'react';
import type {
  BillingAttempt,
  SubscriptionContract,
} from '@/lib/api/types/subscriptions';
import { BillingHistoryList } from '@/enigma-components/subscriptions/BillingHistoryList';
import { BillingPortalButton } from '@/enigma-components/subscriptions/BillingPortalButton';
import { CancelButton } from '@/enigma-components/subscriptions/CancelButton';
import { FailedPaymentAlert } from '@/enigma-components/subscriptions/FailedPaymentAlert';
import { ModifySubscriptionButton } from '@/enigma-components/subscriptions/ModifySubscriptionButton';
import { NextDeliveryCard } from '@/enigma-components/subscriptions/NextDeliveryCard';
import { PauseButton } from '@/enigma-components/subscriptions/PauseButton';
import { ResumeButton } from '@/enigma-components/subscriptions/ResumeButton';
import { SkipDeliveryButton } from '@/enigma-components/subscriptions/SkipDeliveryButton';
import { SubscriptionDetailsHeader } from '@/enigma-components/subscriptions/SubscriptionDetailsHeader';
import { SubscriptionItems } from '@/enigma-components/subscriptions/SubscriptionItems';
import { SubscriptionOrdersList } from '@/enigma-components/subscriptions/SubscriptionOrdersList';
import { UpcomingAmountCard } from '@/enigma-components/subscriptions/UpcomingAmountCard';
import { UpdatePaymentButton } from '@/enigma-components/subscriptions/UpdatePaymentButton';
import {
  getSubscriptionActionVisibility,
  type SubscriptionDetailsPageData,
} from './subscriptionDetailsRuntime';

export function SubscriptionDetailsPageLayout({
  breadcrumbs,
  header,
  content,
}: {
  breadcrumbs: ReactNode;
  header: ReactNode;
  content: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">
        {breadcrumbs}
        {header}
        {content}
      </div>
    </main>
  );
}

export function SubscriptionDetailsBreadcrumbs({
  subscription,
}: {
  subscription: SubscriptionContract;
}) {
  return (
    <nav className="mb-6">
      <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted">
        <li>
          <Link
            href="/account/subscriptions"
            className="transition-colors hover:text-primary"
          >
            Subscriptions
          </Link>
        </li>
        <li>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </li>
        <li className="font-medium text-text-base">
          {subscription.contractNumber}
        </li>
      </ol>
    </nav>
  );
}

export function SubscriptionDetailHeaderRegion({
  subscription,
}: {
  subscription: SubscriptionContract;
}) {
  return (
    <section className="mb-6 border-b border-border pb-6">
      <SubscriptionDetailsHeader subscription={subscription} />
    </section>
  );
}

export function SubscriptionDetailContentLayout({
  primary,
  sidebar,
}: {
  primary: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="space-y-6 lg:col-span-7">{primary}</div>
      <div className="space-y-6 lg:col-span-5">{sidebar}</div>
    </div>
  );
}

export function SubscriptionItemsPanel({
  subscription,
}: {
  subscription: SubscriptionContract;
}) {
  return (
    <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
      <SubscriptionItems subscription={subscription} />
    </section>
  );
}

export function SubscriptionModifyPanel({
  subscription,
}: {
  subscription: SubscriptionContract;
}) {
  return (
    <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-base">
            Modify subscription
          </h2>
          <p className="text-sm text-text-muted">
            Create a draft before applying changes.
          </p>
        </div>
        <ModifySubscriptionButton subscription={subscription} />
      </div>
    </section>
  );
}

export function SubscriptionOrdersPanel({
  subscription,
  orders,
}: {
  subscription: SubscriptionContract;
  orders: SubscriptionDetailsPageData['orders'];
}) {
  return (
    <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-base">Orders</h2>
        <p className="text-xs text-text-muted">{orders.orders.length} total</p>
      </div>
      <SubscriptionOrdersList
        subscriptionId={subscription._id}
        initialOrders={orders.orders}
        initialPagination={orders.pagination}
      />
    </section>
  );
}

export function SubscriptionNextDeliveryRegion({
  subscription,
}: {
  subscription: SubscriptionContract;
}) {
  return <NextDeliveryCard subscription={subscription} />;
}

export function SubscriptionUpcomingAmountRegion({
  upcomingBilling,
}: {
  upcomingBilling: SubscriptionDetailsPageData['details']['upcomingBilling'];
}) {
  return <UpcomingAmountCard upcomingBilling={upcomingBilling} />;
}

export function SubscriptionLifecycleActionsPanel({
  subscription,
  pause,
  resume,
  skip,
  cancel,
}: {
  subscription: SubscriptionContract;
  pause: ReactNode;
  resume: ReactNode;
  skip: ReactNode;
  cancel: ReactNode;
}) {
  const { showCancel, showPause, showResume, showSkip } =
    getSubscriptionActionVisibility(subscription);

  return (
    <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-base">Actions</h2>
        <p className="text-xs text-text-muted">Lifecycle controls</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {showPause ? pause : null}
        {showResume ? resume : null}
        {showSkip ? skip : null}
        {showCancel ? cancel : null}
      </div>
    </section>
  );
}

export function SubscriptionPauseAction({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  return <PauseButton subscriptionId={subscriptionId} />;
}

export function SubscriptionResumeAction({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  return <ResumeButton subscriptionId={subscriptionId} />;
}

export function SubscriptionSkipDeliveryAction({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  return <SkipDeliveryButton subscriptionId={subscriptionId} />;
}

export function SubscriptionCancelAction({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  return <CancelButton subscriptionId={subscriptionId} />;
}

export function SubscriptionBillingHistoryPanel({
  billingHistory,
  alert,
  history,
}: {
  billingHistory: BillingAttempt[];
  alert: ReactNode;
  history: ReactNode;
}) {
  return (
    <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-base">Billing history</h2>
        <p className="text-xs text-text-muted">
          {billingHistory.length} attempts
        </p>
      </div>
      <div className="space-y-4">
        {alert}
        {history}
      </div>
    </section>
  );
}

export function SubscriptionFailedPaymentAlert({
  attempts,
}: {
  attempts: BillingAttempt[];
}) {
  return <FailedPaymentAlert attempts={attempts} />;
}

export function SubscriptionBillingHistory({
  subscriptionId,
  attempts,
}: {
  subscriptionId: string;
  attempts: BillingAttempt[];
}) {
  return (
    <BillingHistoryList
      subscriptionId={subscriptionId}
      initialAttempts={attempts}
      showHeader={false}
    />
  );
}

export function SubscriptionPaymentPanel({
  updatePayment,
  billingPortal,
}: {
  updatePayment: ReactNode;
  billingPortal: ReactNode;
}) {
  return (
    <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-base">Payment</h2>
        <p className="text-xs text-text-muted">Manage billing</p>
      </div>
      <div className="space-y-3">
        {updatePayment}
        {billingPortal}
      </div>
    </section>
  );
}

export function SubscriptionUpdatePaymentAction({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  return <UpdatePaymentButton subscriptionId={subscriptionId} />;
}

export function SubscriptionBillingPortalAction() {
  return <BillingPortalButton returnUrl="/account/subscriptions" />;
}
