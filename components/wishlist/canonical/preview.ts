import type { WishlistItem } from '@/lib/api/types/wishlist';

// Used only while Puck is editing a seed that has no live share token.
export const sharedWishlistPreviewItems: WishlistItem[] = [
  {
    _id: 'shared-wishlist-preview-1',
    productId: 'shared-wishlist-preview-product-1',
    priceWhenAdded: 180,
    notifyOnPriceDrop: false,
    notifyOnBackInStock: false,
    addedAt: '2026-01-01T00:00:00.000Z',
    product: {
      _id: 'shared-wishlist-preview-product-1',
      name: 'Preview Wool Scarf',
      slug: 'preview-wool-scarf',
      price: 180,
      images: [],
      stock: 1,
      inStock: true,
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    productSnapshot: {
      name: 'Preview Wool Scarf',
      image: '',
      price: 180,
      inStock: true,
      variantLabel: 'Stone',
    },
  },
  {
    _id: 'shared-wishlist-preview-2',
    productId: 'shared-wishlist-preview-product-2',
    priceWhenAdded: 240,
    notifyOnPriceDrop: false,
    notifyOnBackInStock: false,
    addedAt: '2026-01-01T00:00:00.000Z',
    product: {
      _id: 'shared-wishlist-preview-product-2',
      name: 'Preview Leather Tote',
      slug: 'preview-leather-tote',
      price: 240,
      images: [],
      stock: 1,
      inStock: true,
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    productSnapshot: {
      name: 'Preview Leather Tote',
      image: '',
      price: 240,
      inStock: true,
      variantLabel: 'Espresso',
    },
  },
];
