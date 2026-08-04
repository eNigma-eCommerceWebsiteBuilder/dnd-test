import type { ReactNode } from 'react';

interface ProductDetailRelatedProductsSectionProps {
  visible?: boolean;
  previewMode?: 'visible' | 'hidden';
  content?: ReactNode;
}

// Keeps relatedProducts.length > 0 as a source-owned runtime conditional.
export function ProductDetailRelatedProductsSection({
  visible,
  previewMode = 'visible',
  content,
}: ProductDetailRelatedProductsSectionProps) {
  const showRelated = visible === undefined ? previewMode === 'visible' : visible;
  return showRelated ? <section className="mb-16 mt-24">{content}</section> : null;
}
