import { cn } from '@/lib/utils/cn';
import { formatStockStatus } from '@/lib/utils/formatters';

interface StockIndicatorProps {
    stock: number;
    inStock: boolean;
    stockThreshold?: number;
    className?: string;
}

/**
 * StockIndicator Component (Server)
 * 
 * Displays in/low/out of stock status badge.
 * Uses formatStockStatus utility for status logic.
 */
export function StockIndicator({
    stock,
    inStock,
    stockThreshold = 5,
    className
}: StockIndicatorProps) {
    const status = formatStockStatus({ stock, inStock, stockThreshold });

    // Map status to styling
    const getStatusStyles = () => {
        switch (status.status) {
            case 'available':
                return 'bg-success/10 text-success';
            case 'low':
                return 'bg-warning/10 text-warning';
            case 'out':
                return 'bg-danger/10 text-stock-out';
            default:
                return 'bg-bg-surface text-text-muted';
        }
    };

    const getIcon = () => {
        switch (status.status) {
            case 'available':
                return 'check_circle';
            case 'low':
                return 'warning';
            case 'out':
                return 'cancel';
            default:
                return 'info';
        }
    };

    return (
        <div
            className={cn(
                "@container inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide",
                getStatusStyles(),
                className
            )}
        >
            <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
            >
                {getIcon()}
            </span>
            {status.text}
        </div>
    );
}

export default StockIndicator;
