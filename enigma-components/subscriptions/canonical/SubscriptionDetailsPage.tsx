import {
  SubscriptionBillingHistory,
  SubscriptionBillingHistoryPanel,
  SubscriptionBillingPortalAction,
  SubscriptionCancelAction,
  SubscriptionDetailContentLayout,
  SubscriptionDetailHeaderRegion,
  SubscriptionDetailsBreadcrumbs,
  SubscriptionDetailsPageLayout,
  SubscriptionFailedPaymentAlert,
  SubscriptionItemsPanel,
  SubscriptionLifecycleActionsPanel,
  SubscriptionModifyPanel,
  SubscriptionNextDeliveryRegion,
  SubscriptionOrdersPanel,
  SubscriptionPauseAction,
  SubscriptionPaymentPanel,
  SubscriptionResumeAction,
  SubscriptionSkipDeliveryAction,
  SubscriptionUpcomingAmountRegion,
  SubscriptionUpdatePaymentAction,
} from './SubscriptionDetailsPageSections';
import { SubscriptionDetailsPageState } from './SubscriptionDetailsPageState';
import type { SubscriptionDetailsPageData } from './subscriptionDetailsRuntime';

export function SubscriptionDetailsPage({
  pageData,
}: {
  pageData: SubscriptionDetailsPageData | null;
}) {
  if (!pageData?.details?.subscription) {
    return <SubscriptionDetailsPageState pageData={pageData} content={null} />;
  }

  const { billingHistory, details, orders } = pageData;
  const { subscription, upcomingBilling } = details;

  return (
    <SubscriptionDetailsPageState
      pageData={pageData}
      content={(
        <SubscriptionDetailsPageLayout
          breadcrumbs={<SubscriptionDetailsBreadcrumbs subscription={subscription} />}
          header={<SubscriptionDetailHeaderRegion subscription={subscription} />}
          content={(
            <SubscriptionDetailContentLayout
              primary={(
                <>
                  <SubscriptionItemsPanel subscription={subscription} />
                  <SubscriptionModifyPanel subscription={subscription} />
                  <SubscriptionOrdersPanel subscription={subscription} orders={orders} />
                </>
              )}
              sidebar={(
                <>
                  <SubscriptionNextDeliveryRegion subscription={subscription} />
                  <SubscriptionUpcomingAmountRegion upcomingBilling={upcomingBilling} />
                  <SubscriptionLifecycleActionsPanel
                    subscription={subscription}
                    pause={<SubscriptionPauseAction subscriptionId={subscription._id} />}
                    resume={<SubscriptionResumeAction subscriptionId={subscription._id} />}
                    skip={<SubscriptionSkipDeliveryAction subscriptionId={subscription._id} />}
                    cancel={<SubscriptionCancelAction subscriptionId={subscription._id} />}
                  />
                  <SubscriptionBillingHistoryPanel
                    billingHistory={billingHistory.billingHistory}
                    alert={<SubscriptionFailedPaymentAlert attempts={billingHistory.billingHistory} />}
                    history={(
                      <SubscriptionBillingHistory
                        subscriptionId={subscription._id}
                        attempts={billingHistory.billingHistory}
                      />
                    )}
                  />
                  <SubscriptionPaymentPanel
                    updatePayment={<SubscriptionUpdatePaymentAction subscriptionId={subscription._id} />}
                    billingPortal={<SubscriptionBillingPortalAction />}
                  />
                </>
              )}
            />
          )}
        />
      )}
    />
  );
}
