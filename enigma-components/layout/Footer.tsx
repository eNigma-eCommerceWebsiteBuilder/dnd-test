import Link from 'next/link';
import type { FooterContent } from '@/lib/content';
import { cn } from '@/lib/utils/cn';

interface FooterProps {
  className?: string;
  content: FooterContent;
  siteName: string;
}

export const Footer = ({ className, content, siteName }: FooterProps) => {
  const brandMark = siteName.split(' ')[0] ?? siteName;

  return (
    <footer
      className={cn(
        '@container border-t border-border bg-bg-surface px-6 pt-20 pb-10 transition-colors duration-300 @lg:px-12',
        className,
      )}
    >
      <div className="mx-auto mb-20 grid max-w-[1440px] grid-cols-1 gap-12 @md:grid-cols-2 @lg:grid-cols-4">
        <div>
          <Link href="/" className="mb-8 flex items-center gap-2">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
              </svg>
            </div>
            <span className="text-xl font-black uppercase italic tracking-tighter text-text-base">
              {brandMark}
            </span>
          </Link>
          <p className="mb-8 text-sm leading-relaxed text-text-muted">
            {content.about}
          </p>
          <div className="flex gap-4">
            {['public', 'photo_camera', 'videocam'].map((icon) => (
              <a
                key={icon}
                href="#"
                className="flex size-10 items-center justify-center rounded-full border border-border text-text-base transition-all hover:bg-primary hover:text-on-primary"
              >
                <span className="material-symbols-outlined text-lg">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-8 text-lg font-bold text-text-base">
            {content.sectionTitles.shop}
          </h4>
          <ul className="space-y-4">
            {content.links.shop.map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="text-sm text-text-muted transition-colors hover:text-primary"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-8 text-lg font-bold text-text-base">
            {content.sectionTitles.care}
          </h4>
          <ul className="space-y-4">
            {content.links.care.map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="text-sm text-text-muted transition-colors hover:text-primary"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-8 text-lg font-bold text-text-base">
            {content.sectionTitles.company}
          </h4>
          <ul className="space-y-4">
            {content.links.company.map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="text-sm text-text-muted transition-colors hover:text-primary"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 border-t border-border pt-10 @md:flex-row">
        <p className="text-xs text-text-muted">{content.copyright}</p>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((cardIndex) => (
              <div
                key={cardIndex}
                className="h-6 w-10 rounded-card border border-border bg-bg-surface"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
