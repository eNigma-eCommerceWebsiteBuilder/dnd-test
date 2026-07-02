'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';
import { formatPrice } from '@/lib/utils/formatters';
import { useCartStore } from '@/lib/stores/cart-store';
import { useOverlayStore } from '@/lib/stores/overlay-store';

export function MiniCartDrawer() {
  const activeOverlay = useOverlayStore((state) => state.activeOverlay);
  const closeOverlay = useOverlayStore((state) => state.closeOverlay);
  const cart = useCartStore((state) => state.cart);
  const totalItems = useCartStore((state) => state.totalItems);
  const loading = useCartStore((state) => state.loading);
  const isPending = useCartStore((state) => state.isPending);
  const cartLoaded = useCartStore((state) => state.cartLoaded);
  const refreshCart = useCartStore((state) => state.refreshCart);

  const isOpen = activeOverlay === 'mini-cart';

  useEffect(() => {
    if (isOpen && !cartLoaded && !loading) {
      void refreshCart();
    }
  }, [cartLoaded, isOpen, loading, refreshCart]);

  if (!isOpen) {
    return null;
  }

  const items = cart?.items ?? [];

  return (
    <div className="fixed inset-0 z-drawer">
      <button
        type="button"
        aria-label="Close mini cart"
        className="absolute inset-0 bg-bg-overlay/80 backdrop-blur-overlay"
        onClick={() => closeOverlay('mini-cart')}
      />

      <aside className="absolute inset-y-0 right-0 w-full max-w-[420px] border-l border-border bg-bg-surface shadow-modal">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-divider px-6 py-5">
            <div>
              <p className="text-lg font-bold text-text-base">Your Bag</p>
              <p className="text-sm text-text-muted">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>

            <button
              type="button"
              aria-label="Close mini cart"
              onClick={() => closeOverlay('mini-cart')}
              className="rounded-button p-2 text-text-muted hover:bg-bg-hover hover:text-text-base transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {loading && items.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-text-muted">
                Loading your cart...
              </div>
            ) : items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-bg-sunken text-text-muted">
                  <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-text-base">Your bag is empty</p>
                  <p className="text-sm text-text-muted">Add something you love and it will show up here.</p>
                </div>
                <button
                  type="button"
                  onClick={() => closeOverlay('mini-cart')}
                  className="rounded-button bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90"
                >
                  Keep Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const imageUrl = item.product?.images?.[0] || item.product?.imageUrl || '/product-placeholder.jpg';

                  return (
                    <div
                      key={`${item.productId}-${item.variantId ?? 'default'}`}
                      className="flex gap-4 rounded-card border border-border p-3"
                    >
                      <div className="relative h-20 w-16 overflow-hidden rounded-image bg-bg-sunken">
                        <Image
                          src={imageUrl}
                          alt={item.product?.name || 'Product'}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text-base">
                          {item.product?.name || 'Product'}
                        </p>
                        {item.variant?.size || item.variant?.color ? (
                          <p className="mt-1 text-xs text-text-muted">
                            {[item.variant?.size, item.variant?.color].filter(Boolean).join(' / ')}
                          </p>
                        ) : null}
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-text-muted">Qty {item.quantity}</span>
                          <span className="font-semibold text-text-base">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-divider px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-text-muted">Subtotal</span>
              <span className="text-lg font-bold text-text-base">
                {formatPrice(cart?.total ?? 0)}
              </span>
            </div>

            {isPending ? (
              <p className="mb-4 text-xs text-text-muted">Updating your cart...</p>
            ) : null}

            <div className="grid gap-3">
              <Link
                href={ROUTES.CART}
                onClick={() => closeOverlay('mini-cart')}
                className="inline-flex w-full items-center justify-center rounded-button border border-border px-4 py-3 text-sm font-semibold text-text-base transition-colors hover:bg-bg-hover"
              >
                View Cart
              </Link>
              <Link
                href={ROUTES.CHECKOUT}
                onClick={() => closeOverlay('mini-cart')}
                className="inline-flex w-full items-center justify-center rounded-button bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
