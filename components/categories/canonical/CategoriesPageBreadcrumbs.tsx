import Link from 'next/link';

export function CategoriesPageBreadcrumbs() {
  return <nav className="flex items-center gap-2 mb-8 text-sm font-medium"><Link href="/" className="text-text-muted hover:text-primary transition-colors">Home</Link><span className="material-symbols-outlined text-xs text-text-lighter">chevron_right</span><span className="text-primary">All Categories</span></nav>;
}
