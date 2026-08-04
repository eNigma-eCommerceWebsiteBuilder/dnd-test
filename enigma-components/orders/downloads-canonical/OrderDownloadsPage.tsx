import type { OrderDownloadsPageData } from './orderDownloadsRuntime';
import { OrderDownloadsPageState } from './OrderDownloadsPageState';
import {
  OrderDownloadsAssetsLayout,
  OrderDownloadsAssetsState,
  OrderDownloadsBackLink,
  OrderDownloadsBreadcrumbs,
  OrderDownloadsEmptyRegion,
  OrderDownloadsHeader,
  OrderDownloadsLicenseKeysRegion,
  OrderDownloadsListRegion,
  OrderDownloadsPageLayout,
  OrderDownloadsPaymentPendingCondition,
  OrderDownloadsPaymentPendingNotice,
} from './OrderDownloadsPageSections';

export function OrderDownloadsPage({ data, orderId }: { data: OrderDownloadsPageData | null; orderId: string }) {
  return <OrderDownloadsPageState data={data} orderId={orderId} content={data ? <OrderDownloadsPageLayout breadcrumbs={<OrderDownloadsBreadcrumbs data={data} />} header={<OrderDownloadsHeader data={data} />} paymentPending={<OrderDownloadsPaymentPendingCondition data={data} content={<OrderDownloadsPaymentPendingNotice />} />} downloads={<OrderDownloadsAssetsState data={data} assets={<OrderDownloadsAssetsLayout downloads={<OrderDownloadsListRegion data={data} />} licenses={<OrderDownloadsLicenseKeysRegion data={data} />} />} empty={<OrderDownloadsEmptyRegion />} />} back={<OrderDownloadsBackLink data={data} />} /> : null} />;
}
