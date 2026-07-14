import { cn } from '@/lib/utils/cn';

interface NextStepsCardViewProps {
  title: string;
  step1: string;
  step2: string;
  step3: string;
  email: string;
  className?: string;
}

export const puckComponentName = 'NextStepsCard';
export const puckLabel = 'Next Steps Card';
export const puckCategory = 'Checkout';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  step1: { type: 'textarea' as const, label: 'Step 1' },
  step2: { type: 'textarea' as const, label: 'Step 2' },
  step3: { type: 'textarea' as const, label: 'Step 3' },
  email: { type: 'text' as const, label: 'Customer Email' },
};

export const puckDefaults = {
  title: "What's Next?",
  step1: "We've sent a detailed receipt to",
  step2: "You'll receive a tracking number once your items ship.",
  step3: 'Our support team is available 24/7 if you have questions.',
  email: 'customer@example.com',
};


export function NextStepsCardView({
  title,
  step1,
  step2,
  step3,
  email,
  className,
}: NextStepsCardViewProps) {
  return (
    <div
      className={cn(
        '@container rounded-card border border-primary/20 bg-primary/5 p-4 @md:p-6',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">info</span>
        <h3 className="font-bold text-text-base">{title}</h3>
      </div>
      <ul className="space-y-3 text-sm text-text-muted">
        <li className="flex gap-3">
          <span className="font-bold text-primary">1.</span>
          <span>
            {step1} <strong className="text-text-base">{email}</strong>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="font-bold text-primary">2.</span>
          <span>{step2}</span>
        </li>
        <li className="flex gap-3">
          <span className="font-bold text-primary">3.</span>
          <span>{step3}</span>
        </li>
      </ul>
    </div>
  );
}
