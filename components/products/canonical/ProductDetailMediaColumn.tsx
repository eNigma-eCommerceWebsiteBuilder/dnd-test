import type { ReactNode } from 'react';

interface ProductDetailMediaColumnProps {
  gallery?: ReactNode;
  desktopTabs?: ReactNode;
}

export function ProductDetailMediaColumn({ gallery, desktopTabs }: ProductDetailMediaColumnProps) {
  return (
    <div className="lg:col-span-7">
      {gallery}
      <div className="mt-16 hidden border-t border-border pt-8 lg:block">
        {desktopTabs}
      </div>
    </div>
  );
}
