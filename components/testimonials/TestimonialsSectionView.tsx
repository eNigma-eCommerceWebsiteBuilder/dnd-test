import { cn } from '@/lib/utils/cn';
import type { Testimonial } from '@/lib/api/types/testimonials';
import { groupTestimonialsByRating } from '@/lib/utils/ecommerce';
import { fetchFeaturedTestimonials } from '@/lib/api/services/testimonials';
import { TestimonialStats } from '@/components/testimonials/TestimonialStats';
import { RatingDistribution } from '@/components/testimonials/RatingDistribution';
import { TestimonialGrid } from '@/components/testimonials/TestimonialGrid';

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: string;
  platform: string;
}

interface TestimonialsSectionViewProps {
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
  className?: string;
}

export const puckComponentName = 'TestimonialsSection';
export const puckLabel = 'Testimonials Section';
export const puckCategory = 'Social Proof';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  subtitle: { type: 'text' as const, label: 'Subtitle' },
  testimonials: {
    type: 'array' as const,
    label: 'Testimonials',
    arrayFields: {
      quote: { type: 'textarea' as const, label: 'Quote' },
      author: { type: 'text' as const, label: 'Author' },
      role: { type: 'text' as const, label: 'Role' },
      avatar: { type: 'text' as const, label: 'Avatar URL' },
      rating: {
        type: 'select' as const,
        label: 'Rating',
        options: [
          { label: '1 Star', value: '1' },
          { label: '2 Stars', value: '2' },
          { label: '3 Stars', value: '3' },
          { label: '4 Stars', value: '4' },
          { label: '5 Stars', value: '5' },
        ],
      },
      platform: { type: 'text' as const, label: 'Platform' },
    },
    defaultItemProps: {
      quote: 'New testimonial',
      author: 'Customer Name',
      role: 'Verified Buyer',
      avatar: '',
      rating: '5',
      platform: '',
    },
    getItemSummary: (item: TestimonialItem) => `${item.author} — ${item.rating}★`,
  },
};

export const puckDefaults = {
  title: 'Our Community',
  subtitle: 'Testimonials',
  testimonials: [
    {
      quote: 'Exceptional quality and service. Every piece feels thoughtfully designed.',
      author: 'Sarah Mitchell',
      role: 'Verified Buyer',
      avatar: '',
      rating: '5',
      platform: 'Trustpilot',
    },
    {
      quote: "Best purchase I've made this year. The craftsmanship is outstanding.",
      author: 'James Lee',
      role: 'Verified Buyer',
      avatar: '',
      rating: '5',
      platform: 'Google Reviews',
    },
    {
      quote: 'Luxury that lives up to the promise. Highly recommend.',
      author: 'Emma Rodriguez',
      role: 'Verified Buyer',
      avatar: '',
      rating: '4',
      platform: 'Trustpilot',
    },
  ],
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['TestimonialsSection'], sourceImportPaths: ['@/components/testimonials/TestimonialsSection'], role: 'testimonials-section', runtimeSignals: ['testimonials'] };

export async function puckDataFetcher() {
  const testimonials = await fetchFeaturedTestimonials();
  return {
    testimonials: testimonials.map((t) => ({
      quote: t.quote || t.text || '',
      author: t.author || t.customerName || '',
      role: t.role || t.customerRole || 'Verified Buyer',
      avatar: t.avatar || t.avatarUrl || '',
      rating: String(t.rating),
      platform: t.platform || '',
    })),
  };
}

function toTestimonials(items: TestimonialItem[]): Testimonial[] {
  return items.map((item, i) =>
    ({
      id: `testimonial-${i}`,
      quote: item.quote,
      author: item.author,
      role: item.role,
      avatar: item.avatar || undefined,
      rating: Number(item.rating) || 5,
      platform: item.platform || undefined,
      type: 'text',
      isFeatured: false,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }) as Testimonial,
  );
}

export function TestimonialsSectionView({
  title,
  subtitle,
  testimonials: items,
  className,
}: TestimonialsSectionViewProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const testimonials = toTestimonials(items);
  const groupedByRating = groupTestimonialsByRating(testimonials);
  const fiveStarCount = groupedByRating[5]?.length || 0;
  const fourStarCount = groupedByRating[4]?.length || 0;

  return (
    <section className={cn('@container w-full', className)}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-3xl @lg:text-4xl font-heading font-bold text-text-base">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-text-muted mt-2 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 @lg:grid-cols-[1.2fr_1fr] gap-6 mb-10">
        <TestimonialStats testimonials={testimonials} />
        <RatingDistribution testimonials={testimonials} />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mb-6">
        <span className="inline-flex items-center gap-2 rounded-badge border border-border bg-bg-sunken px-3 py-1">
          <span className="material-symbols-outlined text-[14px]">star</span>
          5-star reviews: {fiveStarCount}
        </span>
        <span className="inline-flex items-center gap-2 rounded-badge border border-border bg-bg-sunken px-3 py-1">
          <span className="material-symbols-outlined text-[14px]">star</span>
          4-star reviews: {fourStarCount}
        </span>
      </div>

      <TestimonialGrid testimonials={testimonials} />
    </section>
  );
}
