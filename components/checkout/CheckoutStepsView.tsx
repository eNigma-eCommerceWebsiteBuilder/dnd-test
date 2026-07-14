import { cn } from '@/lib/utils/cn';

interface CheckoutStep {
  id: string;
  name: string;
  completed: string;
  current: string;
}

interface CheckoutStepsViewProps {
  steps: CheckoutStep[];
  currentStepId: string;
  className?: string;
}

export const puckComponentName = 'CheckoutSteps';
export const puckLabel = 'Checkout Steps Progress';
export const puckCategory = 'Checkout';

export const puckFields = {
  currentStepId: { type: 'text' as const, label: 'Current Step ID' },
  steps: {
    type: 'array' as const,
    label: 'Steps',
    arrayFields: {
      id: { type: 'text' as const, label: 'Step ID' },
      name: { type: 'text' as const, label: 'Step Name' },
      completed: {
        type: 'select' as const,
        label: 'Completed',
        options: [
          { label: 'No', value: 'false' },
          { label: 'Yes', value: 'true' },
        ],
      },
      current: {
        type: 'select' as const,
        label: 'Current',
        options: [
          { label: 'No', value: 'false' },
          { label: 'Yes', value: 'true' },
        ],
      },
    },
    defaultItemProps: {
      id: 'new-step',
      name: 'New Step',
      completed: 'false',
      current: 'false',
    },
    getItemSummary: (item: CheckoutStep) => item.name,
    max: 6,
  },
};

export const puckDefaults = {
  currentStepId: 'shipping',
  steps: [
    { id: 'cart', name: 'Cart', completed: 'true', current: 'false' },
    { id: 'shipping', name: 'Shipping', completed: 'false', current: 'true' },
    { id: 'payment', name: 'Payment', completed: 'false', current: 'false' },
    { id: 'review', name: 'Review', completed: 'false', current: 'false' },
  ],
};

export function CheckoutStepsView({ steps, currentStepId, className }: CheckoutStepsViewProps) {
  return (
    <nav className={cn('@container w-full', className)} aria-label="Checkout progress">
      <ol className="flex flex-wrap items-center gap-1 @sm:gap-2">
        {steps.map((step, index) => {
          const isActive = step.id === currentStepId || step.current === 'true';
          const isCompleted = step.completed === 'true';

          return (
            <li key={step.id} className="flex items-center">
              {index > 0 && (
                <span className="material-symbols-outlined text-text-muted mx-1 @sm:mx-2 text-[14px] @sm:text-[16px]" aria-hidden="true">
                  chevron_right
                </span>
              )}
              <span
                className={cn(
                  'text-xs @sm:text-sm font-medium transition-colors',
                  isActive && 'text-primary',
                  isCompleted && !isActive && 'text-primary/60',
                  !isActive && !isCompleted && 'text-text-muted',
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {step.name}
              </span>
              {isCompleted && <span className="sr-only">(completed)</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
