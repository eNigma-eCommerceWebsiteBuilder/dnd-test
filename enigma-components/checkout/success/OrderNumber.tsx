import { cn } from '@/lib/utils/cn';

/**
 * OrderNumber Component
 * 
 * Displays the styled order confirmation number.
 * 
 * Design Principles:
 * - Theme colors (text-primary)
 * - Fluid typography
 */
interface OrderNumberProps {
    orderNumber: string;
    className?: string;
}

export function OrderNumber({ orderNumber, className }: OrderNumberProps) {
    return (
        <div className={cn("@container", className)}>
            <p className="text-sm font-medium tracking-wide text-primary @md:text-base">
                CONFIRMATION #{orderNumber}
            </p>
        </div>
    );
}
