import Link from 'next/link';
import {
  getBillingHistory,
  getSubscriptionDetails,
  getSubscriptionOrders,
} from '@/lib/api/services/subscriptions';
import type {
  BillingHistoryResponse,
  BillingAttempt,
  SubscriptionContract,
  SubscriptionDetailsResponse,
  SubscriptionOrdersResponse,
} from '@/lib/api/types/subscriptions';
import { BillingHistoryList } from '@/components/subscriptions/BillingHistoryList';
import { BillingPortalButton } from '@/components/subscriptions/BillingPortalButton';
import { CancelButton } from '@/components/subscriptions/CancelButton';
import { FailedPaymentAlert } from '@/components/subscriptions/FailedPaymentAlert';
import { ModifySubscriptionButton } from '@/components/subscriptions/ModifySubscriptionButton';
import { NextDeliveryCard } from '@/components/subscriptions/NextDeliveryCard';
import { PauseButton } from '@/components/subscriptions/PauseButton';
import { ResumeButton } from '@/components/subscriptions/ResumeButton';
import { SkipDeliveryButton } from '@/components/subscriptions/SkipDeliveryButton';
import { SubscriptionDetailsHeader } from '@/components/subscriptions/SubscriptionDetailsHeader';
import { SubscriptionItems } from '@/components/subscriptions/SubscriptionItems';
import { SubscriptionOrdersList } from '@/components/subscriptions/SubscriptionOrdersList';
import { UpcomingAmountCard } from '@/components/subscriptions/UpcomingAmountCard';
import { UpdatePaymentButton } from '@/components/subscriptions/UpdatePaymentButton';
import {
  getRouteParam,
  getSearchParam,
  type PuckFetcherContext,
} from '@/lib/puck-route-metadata';

interface SubscriptionDetailStateSectionViewProps {
  subscriptionId?: string;
  state?: 'content' | 'not-found' | 'error';
  subscription?: SubscriptionContract | null;
  upcomingBilling?: SubscriptionDetailsResponse['upcomingBilling'] | null;
  orders?: SubscriptionOrdersResponse['orders'];
  ordersPagination?: SubscriptionOrdersResponse['pagination'];
  billingHistory?: BillingAttempt[];
  billingPagination?: BillingHistoryResponse['pagination'];
  errorMessage?: string;
}

export const puckComponentName = 'SubscriptionDetailStateSection';
export const puckLabel = 'Subscription Detail State Section';
export const puckCategory = 'Account';

export const puckFields = {
  subscriptionId: { type: 'text' as const, label: 'Subscription ID' },
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Content', value: 'content' },
      { label: 'Not Found', value: 'not-found' },
      { label: 'Error', value: 'error' },
    ],
  },
};

export const puckDefaults = {
  subscriptionId: '',
  state: 'not-found',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  runtimeSignals: ['params.id', 'subscription', 'billingHistory', 'subscriptionOrders'],
  matches: [
    { pageIncludes: ['app/account/subscriptions/[id]/page.tsx'], component: 'SubscriptionDetailStateSection' },
  ],
};

export async function puckDataFetcher(
  props: SubscriptionDetailStateSectionViewProps,
  context?: PuckFetcherContext,
) {
  const subscriptionId = props.subscriptionId
    || getRouteParam(context, 'id')
    || getSearchParam(context, 'subscriptionId')
    || getSearchParam(context, 'id');
  if (!subscriptionId) return { state: 'not-found', subscription: null };

  try {
    const [details, orders, billingHistory] = await Promise.all([
      getSubscriptionDetails(subscriptionId),
      getSubscriptionOrders(subscriptionId),
      getBillingHistory(subscriptionId),
    ]);

    if (!details?.subscription) return { state: 'not-found', subscription: null };

    return {
      billingHistory: billingHistory.billingHistory || [],
      billingPagination: billingHistory.pagination,
      orders: orders.orders || [],
      ordersPagination: orders.pagination,
      state: 'content',
      subscription: details.subscription,
      upcomingBilling: details.upcomingBilling,
    };
  } catch (error) {
    return {
      state: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unable to load subscription.',
    };
  }
}

