import type { ReactNode } from 'react';

interface CatalogContentLayoutProps {
  sidebar?: ReactNode;
  results?: ReactNode;
}

export function CatalogContentLayout({ sidebar, results }: CatalogContentLayoutProps) {
  return <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">{sidebar}{results}</div>;
}
