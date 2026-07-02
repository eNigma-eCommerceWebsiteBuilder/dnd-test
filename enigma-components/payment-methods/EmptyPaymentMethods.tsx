import { cn } from '@/lib/utils/cn';

interface EmptyPaymentMethodsProps {
    className?: string;
}

export function EmptyPaymentMethods({ className }: EmptyPaymentMethodsProps) {
    return (
        <div
            className={cn(
                "@container flex flex-col items-center justify-center rounded-card border border-border border-dashed bg-bg-surface p-8 text-center @md:p-12",
                className
            )}
        >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-sunken">
                <span className="material-symbols-outlined text-3xl text-text-muted">
                    credit_card_off
                </span>
            </div>
            <h3 className="mb-2 text-lg font-bold font-heading text-text-base">
                No payment methods saved
            </h3>
            <p className="mx-auto max-w-xs text-sm text-text-muted">
                Save your credit or debit card securely for a faster checkout experience.
            </p>
        </div>
    );
}
