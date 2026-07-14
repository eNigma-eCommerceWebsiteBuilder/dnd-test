import { cn } from '@/lib/utils/cn';
import { HeroProduct } from '@/lib/api/types';
import { HeroContent } from '@/lib/content';
import { HeroSectionView } from './HeroSectionView';

interface HeroSectionProps {
  className?: string;
  content: HeroContent;
  heroProduct: HeroProduct | null;
}

export const HeroSection = ({ className, content, heroProduct }: HeroSectionProps) => {
  if (!heroProduct) return null;

  return (
    <HeroSectionView
      title={content.title}
      productName={heroProduct.name}
      subtitle={heroProduct.description || content.subtitle}
      ctaPrimary={content.ctaPrimary}
      ctaSecondary={content.ctaSecondary}
      backgroundImage={heroProduct.images[0] || content.backgroundImage || '/placeholder-hero.jpg'}
      imageAlt={content.imageAlt}
      productSlug={heroProduct.slug}
      className={className}
    />
  );
};
