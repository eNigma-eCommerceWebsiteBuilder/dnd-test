export type TargetAudience = 'all' | 'new_customers' | 'returning_customers' | 'b2b';

export interface Promotion {
  id: string;
  backgroundImage: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  discountPercentage?: number;
  targetAudience?: TargetAudience;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
