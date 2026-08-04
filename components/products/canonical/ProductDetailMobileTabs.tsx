import type { ReactNode } from 'react';

interface ProductDetailMobileTabsProps {
  content?: ReactNode;
}

export function ProductDetailMobileTabs({ content }: ProductDetailMobileTabsProps) {
  return <div className="mt-12 border-t border-border pt-8 lg:hidden">{content}</div>;
}
