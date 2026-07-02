import { cn } from '@/lib/utils/cn';
import type { Category } from '@/lib/api/types';

interface CategoryHeroProps {
    category: Category;
    productCount?: number;
    className?: string;
}

export function CategoryHero({ category, productCount, className }: CategoryHeroProps) {
    const imageUrl = category.image || category.imageUrl;
    const count = productCount ?? category.productCount ?? category.itemCount ?? 0;

    return (
        <section className={cn("@container relative mb-8 @md:mb-12", className)}>
            {imageUrl ? (
                <div className="relative h-[200px] overflow-hidden rounded-card-lg @md:h-[280px]">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url('${imageUrl}')`,
                        }}
                        role="img"
                        aria-label={category.name}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-text-inverse">
                        <h1 className="mb-2 text-4xl font-black tracking-tight @md:text-5xl">
                            {category.name}
                        </h1>
                        {category.description ? (
                            <p className="mb-4 max-w-2xl line-clamp-2 text-text-inverse/80">
                                {category.description}
                            </p>
                        ) : null}
                        <p className="text-sm font-medium text-text-inverse/70">
                            {count.toLocaleString()} items in this collection
                        </p>
                    </div>
                </div>
            ) : (
                <div className="border-b border-border py-8 @md:py-12">
                    <h1 className="mb-2 text-4xl font-black tracking-tight text-text-base @md:text-5xl">
                        {category.name}
                    </h1>
                    {category.description ? (
                        <p className="mb-4 max-w-2xl leading-relaxed text-text-muted">
                            {category.description}
                        </p>
                    ) : null}
                    <p className="text-sm font-medium text-text-muted">
                        {count.toLocaleString()} items in this collection
                    </p>
                </div>
            )}
        </section>
    );
}
