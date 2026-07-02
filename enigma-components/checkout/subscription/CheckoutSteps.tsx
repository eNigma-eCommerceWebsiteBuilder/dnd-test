'use client';

import { cn } from '@/lib/utils/cn';

export interface SubscriptionCheckoutStep {
    id: string;
    name: string;
    completed: boolean;
    current: boolean;
}

interface CheckoutStepsProps {
    steps: SubscriptionCheckoutStep[];
    currentStepId: string;
    onStepClick?: (stepId: string) => void;
    className?: string;
}

export default function CheckoutSteps({
    steps,
    currentStepId,
    onStepClick,
    className,
}: CheckoutStepsProps) {
    const handleStepClick = (step: SubscriptionCheckoutStep) => {
        if ((step.completed || step.current) && onStepClick) {
            onStepClick(step.id);
        }
    };

    return (
        <nav className={cn('@container w-full', className)} aria-label="Checkout progress">
            <ol className="flex flex-wrap items-center gap-1 @sm:gap-2">
                {steps.map((step, index) => {
                    const isActive = step.id === currentStepId || step.current;
                    const isCompleted = step.completed;
                    const isClickable = isCompleted || isActive;

                    return (
                        <li key={step.id} className="flex items-center">
                            {index > 0 ? (
                                <span
                                    className="material-symbols-outlined text-text-muted mx-1 @sm:mx-2 text-[14px] @sm:text-[16px]"
                                    aria-hidden="true"
                                >
                                    chevron_right
                                </span>
                            ) : null}
                            <button
                                type="button"
                                onClick={() => handleStepClick(step)}
                                disabled={!isClickable}
                                className={cn(
                                    'text-xs @sm:text-sm font-medium transition-colors',
                                    isActive && 'text-primary underline underline-offset-8',
                                    isCompleted && !isActive && 'text-text-muted hover:text-primary',
                                    !isClickable && 'text-text-muted cursor-default'
                                )}
                                aria-current={isActive ? 'step' : undefined}
                            >
                                {step.name}
                            </button>
                            {isCompleted ? <span className="sr-only">(completed)</span> : null}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
