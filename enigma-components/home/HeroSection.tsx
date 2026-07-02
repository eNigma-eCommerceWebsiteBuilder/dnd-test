import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { HeroProduct } from '@/lib/api/types';
import { HeroContent } from '@/lib/content';

interface HeroSectionProps {
    className?: string;
    content: HeroContent;
    heroProduct: HeroProduct | null;
}

export const HeroSection = ({ className, content, heroProduct }: HeroSectionProps) => {
    if (!heroProduct) return null;

    const heroImage = heroProduct.images[0] || '/placeholder-hero.jpg';
    const heroDescription = heroProduct.description || content.subtitle;

    return (
        <section className={cn("@container", className)}>
            <div className="group relative min-h-[32rem] overflow-hidden rounded-card bg-bg-surface shadow-card @lg:min-h-[44rem]">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url("${heroImage}")` }}
                    role="img"
                    aria-label={heroProduct.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-overlay via-bg-overlay/60 to-transparent" />

                <div className="relative flex h-full max-w-3xl flex-col justify-end gap-6 p-6 @md:p-8 @lg:p-12">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-inverse/80">
                        {content.title}
                    </p>
                    <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-text-inverse @md:text-5xl @lg:text-7xl">
                        {heroProduct.name}
                    </h1>
                    <p className="max-w-xl text-base font-medium leading-relaxed text-text-inverse/90 @md:text-lg @lg:text-xl">
                        {heroDescription}
                    </p>
                    <div className="flex flex-col gap-3 @md:flex-row">
                        <Link
                            href={`/products/${heroProduct.slug}`}
                            className="inline-flex items-center justify-center rounded-button bg-cta-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:bg-cta-primary-hover hover:shadow-button-hover @md:px-8 @md:py-4"
                        >
                            {content.ctaPrimary}
                        </Link>
                        <Link
                            href="/collections/all"
                            className="inline-flex items-center justify-center rounded-button border border-border-light/60 bg-bg-surface/10 px-6 py-3 text-sm font-semibold text-text-inverse backdrop-blur-overlay transition-colors duration-normal hover:bg-bg-surface/20 @md:px-8 @md:py-4"
                        >
                            {content.ctaSecondary}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
