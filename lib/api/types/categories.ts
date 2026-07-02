export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;

  image?: string;
  imageUrl?: string;

  parentCategory?: string;
  href?: string;
  isActive: boolean;

  productCount?: number;
  itemCount?: number;
  avgRating?: number;

  priceRange?: {
    min: number;
    max: number;
  } | string;

  trendingScore?: number;
  badge?: 'trending' | 'hot' | 'popular' | string;
  collectionType?: 'innovative' | 'classic' | 'seasonal' | string;
  features?: string[];
  size?: 'small' | 'medium' | 'large' | string;

  createdAt: string;
  updatedAt: string;
}
