import { cn } from '@/lib/utils/cn';
import { formatCardExpiry, getPaymentMethodLabel } from '@/lib/utils/ecommerce';
import { CardBrandIcon } from './CardBrandIcon';
import { DefaultBadge } from './DefaultBadge';
import { DeleteCardButton } from './DeleteCardButton';
import { ExpiringWarning } from './ExpiringWarning';
import { SetDefaultButton } from './SetDefaultButton';
import type { PaymentMethodCardProps } from './types';

export function PaymentMethodCard({ method, className }: PaymentMethodCardProps) {
    if (!method) return null;

    const brand = method.card?.brand || method.id || 'unknown';
    const brandLabel = method.card
        ? `${brand.charAt(0).toUpperCase()}${brand.slice(1)}`
        : getPaymentMethodLabel(method.type || brand);
    const maskedLastFour = method.card?.last4 ? `•••• ${method.card.last4}` : '';
    const expiry = method.card ? formatCardExpiry(method.card.expMonth, method.card.expYear) : '';

    return (
        <div
            className={cn(
                "@container group flex w-full flex-col items-start justify-between gap-6 rounded-card border border-border bg-bg-surface p-6 shadow-card transition-shadow hover:shadow-card-hover @md:flex-row @md:items-center",
                className
            )}
        >
            <div className="flex w-full items-center gap-5 @md:w-auto">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-image border border-border bg-bg-sunken p-2">
                    <CardBrandIcon brand={brand} />
                </div>

                <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <p className="font-bold text-text-base">
                            {brandLabel} {maskedLastFour}
                        </p>
                        {method.isDefault ? <DefaultBadge /> : null}
                        {method.card ? (
                            <ExpiringWarning
                                expMonth={method.card.expMonth}
                                expYear={method.card.expYear}
                            />
                        ) : null}
                    </div>
                    {expiry ? (
                        <p className="text-sm text-text-muted">
                            Expires {expiry}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="mt-2 flex w-full items-center gap-3 @md:mt-0 @md:w-auto">
                {!method.isDefault ? (
                    <SetDefaultButton
                        paymentMethodId={method.id}
                        isDefault={method.isDefault}
                    />
                ) : null}
                <div className="flex-1 @md:flex-none" />
                <DeleteCardButton paymentMethodId={method.id} />
            </div>
        </div>
    );
}
