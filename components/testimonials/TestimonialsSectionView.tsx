import type { Testimonial } from '@/lib/api/types/testimonials';
import { fetchFeaturedTestimonials } from '@/lib/api/services/testimonials';
import { TestimonialsSection } from '@/enigma-components/testimonials/TestimonialsSection';

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
  runtimeTestimonials?: Testimonial[];
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
  try {
    return { runtimeTestimonials: await fetchFeaturedTestimonials() };
  } catch {
    // This mirrors HomePage's withFallback(fetchFeaturedTestimonials(), []).
    return { runtimeTestimonials: [] };
  }
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
  testimonials: items = [],
  className,
  runtimeTestimonials,
}: TestimonialsSectionViewProps) {
  const testimonials = runtimeTestimonials === undefined ? toTestimonials(items) : runtimeTestimonials;
  return <TestimonialsSection testimonials={testimonials} title={title} subtitle={subtitle} className={className} />;
}
