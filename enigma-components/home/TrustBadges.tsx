import type { TrustBadgeContent } from '@/lib/content';
import { cn } from '@/lib/utils/cn';

interface TrustBadgesProps {
  badges: readonly TrustBadgeContent[];
  className?: string;
}

export const TrustBadges = ({ badges, className }: TrustBadgesProps) => {
  return (
    <section className={cn('@container border-t border-border', className)}>
      <div className="grid grid-cols-1 gap-8 @md:grid-cols-3">
        {badges.map((badge, index) => (
          <div
            key={`${badge.icon}-${badge.title}`}
            className={cn(
              'flex items-center justify-center gap-6',
              index === 0 && '@lg:justify-start',
              index === badges.length - 1 && '@lg:justify-end',
            )}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined">{badge.icon}</span>
            </div>
            <div>
              <h4 className="font-bold text-text-base">{badge.title}</h4>
              <p className="text-xs uppercase tracking-tighter text-text-muted">
                {badge.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
