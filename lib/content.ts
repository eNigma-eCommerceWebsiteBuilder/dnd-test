export const siteContent = {
  siteName: 'Luxe Fashion',
  siteTagline: 'Premium Fashion for Modern Living',

  homepage: {
    hero: {
      title: 'Timeless Quality for the Modern Wardrobe',
      subtitle:
        'Discover our curated collection of high-end essentials designed for the sophisticated individual. Effortless luxury, everyday.',
      ctaPrimary: 'Shop the Collection',
      ctaSecondary: 'View Lookbook',
      backgroundImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA6gp8HFBtOLhaLDZsED1w2eDKkeIHp6jt0CCvOR_XUoTQFJEpJEjhZEfhzDVSbO-0M1L7BoveRAyvHMXrc17n2O9joLLbK6-OJgyJEKJUu6k2tvyZvuAmmIhFqMIb4swMAkkEDSROBla5cwwqD4yS4Ve6lHwe3qs-MyH6SQwdlhPnT7ms_ZRYoxinaARe8iQYqsgR0E8hMueI6nHy9Jz3X8uN85CCOJ0JGGLFLfGA6NyKOwhDgbRCoJBD3qKXWi7ehVJWCX5qzs4MN',
      imageAlt:
        'Fashion model wearing minimalist high-end clothing in a bright studio',
    },
  },
} as const;

export type SiteContent = typeof siteContent;
export type HeroContent = SiteContent['homepage']['hero'];
