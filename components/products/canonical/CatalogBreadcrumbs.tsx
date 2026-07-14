import Link from 'next/link';

interface CatalogBreadcrumbsProps {
  homeLabel?: string;
  homeHref?: string;
  currentLabel?: string;
}

// This is the products-page breadcrumb, not the generic product-detail breadcrumb.
export function CatalogBreadcrumbs({
  homeLabel = 'Home',
  homeHref = '/',
  currentLabel = 'All Products',
}: CatalogBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-text-muted mb-4">
      <Link href={homeHref} className="hover:text-primary transition-colors">
        {homeLabel}
      </Link>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <span className="text-text-base font-medium">{currentLabel}</span>
    </nav>
  );
}
