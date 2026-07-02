'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useCart, useToast, useWishlist } from '@/lib/hooks';
import { formatProductPrice, formatStockStatus } from '@/lib/utils/formatters';
import type { Product } from '@/lib/api/types';
import { ProductCardDetails } from './ProductCardDetails';
import { ProductCardMedia } from './ProductCardMedia';
import {
    getProductCardBadge,
    getProductCardImages,
    getProductCardSubtitle,
} from './productCardUtils';

interface ProductCardProps {
    product: Product;
    showWishlist?: boolean;
    showQuickAdd?: boolean;
    className?: string;
}

export const ProductCard = ({
    product,
    showWishlist = true,
    showQuickAdd = true,
    className
}: ProductCardProps) => {
    const { addItem } = useCart(false);
    const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist();
    const { success, error: showError } = useToast();
    const [isAdding, setIsAdding] = useState(false);
    const [isWishlistPending, startWishlistTransition] = useTransition();
    const isWishlisted = isInWishlist(product._id);

    const stockStatus = formatStockStatus({
        stock: product.stock,
        inStock: product.inStock,
        stockThreshold: product.stockThreshold,
    });
    const priceInfo = formatProductPrice({
        price: product.price,
        salePrice: product.salePrice ?? undefined,
        originalPrice: product.originalPrice,
        isOnSale: product.isOnSale || product.onSale,
    });
    const { primaryImage, hoverImage } = getProductCardImages(product);
    const badge = getProductCardBadge(product, priceInfo);
    const subtitle = getProductCardSubtitle(product);

    const handleQuickAdd = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!product.inStock) {
            showError('Product is out of stock');
            return;
        }

        setIsAdding(true);
        try {
            await addItem(product._id, 1);
            success('Added to cart');
        } catch {
            showError('Failed to add to cart');
        } finally {
            setIsAdding(false);
        }
    };

    const handleWishlistToggle = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        startWishlistTransition(async () => {
            try {
                if (isWishlisted) {
                    await removeWishlistItem(product._id);
                    success('Removed from wishlist');
                } else {
                    await addWishlistItem(product._id);
                    success('Added to wishlist');
                }
            } catch {
                showError('Failed to update wishlist');
            }
        });
    };

    return (
        <Link
            href={`/products/${product.slug || product._id}`}
            className={cn("@container group w-full cursor-pointer", className)}
        >
            <ProductCardMedia
                badge={badge}
                hoverImage={hoverImage}
                isAdding={isAdding}
                isWishlistPending={isWishlistPending}
                isWishlisted={isWishlisted}
                primaryImage={primaryImage}
                product={product}
                showQuickAdd={showQuickAdd}
                showWishlist={showWishlist}
                onQuickAdd={handleQuickAdd}
                onWishlistToggle={handleWishlistToggle}
            />
            <ProductCardDetails
                isWishlistPending={isWishlistPending}
                isWishlisted={isWishlisted}
                priceInfo={priceInfo}
                product={product}
                showWishlist={showWishlist}
                stockStatus={stockStatus}
                subtitle={subtitle}
                onWishlistToggle={handleWishlistToggle}
            />
        </Link>
    );
};

export default ProductCard;
