import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Address, Order, OrderItem } from '@/lib/api/types';
import { canCancelOrder, formatOrderNumber, hasDigitalItems } from '@/lib/utils';
import { BillingAddress } from '@/enigma-components/orders/BillingAddress';
import { CancelOrderButton } from '@/enigma-components/orders/CancelOrderButton';
import { OrderDetails } from '@/enigma-components/orders/OrderDetails';
import { OrderItemList } from '@/enigma-components/orders/OrderItemList';
import { OrderStatusBadge } from '@/enigma-components/orders/OrderStatusBadge';
import { PaymentInfo } from '@/enigma-components/orders/PaymentInfo';
import { ReorderButton } from '@/enigma-components/orders/ReorderButton';
import { ShippingAddress } from '@/enigma-components/orders/ShippingAddress';
import { formatOrderPlacedDate } from './orderDetailsRuntime';

export function OrderDetailsPageLayout({ breadcrumbs, header, content }: {
  breadcrumbs: ReactNode;
  header: ReactNode;
  content: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 md:py-12 lg:px-12">
        {breadcrumbs}
        {header}
        {content}
      </div>
    </main>
  );
}

export function OrderDetailsBreadcrumbs({ order }: { order: Order }) {
  return (
    <nav className="mb-6 md:mb-8">
      <ol className="flex items-center gap-2 text-sm text-text-muted">
        <li>
          <Link href="/account/orders" className="transition-colors hover:text-primary">
            Orders
          </Link>
        </li>
        <li><span className="material-symbols-outlined text-sm">chevron_right</span></li>
        <li className="font-medium text-text-base">{formatOrderNumber(order.orderNumber)}</li>
      </ol>
    </nav>
  );
}

export function OrderDetailsHeader({ order, downloads, reorder, cancel }: {
  order: Order;
  downloads: ReactNode;
  reorder: ReactNode;
  cancel: ReactNode;
}) {
  const orderHasDigitalItems = hasDigitalItems(order);
  const orderCanBeCancelled = canCancelOrder(order);

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <h1 className="font-heading text-2xl font-bold md:text-3xl">
            {formatOrderNumber(order.orderNumber)}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-sm text-text-muted">Placed on {formatOrderPlacedDate(order.createdAt)}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {orderHasDigitalItems ? downloads : null}
        {reorder}
        {orderCanBeCancelled ? cancel : null}
      </div>
    </div>
  );
}

export function OrderDetailsDownloadAction({ order }: { order: Order }) {
  return (
    <Link
      href={`/account/orders/${order._id}/downloads`}
      className="inline-flex items-center gap-2 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-button transition-all hover:bg-primary-dark hover:shadow-button-hover"
    >
      <span className="material-symbols-outlined text-lg">download</span>
      Downloads
    </Link>
  );
}

export function OrderDetailsReorderAction({ items }: { items: OrderItem[] }) {
  return <ReorderButton items={items} />;
}

export function OrderDetailsCancelAction({ orderId }: { orderId: string }) {
  return <CancelOrderButton orderId={orderId} />;
}

export function OrderDetailsContentLayout({ primary, sidebar }: {
  primary: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-6 md:space-y-8 lg:col-span-7">{primary}</div>
      <div className="space-y-4 md:space-y-6 lg:col-span-5">{sidebar}</div>
    </div>
  );
}

export function OrderDetailsItemsRegion({ items }: { items: OrderItem[] }) {
  return (
    <>
      <h2 className="font-heading text-lg font-bold md:text-xl">Order Items</h2>
      <OrderItemList items={items} />
    </>
  );
}

export function OrderDetailsFinancialRegion({ order }: { order: Order }) {
  return <OrderDetails order={order} />;
}

export function OrderDetailsShippingRegion({ address }: { address: Address }) {
  return <ShippingAddress address={address} />;
}

export function OrderDetailsBillingAddressCondition({ billingAddress, content }: {
  billingAddress: Address | undefined;
  content: ReactNode;
}) {
  return billingAddress ? <>{content}</> : null;
}

export function OrderDetailsBillingRegion({ address }: { address: Address }) {
  return <BillingAddress address={address} />;
}

export function OrderDetailsPaymentRegion({ order }: { order: Order }) {
  return <PaymentInfo order={order} />;
}
