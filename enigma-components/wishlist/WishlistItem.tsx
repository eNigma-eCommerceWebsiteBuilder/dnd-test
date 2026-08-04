'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';
import type { WishlistItem as WishlistItemType } from '@/lib/api/types/wishlist';
import { MoveToCartButton } from '@/enigma-components/wishlist/MoveToCartButton';
import { RemoveButton } from '@/enigma-components/wishlist/RemoveButton';
import { NotificationToggle } from '@/enigma-components/wishlist/NotificationToggle';

interface WishlistItemProps {
  item: WishlistItemType;
  className?: string;
}

export function WishlistItem({ item, className }: WishlistItemProps) {
  const product = item.product;
  const imageUrl =
    item.productSnapshot.image || product.imageUrl || product.images?.[0] || '';
  const stockThreshold = product.stockThreshold ?? 5;
  const inStock = product.inStock && product.stock !== 0;

  const stockLabel = inStock
    ? product.stock <= stockThreshold
      ? `Low Stock (${product.stock})`
      : 'In Stock'
    : 'Out of Stock';

  const stockTone = inStock
    ? product.stock <= stockThreshold
      ? 'bg-stock-low'
      : 'bg-stock-available'
    : 'bg-stock-out';

  const currentPrice = product.price ?? item.productSnapshot.price;
  const originalPrice =
    item.productSnapshot.originalPrice || product.compareAtPrice || undefined;
  const showOriginal = originalPrice !== undefined && originalPrice > currentPrice;

  return (
    <article
      className={cn(
        '@container group w-full bg-bg-surface border border-border rounded-card shadow-card overflow-hidden flex flex-col transition-shadow hover:shadow-card-hover',
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-sunken">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.productSnapshot.name}
            fill
            className="object-cover transition-transform duration-normal group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-text-muted">
              image
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <RemoveButton productId={item.productId} variantId={item.variantId} />
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="bg-bg-elevated/90 backdrop-blur rounded-badge px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-base flex items-center gap-2">
            <span className={cn('w-2 h-2 rounded-full', stockTone)} />
            {stockLabel}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-semibold text-base @md:text-lg text-text-base leading-snug">
            {item.productSnapshot.name}
          </h3>
          <div className="text-right">
            <p className="font-semibold text-base @md:text-lg text-price">
              {formatPrice(currentPrice)}
            </p>
            {showOriginal ? (
              <p className="text-xs text-price-original line-through">
                {formatPrice(originalPrice)}
              </p>
            ) : null}
          </div>
        </div>

        {item.productSnapshot.variantLabel ? (
          <p className="text-sm text-text-muted mb-4">
            {item.productSnapshot.variantLabel}
          </p>
        ) : (
          <div className="mb-4" />
        )}

        <div className="mt-auto space-y-4">
          <div className="bg-bg-sunken rounded-card px-3 py-2">
            <NotificationToggle
              productId={item.productId}
              variantId={item.variantId}
              inStock={inStock}
            />
          </div>

          <MoveToCartButton
            productId={item.productId}
            variantId={item.variantId}
            productName={item.productSnapshot.name}
            price={currentPrice}
            disabled={!inStock}
          />
        </div>
      </div>
    </article>
  );
}
