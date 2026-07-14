import type { Testimonial } from '@/lib/api/types/testimonials';
import { TestimonialsSectionView } from './TestimonialsSectionView';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function TestimonialsSection({
  testimonials,
  title,
  subtitle,
  className,
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <TestimonialsSectionView
      title={title || ''}
      subtitle={subtitle || ''}
      testimonials={testimonials.map((t) => ({
        quote: t.quote || t.text || '',
        author: t.author || t.customerName || 'Customer',
        role: t.role || t.customerRole || '',
        avatar: t.avatar || t.avatarUrl || '',
        rating: String(t.rating),
        platform: t.platform || '',
      }))}
      className={className}
    />
  );
}

export default TestimonialsSection;
