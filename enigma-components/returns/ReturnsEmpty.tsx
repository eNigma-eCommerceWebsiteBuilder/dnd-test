import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ROUTES, RETURNS } from '@/lib/utils/constants';

interface ReturnsEmptyProps {
    className?: string;
}

export function ReturnsEmpty({ className }: ReturnsEmptyProps) {
    return (
        <div
            className={cn(
                '@container w-full flex flex-col items-center justify-center text-center py-12 @md:py-16 @lg:py-20 px-4',
                className
            )}
        >
            <div className="w-20 h-20 @md:w-24 @md:h-24 rounded-full bg-sunken flex items-center justify-center mb-4 @md:mb-6">
                <span className="material-symbols-outlined text-4xl @md:text-5xl text-text-muted">
                    assignment_return
                </span>
            </div>

            <h2 className="text-lg @md:text-xl @lg:text-2xl font-bold font-heading text-text-base mb-2">
                No Returns Yet
            </h2>

            <p className="text-sm @md:text-base text-text-muted max-w-md mb-6 @md:mb-8">
                When you submit a return, it will appear here. Returns are available within {RETURNS.WINDOW_DAYS} days of delivery.
            </p>

            <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-button shadow-button hover:bg-primary-dark hover:shadow-button-hover transition-all"
            >
                <span className="material-symbols-outlined text-lg">shopping_bag</span>
                Start Shopping
            </Link>
        </div>
    );
}
