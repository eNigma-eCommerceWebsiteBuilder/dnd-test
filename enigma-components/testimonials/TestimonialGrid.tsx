import { cn } from '@/lib/utils/cn';
import type { Testimonial } from '@/lib/api/types/testimonials';
import { TestimonialCard } from '@/components/testimonials/TestimonialCard';

interface TestimonialGridProps {
    testimonials: Testimonial[];
    className?: string;
}

/**
 * TestimonialGrid Component (Server)
 * Fluid grid layout for testimonials
 */
export function TestimonialGrid({ testimonials, className }: TestimonialGridProps) {
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <div className={cn("@container w-full", className)}>
            <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                    <TestimonialCard
                        key={testimonial.id || testimonial._id}
                        testimonial={testimonial}
                    />
                ))}
            </div>
        </div>
    );
}

export default TestimonialGrid;