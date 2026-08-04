import type { Cart } from '@/lib/hooks';

// This data exists only for the Puck editor when there is no browser cart.
export const cartPreview: Cart = {
  _id: 'puck-cart-preview',
  totalItems: 1,
  subtotal: 120,
  total: 120,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  items: [{
    productId: 'puck-cart-preview-product',
    quantity: 1,
    price: 120,
    subtotal: 120,
    product: {
      _id: 'puck-cart-preview-product',
      name: 'Preview Wool Scarf',
      slug: 'preview-wool-scarf',
      price: 120,
      images: ['/placeholder.jpg'],
      stock: 1,
      inStock: true,
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  }],
};
