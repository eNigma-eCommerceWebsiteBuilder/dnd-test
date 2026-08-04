import type { Order } from '@/lib/api/types/orders';
import { OrderDetailsPageState } from './OrderDetailsPageState';
import {
  OrderDetailsBillingAddressCondition,
  OrderDetailsBillingRegion,
  OrderDetailsBreadcrumbs,
  OrderDetailsCancelAction,
  OrderDetailsContentLayout,
  OrderDetailsDownloadAction,
  OrderDetailsFinancialRegion,
  OrderDetailsHeader,
  OrderDetailsItemsRegion,
  OrderDetailsPageLayout,
  OrderDetailsPaymentRegion,
  OrderDetailsReorderAction,
  OrderDetailsShippingRegion,
} from './OrderDetailsPageSections';

export function OrderDetailsPage({ order }: { order: Order | null }) {
  return (
    <OrderDetailsPageState
      order={order}
      content={order ? (
        <OrderDetailsPageLayout
          breadcrumbs={<OrderDetailsBreadcrumbs order={order} />}
          header={(
            <OrderDetailsHeader
              order={order}
              downloads={<OrderDetailsDownloadAction order={order} />}
              reorder={<OrderDetailsReorderAction items={order.items} />}
              cancel={<OrderDetailsCancelAction orderId={order._id} />}
            />
          )}
          content={(
            <OrderDetailsContentLayout
              primary={(
                <>
                  <OrderDetailsItemsRegion items={order.items} />
                  <OrderDetailsFinancialRegion order={order} />
                </>
              )}
              sidebar={(
                <>
                  <OrderDetailsShippingRegion address={order.shippingAddress} />
                  <OrderDetailsBillingAddressCondition
                    billingAddress={order.billingAddress}
                    content={<OrderDetailsBillingRegion address={order.billingAddress!} />}
                  />
                  <OrderDetailsPaymentRegion order={order} />
                </>
              )}
            />
          )}
        />
      ) : null}
    />
  );
}
