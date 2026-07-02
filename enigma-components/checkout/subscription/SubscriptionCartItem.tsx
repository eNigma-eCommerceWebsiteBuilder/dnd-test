import { cn } from '@/lib/utils/cn';
import Image from 'next/image';
import RecurringPriceDisplay from '@/components/checkout/subscription/RecurringPriceDisplay';
import OriginalPriceDisplay from '@/components/checkout/subscription/OriginalPriceDisplay';
import SellingPlanBadge from '@/components/checkout/subscription/SellingPlanBadge';
import SavingsDisplay from '@/components/checkout/subscription/SavingsDisplay';

export interface SubscriptionCartSummaryItem {
    id: string;
    name: string;
    imageUrl?: string;
    imageAlt?: string;
    variantLabel?: string;
    quantity?: number;
    sellingPlanLabel?: string;
    intervalLabel?: string;
    recurringPrice?: number;
    originalPrice?: number;
    savingsAmount?: number;
    savingsPercent?: number;
}

interface SubscriptionCartItemProps {
    item: SubscriptionCartSummaryItem;
    currency?: string;
    className?: string;
}

export default function SubscriptionCartItem({
    item,
    currency = 'USD',
    className,
}: SubscriptionCartItemProps) {
    const badgeLabel = item.sellingPlanLabel
        ? item.savingsPercent
            ? `${item.sellingPlanLabel} (${item.savingsPercent}% off)`
            : item.sellingPlanLabel
        : item.savingsPercent
            ? `${item.savingsPercent}% off`
            : undefined;

    return (
        <div className={cn('@container w-full flex gap-4', className)}>
            <div className="w-24 h-24 shrink-0 overflow-hidden rounded-image bg-bg-sunken">
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.imageAlt || item.name}
                        width={96}
                        height={96}
                        sizes="96px"
                        className="h-full w-full object-cover"
                    />
                ) : null}
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-text-base">
                            {item.name}
                        </h4>
                        {item.variantLabel ? (
                            <p className="text-xs text-text-muted">
                                {item.variantLabel}
                            </p>
                        ) : null}
                        {typeof item.quantity === 'number' ? (
                            <p className="text-xs text-text-muted">
                                Qty {item.quantity}
                            </p>
                        ) : null}
                    </div>
                    <div className="text-right space-y-1">
                        {typeof item.recurringPrice === 'number' ? (
                            <RecurringPriceDisplay
                                amount={item.recurringPrice}
                                intervalLabel={item.intervalLabel}
                                currency={currency}
                                className="text-sm"
                            />
                        ) : null}
                        {typeof item.originalPrice === 'number' ? (
                            <OriginalPriceDisplay
                                amount={item.originalPrice}
                                currency={currency}
                                className="text-xs"
                            />
                        ) : null}
                    </div>
                </div>
                {badgeLabel ? <SellingPlanBadge label={badgeLabel} /> : null}
                {typeof item.savingsAmount === 'number' ? (
                    <SavingsDisplay
                        amount={item.savingsAmount}
                        intervalLabel={item.intervalLabel}
                        currency={currency}
                    />
                ) : null}
            </div>
        </div>
    );
}
