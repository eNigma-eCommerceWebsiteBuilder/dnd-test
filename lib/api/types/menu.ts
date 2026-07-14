import type { Product } from './products';

export interface MegaMenuCategory {
  name: string;
  href: string;
}

export interface MegaMenuFeaturedProduct {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

export interface MegaMenu {
  categories: MegaMenuCategory[];
  featured: MegaMenuFeaturedProduct[];
}

export interface MenuItem {
  label: string;
  href: string;
  megaMenu?: MegaMenu;
}

export interface Menu {
  logoText: string;
  logoHref: string;
  menuItems: MenuItem[];
  cartItemCount: number;
}

export type HeroProduct = Product & {
  badge?: string;
  salePrice?: number;
};
