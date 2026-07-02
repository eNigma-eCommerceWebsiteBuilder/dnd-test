import { cn } from '@/lib/utils/cn';

interface Spec {
    name: string;
    value: string;
}

interface SpecsTableProps {
    specs: Spec[];
    className?: string;
}

/**
 * SpecsTable Component (Server)
 * 
 * Displays product specifications in a structured grid.
 * Following PAGE_AND_COMPONENTS_PLAN.md guidelines.
 */
export function SpecsTable({ specs, className }: SpecsTableProps) {
    if (!specs || specs.length === 0) {
        return null;
    }

    return (
        <div className={cn("@container space-y-4", className)}>
            <dl className="divide-y divide-border">
                {specs.map((spec, index) => (
                    <div
                        key={`${spec.name}-${index}`}
                        className="flex flex-col @sm:flex-row @sm:justify-between py-3 gap-1"
                    >
                        <dt className="text-sm font-semibold text-text-base">
                            {spec.name}
                        </dt>
                        <dd className="text-sm text-text-muted @sm:text-right">
                            {spec.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export default SpecsTable;
