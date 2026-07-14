'use client';

export enum OverlayId {
  MINI_CART = 'mini-cart',
  MOBILE_NAV = 'mobile-nav',
  PRODUCT_FILTERS = 'product-filters',
  SEARCH = 'search',
}

export type OverlayValue = `${OverlayId}`;

export interface OverlayStoreState {
  activeOverlay: OverlayValue | null;
  openOverlay: (overlay: OverlayValue) => void;
  closeOverlay: (overlay?: OverlayValue) => void;
  toggleOverlay: (overlay: OverlayValue) => void;
}
