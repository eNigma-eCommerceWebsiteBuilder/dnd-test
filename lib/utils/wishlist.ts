/**
 * Wishlist Utility Functions
 * Pure helper functions for wishlist operations, calculations, and formatting
 */

import type { Wishlist, WishlistItem } from '@/lib/api/types/wishlist';

/**
 * Generate unique key for wishlist item
 * Used for Maps, Sets, and React keys
 * 
 * @param productId - Product ID
 * @param variantId - Optional variant ID
 * @returns Unique key string
 * 
 * @example
 * getWishlistItemKey('prod-123') // => 'prod-123'
 * getWishlistItemKey('prod-123', 'var-456') // => 'prod-123:var-456'
 */
export function getWishlistItemKey(productId: string, variantId?: string): string {
    if (!productId) {
        throw new Error('Product ID is required');
    }
    return variantId ? `${productId}:${variantId}` : productId;
}

/**
 * Check if product exists in wishlist
 * 
 * @param wishlist - Wishlist object
 * @param productId - Product ID to check
 * @param variantId - Optional variant ID
 * @returns True if product is in wishlist
 * 
 * @example
 * isProductInWishlist(wishlist, 'prod-123') // => true
 */
export function isProductInWishlist(
    wishlist: Wishlist | null | undefined,
    productId: string,
    variantId?: string
): boolean {
    if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
        return false;
    }

    if (!productId) {
        return false;
    }

    return wishlist.items.some(item => {
        const productMatch = item.productId === productId;
        if (!variantId) {
            return productMatch && !item.variantId;
        }
        return productMatch && item.variantId === variantId;
    });
}

export interface WishlistSavings {
    totalSavings: number;
    itemsOnSale: number;
    averageDiscount: number;
    potentialValue: number;
}

/**
 * Calculate total potential savings in wishlist
 * Compares current prices with original prices
 * 
 * @param wishlist - Wishlist object
 * @returns Savings breakdown
 * 
 * @example
 * calculateWishlistSavings(wishlist)
 * // => { totalSavings: 45.50, itemsOnSale: 3, averageDiscount: 15, potentialValue: 299.99 }
 */
export function calculateWishlistSavings(wishlist: Wishlist | null | undefined): WishlistSavings {
    const result: WishlistSavings = {
        totalSavings: 0,
        itemsOnSale: 0,
        averageDiscount: 0,
        potentialValue: 0,
    };

    if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
        return result;
    }

    let totalDiscountPercentage = 0;

    for (const item of wishlist.items) {
        const currentPrice = item.product?.price || 0;
        const originalPrice = item.product?.compareAtPrice || item.product?.price || 0;

        result.potentialValue += currentPrice;

        if (originalPrice > currentPrice) {
            const savings = originalPrice - currentPrice;
            result.totalSavings += savings;
            result.itemsOnSale++;

            const discountPercentage = ((originalPrice - currentPrice) / originalPrice) * 100;
            totalDiscountPercentage += discountPercentage;
        }
    }

    if (result.itemsOnSale > 0) {
        result.averageDiscount = Math.round(totalDiscountPercentage / result.itemsOnSale);
    }

    // Round to 2 decimal places
    result.totalSavings = Math.round(result.totalSavings * 100) / 100;
    result.potentialValue = Math.round(result.potentialValue * 100) / 100;

    return result;
}

/**
 * Format wishlist share URL
 * 
 * @param shareToken - Share token from API
 * @param baseUrl - Optional base URL (defaults to current origin)
 * @returns Full share URL
 * 
 * @example
 * formatWishlistShareUrl('abc123')
 * // => 'https://example.com/wishlist/shared/abc123'
 */
export function formatWishlistShareUrl(shareToken: string, baseUrl?: string): string {
    if (!shareToken) {
        throw new Error('Share token is required');
    }

    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${base}/wishlist/shared/${shareToken}`;
}

export interface GroupedWishlist {
    available: WishlistItem[];
    outOfStock: WishlistItem[];
    lowStock: WishlistItem[];
}

/**
 * Group wishlist items by availability status
 * 
 * @param wishlist - Wishlist object
 * @param lowStockThreshold - Threshold for low stock (default: 5)
 * @returns Grouped items
 * 
 * @example
 * groupWishlistByAvailability(wishlist, 10)
 * // => { available: [...], outOfStock: [...], lowStock: [...] }
 */
export function groupWishlistByAvailability(
    wishlist: Wishlist | null | undefined,
    lowStockThreshold: number = 5
): GroupedWishlist {
    const result: GroupedWishlist = {
        available: [],
        outOfStock: [],
        lowStock: [],
    };

    if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
        return result;
    }

    for (const item of wishlist.items) {
        const stock = item.product?.stock;
        const inStock = item.product?.inStock !== false;

        if (!inStock || stock === 0) {
            result.outOfStock.push(item);
        } else if (stock !== undefined && stock <= lowStockThreshold && stock > 0) {
            result.lowStock.push(item);
        } else {
            result.available.push(item);
        }
    }

    return result;
}
