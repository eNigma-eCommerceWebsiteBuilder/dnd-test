import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { Product } from '@/lib/api/types';
import type { ProductCardBadge } from './productCardUtils';

interface ProductCardMediaProps {
    badge: ProductCardBadge | null;
    hoverImage?: string;
    isAdding: boolean;
    isInStock: boolean;
    isWishlistPending: boolean;
    isWishlisted: boolean;
    primaryImage: string;
    product: Product;
    productHref: string;
    showQuickAdd: boolean;
    showWishlist: boolean;
    onQuickAdd: (event: React.MouseEvent) => void;
    onWishlistToggle: (event: React.MouseEvent) => void;
}

export function ProductCardMedia({
    badge,
    hoverImage,
    isAdding,
    isInStock,
    isWishlistPending,
    isWishlisted,
    primaryImage,
    product,
    productHref,
    showQuickAdd,
    showWishlist,
    onQuickAdd,
    onWishlistToggle,
}: ProductCardMediaProps) {
    return (
        <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-card bg-bg-surface @md:mb-6">
            <Link
                href={productHref}
                className="absolute inset-0 z-0 cursor-pointer"
                aria-label={`View ${product.name}`}
            >
                <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={cn(
                        "object-cover transition-all duration-500",
                        "group-hover:scale-105",
                        hoverImage ? "group-hover:opacity-0" : null
                    )}
                />

                {hoverImage ? (
                    <Image
                        src={hoverImage}
                        alt={`${product.name} - alternate view`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                ) : null}
            </Link>

            {badge ? (
                <span
                    className={cn(
                        "absolute left-3 top-3 z-20 rounded-badge px-2 py-1 text-[9px] font-black uppercase tracking-widest @md:left-4 @md:top-4 @md:px-3 @md:py-1 @md:text-[10px]",
                        badge.type === 'sale' ? "bg-badge-sale text-badge-sale-text" : null,
                        badge.type === 'accent' ? "bg-accent text-on-accent" : null,
                        badge.type === 'default' ? "border border-border bg-bg-surface text-text-base" : null
                    )}
                >
                    {badge.text}
                </span>
            ) : null}

            {showWishlist ? (
                <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={onWishlistToggle}
                    disabled={isWishlistPending}
                    className={cn(
                        "pointer-events-auto absolute right-3 top-3 z-20 cursor-pointer rounded-full bg-bg-surface/80 p-1.5 opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-bg-surface disabled:cursor-not-allowed disabled:opacity-60 @md:right-4 @md:top-4 @md:p-2",
                        "group-hover:opacity-100"
                    )}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <span
                        className={cn(
                            "material-symbols-outlined text-lg transition-colors @md:text-xl",
                            isWishlisted ? "text-danger" : "text-text-muted hover:text-danger"
                        )}
                        style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                    >
                        favorite
                    </span>
                </button>
            ) : null}

            {!isInStock ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg-overlay/60">
                    <span className="rounded-badge bg-bg-surface px-4 py-2 text-sm font-bold text-stock-out">
                        Out of Stock
                    </span>
                </div>
            ) : null}

            {showQuickAdd && isInStock ? (
                <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={onQuickAdd}
                    disabled={isAdding}
                    className={cn(
                        "pointer-events-auto absolute bottom-3 left-3 right-3 z-20 translate-y-12 cursor-pointer rounded-button bg-bg-surface/95 py-2.5 text-xs font-bold text-text-base opacity-0 shadow-card backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-70 @md:bottom-4 @md:left-4 @md:right-4 @md:py-3 @md:text-sm",
                        "group-hover:translate-y-0 group-hover:opacity-100"
                    )}
                >
                    {isAdding ? 'Adding...' : 'Quick Add'}
                </button>
            ) : null}
        </div>
    );
}
