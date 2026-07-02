import { cn } from '@/lib/utils/cn';
import { formatProductPrice } from '@/lib/utils/formatters';

interface PriceDisplayProps {
    price: number;
    salePrice?: number | null;
    originalPrice?: number;
    isOnSale?: boolean;
    className?: string;
    size?: 'default' | 'large';
}

export function PriceDisplay({
    price,
    salePrice,
    originalPrice,
    isOnSale,
    className,
    size = 'default'
}: PriceDisplayProps) {
    const priceInfo = formatProductPrice({
        price,
        salePrice: salePrice ?? undefined,
        originalPrice,
        isOnSale,
    });

    return (
        <div className={cn("@container flex items-center gap-3", className)}>
            <span
                className={cn(
                    "font-bold text-price",
                    size === 'large' ? "text-3xl" : "text-2xl"
                )}
            >
                {priceInfo.current}
            </span>

            {priceInfo.isOnSale && priceInfo.original && (
                <span className="text-price-original line-through text-lg">
                    {priceInfo.original}
                </span>
            )}

            {priceInfo.isOnSale && priceInfo.discount && (
                <span className="px-2 py-0.5 bg-badge-sale text-badge-sale-text text-xs font-bold rounded-badge">
                    -{priceInfo.discount}
                </span>
            )}
        </div>
    );
}

export default PriceDisplay;
