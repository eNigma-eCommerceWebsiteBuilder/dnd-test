import { cn } from '@/lib/utils/cn';
import { getCart } from '@/lib/api/services/cart';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CartSummaryViewProps {
  subtotal: number;
  shipping?: number;
  tax?: number;
  total: number;
  itemCount: number;
  savings?: number;
  showPromoCode?: string;
  showTaxEstimate?: string;
  showTrustBadges?: string;
  checkoutLabel?: string;
  checkoutHref?: string;
  className?: string;
}

export const puckComponentName = 'CartSummary';
export const puckLabel = 'Cart Summary';
export const puckCategory = 'Cart';

export const puckFields = {
  subtotal: { type: 'number' as const, label: 'Subtotal' },
  shipping: { type: 'number' as const, label: 'Shipping (0 = Free, empty = calculated at checkout)' },
  tax: { type: 'number' as const, label: 'Estimated Tax' },
  total: { type: 'number' as const, label: 'Total' },
  itemCount: { type: 'number' as const, label: 'Item Count' },
  savings: { type: 'number' as const, label: 'Savings' },
  showPromoCode: {
    type: 'select' as const,
    label: 'Show Promo Code Input',
    options: [
      { label: 'No', value: 'false' },
      { label: 'Yes', value: 'true' },
    ],
  },
  showTaxEstimate: {
    type: 'select' as const,
    label: 'Show Tax Estimate Form',
    options: [
      { label: 'No', value: 'false' },
      { label: 'Yes', value: 'true' },
    ],
  },
  showTrustBadges: {
    type: 'select' as const,
    label: 'Show Trust Badges',
    options: [
      { label: 'No', value: 'false' },
      { label: 'Yes', value: 'true' },
    ],
  },
  checkoutLabel: { type: 'text' as const, label: 'Checkout Button Label' },
  checkoutHref: { type: 'text' as const, label: 'Checkout Button Link' },
};

export const puckDefaults = {
  subtotal: 1930,
  shipping: 0,
  tax: 0,
  total: 1930,
  itemCount: 3,
  savings: 0,
  showPromoCode: 'true',
  showTaxEstimate: 'true',
  showTrustBadges: 'true',
  checkoutLabel: 'Proceed to Checkout',
  checkoutHref: '/checkout',
};

export async function puckDataFetcher(
  _props: CartSummaryViewProps,
  context?: PuckFetcherContext,
) {
  const cart = await getCart({ cookies: context?.metadata?.requestCookies });
  const subtotal = cart.subtotal ?? cart.totalPrice ?? 0;
  const total = cart.total ?? cart.totalPrice ?? subtotal;
  return {
    subtotal,
    tax: cart.tax ?? 0,
    total,
    itemCount: cart.totalItems,
  };
}

export function CartSummaryView({
  subtotal = 0,
  shipping,
  tax,
  total = 0,
  itemCount = 0,
  savings = 0,
  showPromoCode = 'true',
  showTaxEstimate = 'true',
  showTrustBadges = 'true',
  checkoutLabel = 'Proceed to Checkout',
  checkoutHref = '/checkout',
  className,
}: CartSummaryViewProps) {
  return (
    <div className={cn(
      '@container bg-bg-surface rounded-card border border-border p-6 @sm:p-8 shadow-card',
      className
    )}>
      <h3 className="text-lg @sm:text-xl font-bold text-text-base mb-4 @sm:mb-6">
        Order Summary
      </h3>
      <p className="mb-4 text-xs font-medium text-text-muted">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
      </p>
      <div className="space-y-3 @sm:space-y-4 mb-6 @sm:mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-medium text-text-base">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        {savings > 0 ? (
          <div className="flex justify-between text-sm">
            <span className="text-success">Savings</span>
            <span className="font-medium text-success">
              -${savings.toFixed(2)}
            </span>
          </div>
        ) : null}
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Shipping</span>
          <span className="font-medium text-primary">
            {shipping === 0 ? 'Free' :
              shipping && shipping > 0 ? `$${shipping.toFixed(2)}` : 'Calculated at checkout'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Estimated Tax</span>
          <span className="font-medium text-text-base">
            {tax && tax > 0 ? `$${tax.toFixed(2)}` : '—'}
          </span>
        </div>
        <div className="pt-3 @sm:pt-4 border-t border-divider flex justify-between">
          <span className="text-base @sm:text-lg font-bold text-text-base">Total</span>
          <span className="text-base @sm:text-lg font-bold text-text-base">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
      {showTaxEstimate === 'true' ? (
        <div className="mb-4 @sm:mb-6 rounded-button border border-border bg-bg-sunken p-4">
          <p className="text-xs font-semibold text-text-base mb-2">Estimate Tax</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ZIP / Postal Code"
              className="flex-1 rounded-button border border-border bg-bg-surface px-3 py-2 text-sm text-text-base"
              readOnly
            />
            <button
              type="button"
              className="rounded-button border border-border px-4 py-2 text-sm font-medium text-text-base hover:border-primary transition-colors"
            >
              Calculate
            </button>
          </div>
        </div>
      ) : null}
      {showPromoCode === 'true' ? (
        <div className="mb-6 @sm:mb-8 rounded-button border border-border bg-bg-sunken p-4">
          <p className="text-xs font-semibold text-text-base mb-2">Promo Code</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-1 rounded-button border border-border bg-bg-surface px-3 py-2 text-sm text-text-base"
              readOnly
            />
            <button
              type="button"
              className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-dark transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      ) : null}
      <a
        href={checkoutHref}
        className="flex w-full items-center justify-center gap-2 rounded-button bg-cta-primary px-6 py-4 text-sm font-bold text-on-primary shadow-button transition-all hover:bg-cta-primary-hover hover:-translate-y-0.5 hover:shadow-button-hover"
      >
        <span className="material-symbols-outlined text-lg">lock</span>
        {checkoutLabel}
      </a>
      {showTrustBadges === 'true' ? (
        <>
          <div className="mt-4 @sm:mt-6 flex flex-col gap-2 @sm:gap-3">
            <div className="flex items-center gap-2 @sm:gap-3 text-xs text-text-muted">
              <span className="material-symbols-outlined text-base">lock</span>
              Secure checkout with SSL encryption
            </div>
            <div className="flex items-center gap-2 @sm:gap-3 text-xs text-text-muted">
              <span className="material-symbols-outlined text-base">refresh</span>
              30-day free returns on all orders
            </div>
          </div>
          <div className="mt-6 @sm:mt-8 flex items-center gap-3 @sm:gap-4 opacity-disabled grayscale hover:grayscale-0 transition-all">
            <div className="w-8 @sm:w-10 h-5 @sm:h-6 bg-bg-skeleton rounded-badge" />
            <div className="w-8 @sm:w-10 h-5 @sm:h-6 bg-bg-skeleton rounded-badge" />
            <div className="w-8 @sm:w-10 h-5 @sm:h-6 bg-bg-skeleton rounded-badge" />
            <div className="w-8 @sm:w-10 h-5 @sm:h-6 bg-bg-skeleton rounded-badge" />
          </div>
        </>
      ) : null}
    </div>
  );
}