export function SubscriptionDetailStateSectionView({
  state = 'not-found',
  subscription,
  upcomingBilling,
  orders = [],
  ordersPagination = { page: 1, limit: orders.length || 10, total: orders.length, pages: 1 },
  billingHistory = [],
  errorMessage = 'Unable to load subscription.',
}: SubscriptionDetailStateSectionViewProps) {
  if (state === 'not-found' || !subscription) {
    return <SubscriptionMessage title="Subscription Not Found" message="We could not find this subscription." />;
  }

  if (state === 'error') {
    return <SubscriptionMessage title="Subscription unavailable" message={errorMessage} />;
  }

  const { showCancel, showPause, showResume, showSkip } = getSubscriptionActionVisibility(subscription);
  const resolvedUpcomingBilling = upcomingBilling || {
    amount: subscription.totalPrice,
    daysUntil: 0,
    nextDate: subscription.nextBillingDate,
  };

  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted">
            <li>
              <Link href="/account/subscriptions" className="transition-colors hover:text-primary">
                Subscriptions
              </Link>
            </li>
            <li>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </li>
            <li className="font-medium text-text-base">{subscription.contractNumber}</li>
          </ol>
        </nav>

        <section className="mb-6 border-b border-border pb-6">
          <SubscriptionDetailsHeader subscription={subscription} />
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-7">
            <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
              <SubscriptionItems subscription={subscription} />
            </section>

            <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-text-base">Modify subscription</h2>
                  <p className="text-sm text-text-muted">Create a draft before applying changes.</p>
                </div>
                <ModifySubscriptionButton subscription={subscription} />
              </div>
            </section>

            <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-base">Orders</h2>
                <p className="text-xs text-text-muted">{orders.length} total</p>
              </div>
              <SubscriptionOrdersList
                subscriptionId={subscription._id}
                initialOrders={orders}
                initialPagination={ordersPagination}
              />
            </section>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <NextDeliveryCard subscription={subscription} />
            <UpcomingAmountCard upcomingBilling={resolvedUpcomingBilling} />

            <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-base">Actions</h2>
                <p className="text-xs text-text-muted">Lifecycle controls</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {showPause ? <PauseButton subscriptionId={subscription._id} /> : null}
                {showResume ? <ResumeButton subscriptionId={subscription._id} /> : null}
                {showSkip ? <SkipDeliveryButton subscriptionId={subscription._id} /> : null}
                {showCancel ? <CancelButton subscriptionId={subscription._id} /> : null}
              </div>
            </section>

            <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-base">Billing history</h2>
                <p className="text-xs text-text-muted">{billingHistory.length} attempts</p>
              </div>
              <div className="space-y-4">
                <FailedPaymentAlert attempts={billingHistory} />
                <BillingHistoryList
                  subscriptionId={subscription._id}
                  initialAttempts={billingHistory}
                  showHeader={false}
                />
              </div>
            </section>

            <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-base">Payment</h2>
                <p className="text-xs text-text-muted">Manage billing</p>
              </div>
              <div className="space-y-3">
                <UpdatePaymentButton subscriptionId={subscription._id} />
                <BillingPortalButton returnUrl="/account/subscriptions" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function SubscriptionMessage({ title, message }: { title: string; message: string }) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12">
        <div className="rounded-card border border-border bg-bg-surface p-8">
          <h1 className="text-3xl font-heading font-bold text-heading">{title}</h1>
          <p className="mt-2 text-sm text-text-muted">{message}</p>
        </div>
      </section>
    </main>
  );
}

function getSubscriptionActionVisibility(subscription: SubscriptionContract) {
  return {
    showCancel: subscription.status === 'active' || subscription.status === 'paused',
    showPause: subscription.status === 'active',
    showResume: subscription.status === 'paused',
    showSkip: subscription.status === 'active',
  };
}
