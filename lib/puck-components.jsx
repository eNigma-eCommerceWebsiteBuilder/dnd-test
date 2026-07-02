import { HeroSection } from "@/components/home/HeroSection";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { PromotionBar } from "@/components/promotions/PromotionBar";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { PriceDisplay } from "@/components/products/PriceDisplay";

const config = {
  components: {
    HeroSection: {
      category: "Home",
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        ctaPrimary: { type: "text", label: "Primary CTA" },
        ctaSecondary: { type: "text", label: "Secondary CTA" },
        productName: { type: "text", label: "Product Name" },
        productSlug: { type: "text", label: "Product Slug" },
        productDescription: { type: "textarea", label: "Product Description" },
        productImage: { type: "text", label: "Product Image URL" },
      },
      defaultProps: {
        title: "Timeless Quality for the Modern Wardrobe",
        subtitle:
          "Discover our curated collection of high-end essentials designed for the sophisticated individual. Effortless luxury, everyday.",
        ctaPrimary: "Shop the Collection",
        ctaSecondary: "View Lookbook",
        productName: "Premium Wool Coat",
        productSlug: "premium-wool-coat",
        productDescription:
          "Luxurious wool coat crafted from the finest materials for the modern wardrobe.",
        productImage:
          "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&q=80",
      },
      render: ({
        title,
        subtitle,
        ctaPrimary,
        ctaSecondary,
        productName,
        productSlug,
        productDescription,
        productImage,
      }) => {
        const content = {
          title,
          subtitle,
          ctaPrimary,
          ctaSecondary,
          backgroundImage: "",
          imageAlt: productName,
        };
        const heroProduct = {
          _id: "hero-product",
          name: productName,
          slug: productSlug,
          description: productDescription,
          images: [productImage],
          price: 0,
          inStock: true,
          stock: 1,
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        };
        return <HeroSection content={content} heroProduct={heroProduct} />;
      },
    },

    TestimonialCard: {
      category: "Social Proof",
      fields: {
        quote: { type: "textarea", label: "Quote" },
        author: { type: "text", label: "Author Name" },
        role: { type: "text", label: "Author Role" },
        avatar: { type: "text", label: "Avatar URL" },
        rating: {
          type: "select",
          label: "Rating",
          options: [
            { label: "1 Star", value: "1" },
            { label: "2 Stars", value: "2" },
            { label: "3 Stars", value: "3" },
            { label: "4 Stars", value: "4" },
            { label: "5 Stars", value: "5" },
          ],
        },
        platform: { type: "text", label: "Platform" },
      },
      defaultProps: {
        quote:
          "The quality is exceptional. Every piece feels thoughtfully designed and built to last. This is what luxury should feel like.",
        author: "Sarah Mitchell",
        role: "Verified Buyer",
        avatar: "",
        rating: "5",
        platform: "Trustpilot",
      },
      render: ({ quote, author, role, avatar, rating, platform }) => {
        const testimonial = {
          id: "testimonial-1",
          quote,
          author,
          role,
          avatar,
          rating: Number(rating) || 5,
          platform,
          type: "text",
          isFeatured: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return <TestimonialCard testimonial={testimonial} />;
      },
    },

    PromotionBar: {
      category: "Marketing",
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle" },
        ctaText: { type: "text", label: "CTA Text" },
        ctaLink: { type: "text", label: "CTA Link" },
        startDate: { type: "text", label: "Start Date (ISO)" },
        endDate: { type: "text", label: "End Date (ISO)" },
      },
      defaultProps: {
        title: "Free Shipping on All Orders",
        subtitle: "Limited time only — ends soon",
        ctaText: "Shop Now",
        ctaLink: "/collections/all",
        startDate: "2020-01-01T00:00:00Z",
        endDate: "2099-12-31T23:59:59Z",
      },
      render: ({
        title,
        subtitle,
        ctaText,
        ctaLink,
        startDate,
        endDate,
      }) => {
        const promotion = {
          id: "promo-1",
          backgroundImage: "",
          title,
          subtitle,
          description: "",
          ctaText,
          ctaLink,
          startDate,
          endDate,
        };
        return <PromotionBar promotion={promotion} />;
      },
    },

    CategoryCard: {
      category: "Products",
      fields: {
        name: { type: "text", label: "Category Name" },
        slug: { type: "text", label: "Category Slug" },
        image: { type: "text", label: "Image URL" },
        productCount: { type: "number", label: "Product Count" },
      },
      defaultProps: {
        name: "Outerwear",
        slug: "outerwear",
        image:
          "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80",
        productCount: 42,
      },
      render: ({ name, slug, image, productCount }) => {
        const category = {
          _id: "category-1",
          name,
          slug,
          image,
          productCount: Number(productCount) || 0,
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        };
        return <CategoryCard category={category} />;
      },
    },

    PriceDisplay: {
      category: "Products",
      fields: {
        price: { type: "number", label: "Price" },
        salePrice: { type: "number", label: "Sale Price" },
        originalPrice: { type: "number", label: "Original Price" },
        isOnSale: {
          type: "select",
          label: "On Sale",
          options: [
            { label: "No", value: "false" },
            { label: "Yes", value: "true" },
          ],
        },
        size: {
          type: "select",
          label: "Size",
          options: [
            { label: "Default", value: "default" },
            { label: "Large", value: "large" },
          ],
        },
      },
      defaultProps: {
        price: 299,
        salePrice: 199,
        originalPrice: 299,
        isOnSale: "true",
        size: "default",
      },
      render: ({
        price,
        salePrice,
        originalPrice,
        isOnSale,
        size,
      }) => {
        return (
          <PriceDisplay
            price={Number(price) || 0}
            salePrice={salePrice ? Number(salePrice) : null}
            originalPrice={originalPrice ? Number(originalPrice) : undefined}
            isOnSale={isOnSale === "true"}
            size={size || "default"}
          />
        );
      },
    },
  },
};

export default config;
