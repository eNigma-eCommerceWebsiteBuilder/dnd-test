'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ProductHotspotProps {
  label: string;
  price?: string;
  href?: string;
  ctaLabel?: string;
  className?: string;
}

export function ProductHotspot({
  label,
  price,
  href,
  ctaLabel = 'View details',
  className,
}: ProductHotspotProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
  };

  return (
    <div
      className={cn('@container group relative', className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-cta-primary text-on-primary shadow-floating ring-4 ring-cta-primary/30 animate-pulse"
        aria-expanded={isOpen}
        aria-label={`View ${label}`}
      >
        <span className="material-symbols-outlined text-sm">add</span>
      </button>
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-0 z-tooltip w-48 -translate-x-1/2 -translate-y-full rounded-tooltip border border-border bg-bg-surface p-4 text-left shadow-tooltip transition-all',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Featured</p>
        <p className="mt-1 text-sm font-semibold text-text-base">{label}</p>
        {price ? <p className="mt-1 text-xs text-text-muted">{price}</p> : null}
        {href ? (
          <Link
            href={href}
            className="pointer-events-auto mt-3 inline-flex text-xs font-semibold text-link transition-colors hover:text-link-hover"
          >
            {ctaLabel}
          </Link>
        ) : null}
        <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-bg-surface" />
      </div>
    </div>
  );
}

export default ProductHotspot;
