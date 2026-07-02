import { cn } from '@/lib/utils/cn';

interface ProductInfoProps {
    name: string;
    description?: string;
    sku?: string;
    className?: string;
}

/**
 * ProductInfo Component (Server)
 * 
 * Displays product title, description, and SKU.
 * Following PAGE_AND_COMPONENTS_PLAN.md Hybrid SSR Pattern.
 */
export function ProductInfo({ name, description, sku, className }: ProductInfoProps) {
    return (
        <div className={cn("@container space-y-4", className)}>
            <h1 className="text-3xl font-extrabold leading-tight text-text-base @md:text-4xl">
                {name}
            </h1>

            {sku && (
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    SKU: {sku}
                </p>
            )}

            {description && (
                <p className="text-text-muted leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}

export default ProductInfo;
