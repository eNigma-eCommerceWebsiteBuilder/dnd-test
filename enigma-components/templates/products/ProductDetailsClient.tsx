'use client';

import { useState } from 'react';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { QuantityInput } from '@/components/products/QuantityInput';
import { VariantSelector } from '@/components/products/VariantSelector';
import { WishlistButton } from '@/components/products/WishlistButton';
import { useProductView } from '@/lib/analytics';
import type { Product } from '@/lib/api/types';

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  useProductView(product);

  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0]?.name || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const selectedVariant = product.variants?.find(
    (variant) => variant.color?.name === selectedColor && variant.size === selectedSize,
  );
  const isInStock = product.inStock && (selectedVariant ? (selectedVariant.stock ?? 0) > 0 && selectedVariant.isActive !== false : product.stock > 0);
  const maxQuantity = Math.min(selectedVariant?.stock ?? product.stock ?? 99, 99);

  return (
    <div className="space-y-6">
      {(product.colors?.length || product.sizes?.length) ? (
        <VariantSelector colors={product.colors} sizes={product.sizes} variants={product.variants} selectedColor={selectedColor} selectedSize={selectedSize} onColorChange={setSelectedColor} onSizeChange={setSelectedSize} />
      ) : null}
      <div className="flex gap-4 pt-4">
        <QuantityInput value={quantity} onChange={setQuantity} min={1} max={maxQuantity} disabled={!isInStock} />
        <AddToCartButton productId={product._id} quantity={quantity} variantId={selectedVariant?._id} inStock={isInStock} />
        <WishlistButton productId={product._id} variantId={selectedVariant?._id} />
      </div>
    </div>
  );
}
