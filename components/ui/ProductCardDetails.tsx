import { cn } from '@/lib/utils/cn';
import type { Product } from '@/lib/api/types';
import type { FormattedPrice, StockStatusResult } from '@/lib/utils';

interface ProductCardDetailsProps {
    isWishlistPending: boolean;
    isWishlisted: boolean;
    priceInfo: FormattedPrice;
    product: Product;
    showWishlist: boolean;
    stockStatus: StockStatusResult;
    subtitle?: string;
    onWishlistToggle: (event: React.MouseEvent) => void;
}

export function ProductCardDetails({
    isWishlistPending,
    isWishlisted,
    priceInfo,
    product,
    showWishlist,
    stockStatus,
    subtitle,
    onWishlistToggle,
}: ProductCardDetailsProps) {
    return (
        <div className="space-y-1 @md:space-y-2">
            <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 text-base font-bold text-text-base transition-colors group-hover:text-primary @md:text-lg">
                    {product.name}
                </h3>
                {showWishlist ? (
                    <button
                        type="button"
                        onClick={onWishlistToggle}
                        disabled={isWishlistPending}
                        className="@md:hidden shrink-0"
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <span
                            className={cn(
                                "material-symbols-outlined text-xl",
                                isWishlisted ? "text-danger" : "text-text-light"
                            )}
                            style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                        >
                            favorite
                        </span>
                    </button>
                ) : null}
            </div>

            {subtitle ? (
                <p className="line-clamp-1 text-xs text-text-muted @md:text-sm">
                    {subtitle}
                </p>
            ) : null}

            {product.rating !== undefined && product.rating > 0 ? (
                <div className="flex items-center gap-1">
                    <span
                        className="material-symbols-outlined text-rating text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        star
                    </span>
                    <span className="text-xs font-bold text-text-base">
                        {product.rating.toFixed(1)}
                    </span>
                    {product.reviewCount !== undefined && product.reviewCount > 0 ? (
                        <span className="ml-1 text-xs text-text-muted">
                            ({product.reviewCount} {product.reviewCount === 1 ? 'Review' : 'Reviews'})
                        </span>
                    ) : null}
                </div>
            ) : null}

            <div className="flex items-center gap-2 pt-1 @md:pt-2">
                <span className="text-lg font-black text-price @md:text-xl">
                    {priceInfo.current}
                </span>
                {priceInfo.isOnSale && priceInfo.original ? (
                    <span className="text-sm text-price-original line-through">
                        {priceInfo.original}
                    </span>
                ) : null}
            </div>

            {product.freeShipping ? (
                <div className="flex items-center gap-1 text-xs font-medium text-success">
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    Free Shipping
                </div>
            ) : null}

            {stockStatus.status === 'low' ? (
                <div className={cn("text-xs font-medium", stockStatus.className)}>
                    {stockStatus.text}
                </div>
            ) : null}
        </div>
    );
}
