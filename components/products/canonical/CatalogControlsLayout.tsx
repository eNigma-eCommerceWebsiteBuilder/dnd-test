import type { ReactNode } from 'react';

interface CatalogControlsLayoutProps {
  controls?: ReactNode;
}

export function CatalogControlsLayout({ controls }: CatalogControlsLayoutProps) {
  return <div className="flex items-center gap-3 md:gap-4">{controls}</div>;
}
