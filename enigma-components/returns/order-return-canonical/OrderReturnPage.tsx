import type { OrderReturnPageData } from './orderReturnRuntime';
import { OrderReturnPageState } from './OrderReturnPageState';
import {
  OrderReturnBreadcrumbs,
  OrderReturnEligibilityState,
  OrderReturnEligibleLayout,
  OrderReturnHeader,
  OrderReturnNotEligibleRegion,
  OrderReturnPageLayout,
  OrderReturnPolicyReminderRegion,
  OrderReturnRequestFormRegion,
  OrderReturnWindowExpiredRegion,
} from './OrderReturnPageSections';

export function OrderReturnPage({ pageData }: { pageData: OrderReturnPageData | null }) {
  return (
    <OrderReturnPageState
      pageData={pageData}
      content={pageData?.order ? (
        <OrderReturnPageLayout
          breadcrumbs={<OrderReturnBreadcrumbs pageData={pageData} />}
          header={<OrderReturnHeader />}
          state={(
            <OrderReturnEligibilityState
              pageData={pageData}
              expired={<OrderReturnWindowExpiredRegion pageData={pageData} />}
              ineligible={<OrderReturnNotEligibleRegion pageData={pageData} />}
              eligible={(
                <OrderReturnEligibleLayout
                  form={<OrderReturnRequestFormRegion pageData={pageData} />}
                  policy={<OrderReturnPolicyReminderRegion />}
                />
              )}
            />
          )}
        />
      ) : null}
    />
  );
}
