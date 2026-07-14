import type { Order } from './orders';
import type { Product } from './products';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ReviewSort {
  RECENT = 'recent',
  RATING_ASC = 'rating-asc',
  RATING_DESC = 'rating-desc',
}

export enum ReviewReportReason {
  SPAM = 'spam',
  OFFENSIVE = 'offensive',
  INAPPROPRIATE = 'inappropriate',
  FAKE = 'fake',
  OTHER = 'other',
}

export interface ReviewImage {
  id: string;
  src: string;
  alt: string;
  public_id?: string;
}

export interface Review {
  _id: string;
  productId: string;
  product?: Product;
  author: string;
  rating: number;
  title?: string;
  text: string;
  images?: ReviewImage[];
  isVerifiedPurchase: boolean;
  orderNumber?: string;
  customerEmail?: string;
  helpful: number;
  notHelpful: number;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewApiRecord {
  _id: string;
  productId: string;
  product?: Product;
  author: string;
  rating: number;
  title?: string;
  text: string;
  images?: ReviewImage[];
  isVerified?: boolean;
  isVerifiedPurchase?: boolean;
  isApproved?: boolean | null;
  orderNumber?: string;
  customerEmail?: string;
  helpfulCount?: number;
  unhelpfulCount?: number;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewCreateData {
  author: string;
  rating: number;
  text: string;
  title?: string;
  images?: ReviewImage[];
  orderNumber?: string;
  customerEmail?: string;
}

export interface ReviewEligibilityRequest {
  orderId: string;
  productId: string;
  email: string;
}

export interface ReviewEligibility {
  canReview: boolean;
  orderNumber: string;
  isPaid: boolean;
  productName: string;
}

export interface ReviewRatingDistributionItem {
  rating: number;
  percentage: number;
}

export interface ReviewsResponse {
  items: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ProductReviewsApiResponse {
  items: ReviewApiRecord[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: ReviewRatingDistributionItem[] | Record<string, number>;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ReviewHelpfulData {
  isHelpful: boolean;
}

export interface ReviewHelpfulResponse {
  success: boolean;
  data: {
    reviewId: string;
    helpfulCount: number;
    unhelpfulCount: number;
    userVoted: boolean;
  };
  message: string;
}

export interface ReviewReportData {
  reason: ReviewReportReason;
  details?: string;
}

export interface ReviewReportResponse {
  success: boolean;
  message: string;
}

export interface MyReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MyReviewsApiResponse {
  reviews: ReviewApiRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ReviewListSort =
  | ReviewSort
  | 'newest'
  | 'oldest'
  | 'highest'
  | 'lowest'
  | 'helpful';

export interface ReviewListParams {
  productId?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  sort?: ReviewListSort;
}

export interface PaginatedReviewsResponse {
  items: Review[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
}

export interface StandaloneReviewsApiResponse {
  items: ReviewApiRecord[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
}

export interface StandaloneReviewCreateData {
  productId: string;
  rating: number;
  title?: string;
  text?: string;
  comment?: string;
  orderNumber?: string;
  orderId?: string;
  customerEmail?: string;
  email?: string;
}

export interface LegacyReviewEligibility {
  eligible: boolean;
  order?: Order;
  message: string;
}
