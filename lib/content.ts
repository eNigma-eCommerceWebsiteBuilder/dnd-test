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
    curatedCollection: {
      eyebrow: 'Curated Collection',
      ctaText: 'Explore Collection',
    },
    categories: {
      header: 'Shop by Category',
      subheader: 'Curation',
      ctaLabel: 'Explore All',
    },
    featuredProducts: {
      header: 'Featured Products',
      subheader: 'Essentials',
    },
    inspiration: {
      header: 'Autumn in the City: A Curated Look',
      subheader: 'Inspiration',
      description:
        "Discover how we style this season's most sought-after pieces for the perfect urban ensemble.",
      ctaText: 'Shop the Look',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCEMrhSDou2quXn3m45RGq7MZg9LrC6bfhIAUm012lCQ_f8jpBzFh738jzvkUbVSvKYNDVMBbivnX7veuwSk3TGH9bNl5BfoEo3grMYfpsMwy6PMb64zfUGaMHrKOmFpveIv6T-oTClRskrusCg2y6dvMwDuVww7KtswcekZJ6mXeuemf16PtjE2eMsmz_HCFBK4MdtRCYMLJe7t0irTEWCIfOh4J0E4vUO2HPqy-uipa55y8s2m73GkCWX_X1GYY22o1m4k7IRLlTW',
      alt: 'Lifestyle scene of a boutique store interior with model',
      hotspots: [
        { top: '30%', right: '40%', title: 'Classic Blazer', price: '$320.00' },
        { bottom: '40%', right: '25%', title: 'Leather Tote', price: '$550.00' },
      ],
    },
    testimonials: {
      header: 'Our Community',
      subheader: 'Testimonials',
    },
    newsletter: {
      title: 'Join the Inner Circle',
      description:
        'Sign up for early access to new drops, curated seasonal guides, and exclusive editorial content.',
      disclaimer:
        'By subscribing, you agree to our Privacy Policy and Terms of Service.',
    },
  },

  auth: {
    login: {
      hero: {
        title: 'Redefining Elegance',
        subtitle:
          'Join our exclusive community and access curated luxury collections from around the globe.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDOhFWViWGcd7-qkYBD1vhGK4PdvG5ocHFtmKXPajNifVZQSVX4MUoF3eRCaXCgJ5x4eHuTaegApBlb3ZlOVcgws9r-q9NxREE7zUXyERMOokmvIlyKzPhYTGOZyQZGzu3X7gZDfmGC9ny77vecfgMJlMnc_UmUi4rIhdRjqRgnG8Wt07fAKwvJy984ef-7vviskhMjCppHc3UQdTCpMv0xi34Ei3QFu43Nz5oSS5SAJRya-rHjltI4ukkC6MwArvptoRMAsI6qqnA7',
        imageAlt:
          'Luxury minimalist fashion store interior with soft lighting',
      },
      form: {
        title: 'Welcome Back',
        subtitle:
          'Please enter your details to access your LUXE account.',
      },
    },
    register: {
      hero: {
        title: 'Redefining Modern Luxury',
        subtitle:
          'Experience a curated collection of world-class design and craftsmanship.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDw9Dfl-hrxzGp-zBz1y8pJR_McT_2DQZcNTS2WVj2JCx6ImZNb3kqC51vxp4lxs_LFEyY1QQV0kIC8d41rDTIZOAXigBWV5WXkMFZaJtpipggrE-m5RjguRk6nPb-49oMjhs7gd97NIemx-QDAOOT-VBNBCLSfeTkhtMPM2GTmwPcyROnaKPZzhA2chxiL9oOKYs9UfYpNt5-2h0nGSaFJT-9NdL8Nq2QhcHZDQBQDOA7FmGcKVN_jShyM0d9zbHyOccw9QdGKXoI',
        imageAlt:
          'Modern high-end luxury boutique interior with minimalist aesthetic',
      },
      form: {
        title: 'Create your account',
        subtitle:
          'Join our community for exclusive access and personalized experiences.',
      },
    },
    entryCard: {
      storefrontEyebrow: 'Storefront Identity',
      continueEyebrow: 'Continue Securely',
      loginTitle: 'Access your account',
      registerTitle: 'Start your account',
      description:
        'Sign in or create your account using the hosted identity flow. Registration, password recovery, and social login all stay inside eNigma Identity.',
      featureCards: [
        {
          title: 'Hosted login',
          description:
            'Passwords, social login, verification, and recovery stay inside eNigma Identity.',
        },
        {
          title: 'Unified sessions',
          description:
            'The storefront only keeps a secure session cookie and never stores tokens in browser storage.',
        },
      ],
      footerNote:
        'Your shopping identity is now handled by eNigma Identity. If you are already signed in there, you will come straight back here.',
    },
  },

  checkout: {
    success: {
      title: 'Thank you for your order',
      nextSteps: {
        title: "What's Next?",
        step1: "We've sent a detailed receipt to",
        step2: "You'll receive a tracking number once your items ship.",
        step3:
          'Our support team is available 24/7 if you have questions.',
      },
    },
  },

  common: {
    promoBanner: 'Free shipping on orders over $100',
    trustBadges: [
      {
        icon: 'local_shipping',
        title: 'Free Global Shipping',
        subtitle: 'On all orders over $100',
      },
      {
        icon: 'restart_alt',
        title: '30-Day Returns',
        subtitle: 'Hassle-free exchange policy',
      },
      {
        icon: 'encrypted',
        title: 'Secure Checkout',
        subtitle: 'Encrypted payment processing',
      },
    ],
    footer: {
      about:
        'Crafting high-quality essentials for the contemporary lifestyle. We believe in slow fashion, premium materials, and ethical production.',
      copyright: '(c) 2024 LUXE RETAIL GROUP. ALL RIGHTS RESERVED.',
      sectionTitles: {
        shop: 'Shop',
        care: 'Customer Care',
        company: 'Company',
      },
      links: {
        shop: ['New Arrivals', 'Best Sellers', 'Menswear', 'Womenswear', 'Sale'],
        care: [
          'Shipping Policy',
          'Returns & Exchanges',
          'Size Guide',
          'FAQs',
          'Contact Us',
        ],
        company: [
          'Our Story',
          'Sustainability',
          'Journal',
          'Privacy Policy',
          'Terms of Service',
        ],
      },
    },
  },
} as const;

export type SiteContent = typeof siteContent;
export type HomePageContent = SiteContent['homepage'];
export type AuthContent = SiteContent['auth'];
export type AuthEntryCardContent = SiteContent['auth']['entryCard'];
export type TrustBadgeContent = SiteContent['common']['trustBadges'][number];
export type FooterContent = SiteContent['common']['footer'];
export type NewsletterContent = SiteContent['homepage']['newsletter'];
export type FeaturedProductsContent = SiteContent['homepage']['featuredProducts'];
export type CategoryHighlightsContent = SiteContent['homepage']['categories'];
export type HeroContent = SiteContent['homepage']['hero'];
export type CuratedCollectionContent = SiteContent['homepage']['curatedCollection'];
export type InspirationContent = SiteContent['homepage']['inspiration'];
export type CheckoutSuccessContent = SiteContent['checkout']['success'];
export type CheckoutSuccessNextStepsContent =
  SiteContent['checkout']['success']['nextSteps'];
