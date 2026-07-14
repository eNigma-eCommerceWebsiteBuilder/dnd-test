import Link from 'next/link';

export function CategoryCatalogBreadcrumbs({ categoryName = 'Category' }: { categoryName?: string }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
      <Link href="/" className="hover:text-primary transition-colors">Home</Link>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <Link href="/categories" className="hover:text-primary transition-colors">All Categories</Link>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <span className="text-text-base font-medium">{categoryName}</span>
    </nav>
  );
}
