'use client';

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
    hrefPrefix?: string;
}

export const ProductCard = ({
    product,
    showWishlist = true,
    showQuickAdd = true,
    className,
    hrefPrefix = '/products'
}: ProductCardProps) => {
    const { addItem } = useCart(false);
    const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist();
    const { success, error: showError } = useToast();
    const [isAdding, setIsAdding] = useState(false);
    const [isWishlistPending, startWishlistTransition] = useTransition();
    const productId = product.id || product._id;
    const productHref = `${hrefPrefix}/${product.slug || productId}`;
    const isInStock = product.inStock !== false;
    const isWishlisted = productId ? isInWishlist(productId) : false;

    const stockStatus = formatStockStatus({
        stock: product.stock,
        inStock: isInStock,
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

        if (!productId) {
            showError('Product is missing an ID');
            return;
        }

        if (!isInStock) {
            showError('Product is out of stock');
            return;
        }

        setIsAdding(true);
        try {
            await addItem(productId, 1);
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
            if (!productId) {
                showError('Product is missing an ID');
                return;
            }

            try {
                if (isWishlisted) {
                    await removeWishlistItem(productId);
                    success('Removed from wishlist');
                } else {
                    await addWishlistItem(productId);
                    success('Added to wishlist');
                }
            } catch {
                showError('Failed to update wishlist');
            }
        });
    };

    return (
        <article
            className={cn("@container group w-full", className)}
        >
            <ProductCardMedia
                badge={badge}
                hoverImage={hoverImage}
                isAdding={isAdding}
                isInStock={isInStock}
                isWishlistPending={isWishlistPending}
                isWishlisted={isWishlisted}
                primaryImage={primaryImage}
                product={product}
                productHref={productHref}
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
        </article>
    );
};

export default ProductCard;
