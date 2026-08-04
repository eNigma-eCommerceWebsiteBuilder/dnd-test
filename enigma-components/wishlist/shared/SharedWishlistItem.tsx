'use client';

import Image from 'next/image';
import type { WishlistItem } from '@/lib/api/types/wishlist';
import { AddToCartFromShared } from '@/enigma-components/wishlist/shared/AddToCartFromShared';
import { formatPrice } from '@/lib/utils/formatters';

interface SharedWishlistItemProps {
  item: WishlistItem;
}

export function SharedWishlistItem({ item }: SharedWishlistItemProps) {
  const name = item.product?.name || item.productSnapshot?.name || 'Wishlist item';
  const image = item.product?.imageUrl || item.product?.images?.[0] || item.productSnapshot?.image;
  const variant = item.productSnapshot?.variantLabel;
  const price = item.product?.salePrice ?? item.product?.price ?? item.productSnapshot?.price ?? item.priceWhenAdded;
  const inStock = item.product?.inStock ?? item.productSnapshot?.inStock ?? true;

  return (
    <article className="@container group flex w-full flex-col overflow-hidden rounded-card border border-border bg-bg-surface shadow-card">
      <div className="relative w-full overflow-hidden bg-bg-sunken">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover aspect-square transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center text-text-muted">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Wishlist item
        </p>
        <h3 className="text-base font-semibold text-text-base">
          {name}
        </h3>
        {variant ? (
          <p className="text-sm text-text-muted">{variant}</p>
        ) : null}
        {typeof price === 'number' ? (
          <p className="text-sm font-semibold text-price">
            {formatPrice(price)}
          </p>
        ) : null}
      </div>

      <div className="p-4 pt-0">
        <AddToCartFromShared
          productId={item.productId}
          inStock={inStock}
        />
      </div>
    </article>
  );
}
