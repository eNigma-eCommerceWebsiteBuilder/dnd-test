import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { Menu, HeroProduct } from '@/lib/api/types/menu';
import type { Promotion } from '@/lib/api/types/promotions';
import { PromotionBar } from '@/components/promotions/PromotionBar';
import { MegaMenu } from '@/components/layout/navigation/MegaMenu';
import { FeaturedProductCard } from '@/components/layout/navigation/FeaturedProductCard';
import { HeaderActions } from '@/components/layout/navigation/HeaderActions';

interface HeaderProps {
  className?: string;
  heroProduct: HeroProduct | null;
  menu: Menu | null;
  promotion: Promotion | null;
  siteName: string;
}

export const Header = ({
  className,
  heroProduct,
  menu,
  promotion,
  siteName,
}: HeaderProps) => {
  const brandMark = siteName.split(' ')[0] ?? siteName;

  return (
    <header
      className={cn(
        '@container sticky top-0 z-sticky border-b border-border bg-nav-bg/80 backdrop-blur-nav transition-colors duration-normal',
        className,
      )}
    >
      <PromotionBar promotion={promotion} />
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-6 py-4 @lg:px-12">
        <div className="flex flex-1 items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
              </svg>
            </div>
            <span className="text-2xl font-black uppercase italic tracking-tighter text-text-base">
              {brandMark}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 @lg:flex">
            {menu?.menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href || '#'}
                className="text-sm font-semibold text-text-base transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <HeaderActions
          menuItems={menu?.menuItems ?? []}
          className="flex-1 justify-end"
        />
      </div>

      {menu?.menuItems?.length ? (
        <div className="hidden border-t border-divider @lg:block">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-6 py-6 @lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] @lg:px-12">
            <MegaMenu menuItems={menu.menuItems} />
            <FeaturedProductCard heroProduct={heroProduct} />
          </div>
        </div>
      ) : null}
    </header>
  );
};
