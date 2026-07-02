import type { CheckoutSuccessNextStepsContent } from '@/lib/content';
import { cn } from '@/lib/utils/cn';

interface NextStepsCardProps {
  className?: string;
  content: CheckoutSuccessNextStepsContent;
  email: string;
}

export function NextStepsCard({
  className,
  content,
  email,
}: NextStepsCardProps) {
  return (
    <div
      className={cn(
        '@container rounded-card border border-primary/20 bg-primary/5 p-4 @md:p-6',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">info</span>
        <h3 className="font-bold text-text-base">{content.title}</h3>
      </div>
      <ul className="space-y-3 text-sm text-text-muted">
        <li className="flex gap-3">
          <span className="font-bold text-primary">1.</span>
          <span>
            {content.step1} <strong className="text-text-base">{email}</strong>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="font-bold text-primary">2.</span>
          <span>{content.step2}</span>
        </li>
        <li className="flex gap-3">
          <span className="font-bold text-primary">3.</span>
          <span>{content.step3}</span>
        </li>
      </ul>
    </div>
  );
}
