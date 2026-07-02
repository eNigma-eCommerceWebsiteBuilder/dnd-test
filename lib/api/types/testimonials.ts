export type TestimonialType = 'text' | 'video' | 'social';

export interface Testimonial {
  id: string;
  _id?: string;
  quote: string;
  text?: string;
  author: string;
  customerName?: string;
  role?: string;
  customerRole?: string;
  avatar?: string;
  avatarUrl?: string;
  backgroundImageUrl?: string;
  rating: number;
  location?: string;
  platform?: string;
  handle?: string;
  link?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  type: TestimonialType;
  isFeatured: boolean;
  isActive: boolean;
  isApproved?: boolean;
  priority?: number;
  productId?: string;
  createdAt: string;
  updatedAt: string;
}
