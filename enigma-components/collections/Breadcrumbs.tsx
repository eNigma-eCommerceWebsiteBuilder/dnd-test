import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs Component (Server)
 *
 * Navigation path display following PAGE_AND_COMPONENTS_PLAN.md.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn(
        '@container flex items-center gap-2 text-sm font-medium text-text-muted',
        className
      )}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-text-base' : ''}>{item.label}</span>
            )}
            {!isLast && (
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
