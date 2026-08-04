import { Suspense } from 'react';
import type { ReactNode } from 'react';

interface ProductDetailPurchaseColumnProps {
  productName?: string;
  hasRating?: boolean;
  stock?: ReactNode;
  rating?: ReactNode;
  price?: ReactNode;
  purchase?: ReactNode;
  trust?: ReactNode;
}

const purchaseFallback = <div className="h-48 rounded-lg bg-bg-skeleton animate-pulse" />;

// Owns the source rating condition and purchase Suspense boundary.
export function ProductDetailPurchaseColumn({
  productName = 'Product',
  hasRating,
  stock,
  rating,
  price,
  purchase,
  trust,
}: ProductDetailPurchaseColumnProps) {
  return (
    <div className="lg:col-span-5">
      <div className="space-y-6 lg:sticky lg:top-28">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-text-base md:text-4xl">
            {productName}
          </h1>
          {stock}
        </div>
        {hasRating ? rating : null}
        {price}
        <hr className="border-border" />
        <Suspense fallback={purchaseFallback}>{purchase}</Suspense>
        {trust}
      </div>
    </div>
  );
}
