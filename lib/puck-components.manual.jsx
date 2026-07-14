// MANUAL CONFIG — will be replaced by auto-generated output once View files exist
// To regenerate: npm run generate:puck-config

import { PromotionBanner } from "@/components/home/PromotionBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryHighlights } from "@/components/home/CategoryHighlights";
import { FeaturedProductsGrid } from "@/components/home/FeaturedProductsGrid";
import { CuratedCollectionSection } from "@/components/home/CuratedCollectionSection";
import { InspirationSection } from "@/components/home/InspirationSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { TrustBadges } from "@/components/home/TrustBadges";

const TIMESTAMP = "2024-01-01T00:00:00Z";

function placeholderProduct(id, name, slug, price, image) {
  return {
    _id: id,
    name,
    slug,
    description: "",
    price,
    images: [image],
    inStock: true,
    stock: 10,
    isActive: true,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  };
}

const PLACEHOLDER_CATEGORIES = [
  {
    _id: "cat-1",
    name: "Outerwear",
    slug: "outerwear",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80",
    productCount: 42,
    isActive: true,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    _id: "cat-2",
    name: "Footwear",
    slug: "footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3779?w=600&q=80",
    productCount: 28,
    isActive: true,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    _id: "cat-3",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1611923134139-8cb8c9e1f1c1?w=600&q=80",
    productCount: 15,
    isActive: true,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
];

const PLACEHOLDER_PRODUCTS = [
  placeholderProduct("fp-1", "Premium Wool Coat", "premium-wool-coat", 450, "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80"),
  placeholderProduct("fp-2", "Silk Blend Shirt", "silk-blend-shirt", 180, "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"),
  placeholderProduct("fp-3", "Leather Tote Bag", "leather-tote-bag", 550, "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"),
  placeholderProduct("fp-4", "Cashmere Sweater", "cashmere-sweater", 320, "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"),
];

const config = {
  components: {
    PromotionBanner: {
      category: "Marketing",
      label: "Promotion Banner",
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle" },
        ctaText: { type: "text", label: "CTA Text" },
        ctaLink: { type: "text", label: "CTA Link" },
      },
      defaultProps: {
        title: "Free Shipping on All Orders",
        subtitle: "Limited time only — ends soon",
        ctaText: "Shop Now",
        ctaLink: "/collections/all",
      },
      render: ({ title, subtitle, ctaText, ctaLink }) => {
        const promotion = {
          id: "promo-1",
          backgroundImage: "",
          title: title || "Free Shipping on All Orders",
          subtitle: subtitle || "Limited time only",
          description: "",
          ctaText: ctaText || "Shop Now",
          ctaLink: ctaLink || "/collections/all",
          startDate: "2020-01-01T00:00:00Z",
          endDate: "2099-12-31T23:59:59Z",
        };
        return <PromotionBanner promotion={promotion} />;
      },
    },

    HeroSection: {
      category: "Home",
      label: "Hero Section",
      fields: {
        title: { type: "text", label: "Eyebrow Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        ctaPrimary: { type: "text", label: "Primary CTA" },
        ctaSecondary: { type: "text", label: "Secondary CTA" },
        backgroundImage: { type: "text", label: "Background Image URL" },
        imageAlt: { type: "text", label: "Image Alt Text" },
        productName: { type: "text", label: "Product Name (H1)" },
      },
      defaultProps: {
        title: "Timeless Quality for the Modern Wardrobe",
        subtitle:
          "Discover our curated collection of high-end essentials designed for the sophisticated individual. Effortless luxury, everyday.",
        ctaPrimary: "Shop the Collection",
        ctaSecondary: "View Lookbook",
        backgroundImage:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA6gp8HFBtOLhaLDZsED1w2eDKkeIHp6jt0CCvOR_XUoTQFJEpJEjhZEfhzDVSbO-0M1L7BoveRAyvHMXrc17n2O9joLLbK6-OJgyJEKJUu6k2tvyZvuAmmIhFqMIb4swMAkkEDSROBla5cwwqD4yS4Ve6lHwe3qs-MyH6SQwdlhPnT7ms_ZRYoxinaARe8iQYqsgR0E8hMueI6nHy9Jz3X8uN85CCOJ0JGGLFLfGA6NyKOwhDgbRCoJBD3qKXWi7ehVJWCX5qzs4MN",
        imageAlt: "Fashion model wearing minimalist high-end clothing in a bright studio",
        productName: "Premium Wool Coat",
      },
      render: ({
        title,
        subtitle,
        ctaPrimary,
        ctaSecondary,
        backgroundImage,
        imageAlt,
        productName,
      }) => {
        const content = {
          title: title || "",
          subtitle: subtitle || "",
          ctaPrimary: ctaPrimary || "",
          ctaSecondary: ctaSecondary || "",
          backgroundImage: backgroundImage || "",
          imageAlt: imageAlt || "",
        };
        const heroProduct = {
          _id: "hero-product",
          name: productName || "Premium Wool Coat",
          slug: "premium-wool-coat",
          description: subtitle || "",
          images: [backgroundImage || "/placeholder-hero.jpg"],
          price: 0,
          inStock: true,
          stock: 1,
          isActive: true,
          createdAt: TIMESTAMP,
          updatedAt: TIMESTAMP,
        };
        return <HeroSection content={content} heroProduct={heroProduct} />;
      },
    },

    CategoryHighlights: {
      category: "Home",
      label: "Category Highlights",
      fields: {
        header: { type: "text", label: "Header" },
        subheader: { type: "text", label: "Subheader" },
        ctaLabel: { type: "text", label: "CTA Label" },
      },
      defaultProps: {
        header: "Shop by Category",
        subheader: "Curation",
        ctaLabel: "Explore All",
      },
      render: ({ header, subheader, ctaLabel }) => {
        const content = {
          header: header || "Shop by Category",
          subheader: subheader || "Curation",
          ctaLabel: ctaLabel || "Explore All",
        };
        return (
          <CategoryHighlights
            categories={PLACEHOLDER_CATEGORIES}
            content={content}
          />
        );
      },
    },

    FeaturedProductsGrid: {
      category: "Home",
      label: "Featured Products Grid",
      fields: {
        header: { type: "text", label: "Header" },
        subheader: { type: "text", label: "Subheader" },
      },
      defaultProps: {
        header: "Featured Products",
        subheader: "Essentials",
      },
      render: ({ header, subheader }) => {
        const content = {
          header: header || "Featured Products",
          subheader: subheader || "Essentials",
        };
        return (
          <FeaturedProductsGrid
            content={content}
            products={PLACEHOLDER_PRODUCTS}
          />
        );
      },
    },

    CuratedCollectionSection: {
      category: "Home",
      label: "Curated Collection Section",
      fields: {
        eyebrow: { type: "text", label: "Eyebrow" },
        ctaText: { type: "text", label: "CTA Text" },
      },
      defaultProps: {
        eyebrow: "Curated Collection",
        ctaText: "Explore Collection",
      },
      render: ({ eyebrow, ctaText }) => {
        const content = {
          eyebrow: eyebrow || "Curated Collection",
          ctaText: ctaText || "Explore Collection",
        };
        const collection = {
          id: "col-1",
          name: "Autumn Essentials",
          slug: "autumn-essentials",
          description:
            "A curated selection of premium pieces for the season.",
          type: "curated",
          mainProduct: placeholderProduct(
            "col-mp-1",
            "Signature Trench Coat",
            "signature-trench-coat",
            450,
            "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80"
          ),
          relatedProducts: PLACEHOLDER_PRODUCTS,
          isActive: true,
          createdAt: TIMESTAMP,
          updatedAt: TIMESTAMP,
        };
        return (
          <CuratedCollectionSection
            collection={collection}
            content={content}
          />
        );
      },
    },

    InspirationSection: {
      category: "Home",
      label: "Inspiration Section",
      fields: {
        header: { type: "text", label: "Header" },
        subheader: { type: "text", label: "Subheader" },
        description: { type: "textarea", label: "Description" },
        ctaText: { type: "text", label: "CTA Text" },
        image: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Image Alt Text" },
        hotspots: {
          type: "array",
          label: "Hotspots",
          arrayFields: {
            top: { type: "text", label: "Top" },
            right: { type: "text", label: "Right" },
            bottom: { type: "text", label: "Bottom" },
            left: { type: "text", label: "Left" },
            title: { type: "text", label: "Title" },
            price: { type: "text", label: "Price" },
          },
          defaultItemProps: {
            top: "30%",
            right: "40%",
            title: "Product Name",
            price: "$0.00",
          },
        },
      },
      defaultProps: {
        header: "Autumn in the City: A Curated Look",
        subheader: "Inspiration",
        description:
          "Discover how we style this season's most sought-after pieces for the perfect urban ensemble.",
        ctaText: "Shop the Look",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCEMrhSDou2quXn3m45RGq7MZg9LrC6bfhIAUm012lCQ_f8jpBzFh738jzvkUbVSvKYNDVMBbivnX7veuwSk3TGH9bNl5BfoEo3grMYfpsMwy6PMb64zfUGaMHrKOmFpveIv6T-oTClRskrusCg2y6dvMwDuVww7KtswcekZJ6mXeuemf16PtjE2eMsmz_HCFBK4MdtRCYMLJe7t0irTEWCIfOh4J0E4vUO2HPqy-uipa55y8s2m73GkCWX_X1GYY22o1m4k7IRLlTW",
        alt: "Lifestyle scene of a boutique store interior with model",
        hotspots: [
          {
            top: "30%",
            right: "40%",
            title: "Classic Blazer",
            price: "$320.00",
          },
          {
            bottom: "40%",
            right: "25%",
            title: "Leather Tote",
            price: "$550.00",
          },
        ],
      },
      render: ({
        header,
        subheader,
        description,
        ctaText,
        image,
        alt,
        hotspots,
      }) => {
        const content = {
          header: header || "",
          subheader: subheader || "",
          description: description || "",
          ctaText: ctaText || "",
          image: image || "",
          alt: alt || "",
          hotspots: hotspots || [],
        };
        const hotspotProducts = (hotspots || []).map((h, i) =>
          placeholderProduct(
            `insp-p-${i}`,
            h.title || `Product ${i + 1}`,
            `insp-product-${i}`,
            parseFloat((h.price || "$0").replace(/[^0-9.]/g, "")) || 0,
            image || "/placeholder-inspiration.jpg"
          )
        );
        const collection = {
          id: "insp-1",
          type: "inspiration",
          title: header || "",
          subtitle: subheader || "",
          description: description || "",
          mainImage: {
            imageUrl: image || "",
            alt: alt || "",
            ctaText: ctaText || "",
            ctaLink: "/collections/all",
          },
          products: hotspotProducts,
          isActive: true,
          createdAt: TIMESTAMP,
          updatedAt: TIMESTAMP,
        };
        return (
          <InspirationSection
            collection={collection}
            content={content}
          />
        );
      },
    },

    TestimonialsSection: {
      category: "Social Proof",
      label: "Testimonials Section",
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle" },
      },
      defaultProps: {
        title: "Our Community",
        subtitle: "Testimonials",
      },
      render: ({ title, subtitle }) => {
        const testimonials = [
          {
            id: "t-1",
            quote: "Exceptional quality and service. Every piece feels thoughtfully designed.",
            author: "Sarah Mitchell",
            role: "Verified Buyer",
            rating: 5,
            type: "text",
            isFeatured: true,
            isActive: true,
            createdAt: TIMESTAMP,
            updatedAt: TIMESTAMP,
          },
          {
            id: "t-2",
            quote: "Best purchase I've made this year. The craftsmanship is outstanding.",
            author: "James Lee",
            role: "Verified Buyer",
            rating: 5,
            type: "text",
            isFeatured: false,
            isActive: true,
            createdAt: TIMESTAMP,
            updatedAt: TIMESTAMP,
          },
          {
            id: "t-3",
            quote: "Luxury that lives up to the promise. Highly recommend.",
            author: "Emma Rodriguez",
            role: "Verified Buyer",
            rating: 4,
            type: "text",
            isFeatured: false,
            isActive: true,
            createdAt: TIMESTAMP,
            updatedAt: TIMESTAMP,
          },
        ];
        return (
          <TestimonialsSection
            testimonials={testimonials}
            title={title}
            subtitle={subtitle}
          />
        );
      },
    },

    NewsletterSignup: {
      category: "Home",
      label: "Newsletter Signup",
      fields: {
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        disclaimer: { type: "textarea", label: "Disclaimer" },
      },
      defaultProps: {
        title: "Join the Inner Circle",
        description:
          "Sign up for early access to new drops, curated seasonal guides, and exclusive editorial content.",
        disclaimer:
          "By subscribing, you agree to our Privacy Policy and Terms of Service.",
      },
      render: ({ title, description, disclaimer }) => {
        const content = {
          title: title || "",
          description: description || "",
          disclaimer: disclaimer || "",
        };
        return <NewsletterSignup content={content} />;
      },
    },

    TrustBadges: {
      category: "Home",
      label: "Trust Badges",
      fields: {
        badges: {
          type: "array",
          label: "Badges",
          arrayFields: {
            icon: { type: "text", label: "Icon" },
            title: { type: "text", label: "Title" },
            subtitle: { type: "text", label: "Subtitle" },
          },
          defaultItemProps: {
            icon: "local_shipping",
            title: "New Badge",
            subtitle: "Description",
          },
        },
      },
      defaultProps: {
        badges: [
          {
            icon: "local_shipping",
            title: "Free Global Shipping",
            subtitle: "On all orders over $100",
          },
          {
            icon: "restart_alt",
            title: "30-Day Returns",
            subtitle: "Hassle-free exchange policy",
          },
          {
            icon: "encrypted",
            title: "Secure Checkout",
            subtitle: "Encrypted payment processing",
          },
        ],
      },
      render: ({ badges }) => {
        return <TrustBadges badges={badges || []} />;
      },
    },
  },
};

export default config;
