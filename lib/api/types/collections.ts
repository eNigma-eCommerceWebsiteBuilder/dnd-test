/**
 * Collection type definitions
 */

import type { Product } from './products';

export interface CuratedCollection {
  id: string;
  _id?: string; // Backend field, kept for compatibility
  name: string;
  slug?: string;
  description?: string;
  type: 'curated';
  mainProduct: Product;
  relatedProducts: Product[];
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InspirationCollection {
  id?: string;
  _id?: string; // Backend field, kept for compatibility
  name?: string;
  slug?: string;
  description?: string;
  type: 'inspiration';
  title: string;
  subtitle: string;
  mainImage: {
    imageUrl: string;
    alt?: string;
    ctaText: string;
    ctaLink: string;
  };
  products: Product[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Collection = CuratedCollection | InspirationCollection;
