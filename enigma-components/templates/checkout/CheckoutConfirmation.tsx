'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

interface CheckoutConfirmationProps {
  orderId: string | null;
}

export function CheckoutConfirmation({ orderId }: CheckoutConfirmationProps) {
  return (
    <section className="py-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-subtle md:mb-6 md:h-20 md:w-20">
        <span className="material-symbols-outlined text-3xl text-success md:text-4xl">
          check_circle
        </span>
      </div>
      <h2 className="mb-2 text-2xl font-bold md:text-3xl">Order Confirmed!</h2>
      <p className="mb-6 text-text-muted">
        Thank you for your order. Your order ID is: {orderId || 'Processing...'}
      </p>
      <Link
        href={ROUTES.PRODUCTS}
        className="inline-block rounded-button bg-primary px-6 py-3 font-semibold text-on-primary shadow-button transition-all hover:bg-primary-dark"
      >
        Continue Shopping
      </Link>
    </section>
  );
}
