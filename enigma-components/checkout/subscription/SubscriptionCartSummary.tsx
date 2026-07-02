import { cn } from '@/lib/utils/cn';
import SubscriptionCartItem, { type SubscriptionCartSummaryItem } from '@/components/checkout/subscription/SubscriptionCartItem';

export type { SubscriptionCartSummaryItem };

interface SubscriptionCartSummaryProps {
    items: SubscriptionCartSummaryItem[];
    title?: string;
    currency?: string;
    className?: string;
}

export default function SubscriptionCartSummary({
    items,
    title = 'Subscription Summary',
    currency = 'USD',
    className,
}: SubscriptionCartSummaryProps) {
    return (
        <section
            className={cn(
                '@container w-full rounded-card border border-border bg-bg-surface/80 backdrop-blur-overlay p-6 shadow-card space-y-5',
                className
            )}
        >
            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-text-base">{title}</h3>
                <p className="text-sm text-text-muted">Review your subscription items.</p>
            </div>
            <div className="space-y-6">
                {items.map((item) => (
                    <SubscriptionCartItem
                        key={item.id}
                        item={item}
                        currency={currency}
                    />
                ))}
            </div>
        </section>
    );
}
