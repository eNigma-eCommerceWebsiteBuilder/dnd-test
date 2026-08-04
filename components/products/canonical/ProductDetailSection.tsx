import type { ReactNode } from 'react';

interface ProductDetailSectionProps {
  kind: 'reviews' | 'testimonials';
  content?: ReactNode;
}

export function ProductDetailSection({ kind, content }: ProductDetailSectionProps) {
  return (
    <section
      id={kind === 'reviews' ? 'reviews' : undefined}
      className="mt-24 border-t border-border pt-16"
    >
      {content}
    </section>
  );
}
