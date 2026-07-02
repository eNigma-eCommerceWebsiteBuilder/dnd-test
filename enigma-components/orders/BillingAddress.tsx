import { Address } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';

/**
 * BillingAddress Component (Server)
 * 
 * Displays the billing address for an order.
 */
interface BillingAddressProps {
    address: Address;
    className?: string;
}

export function BillingAddress({ address, className }: BillingAddressProps) {
    return (
        <div className={cn("@container bg-bg-surface rounded-card p-4 @md:p-6 shadow-card border border-border", className)}>
            <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">receipt</span>
                <h3 className="font-bold text-text-base">Billing Address</h3>
            </div>

            <div className="text-sm @md:text-base text-text-muted leading-relaxed">
                <p className="text-text-base font-medium mb-1">{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                {address.phone && <p className="mt-2">{address.phone}</p>}
            </div>
        </div>
    );
}
