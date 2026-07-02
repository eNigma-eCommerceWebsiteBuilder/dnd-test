'use client';

import { cn } from '@/lib/utils/cn';

interface Step {
    id: string;
    name: string;
    completed: boolean;
    current: boolean;
}

interface CheckoutStepsProps {
    /** Array of checkout steps */
    steps: Step[];
    /** Current step ID */
    currentStepId: string;
    /** Callback when step is clicked */
    onStepClick?: (stepId: string) => void;
    /** Additional CSS classes */
    className?: string;
}

/**
 * CheckoutSteps Component (Client)
 * 
 * Step indicator/breadcrumbs showing checkout progress:
 * - Cart → Shipping → Payment → Review
 * - Uses CHECKOUT_STEPS constant pattern
 * - Highlights current step with primary color
 * - Uses @container queries for responsive layout
 * 
 * Component Design Rules (from PAGE_AND_COMPONENTS_PLAN.md):
 * - Section 2.3: Every structural component must have `@container` on root
 * - Section 2.4: Hardcode functional UI text (step names, navigation labels)
 * - Section 2.1: Use theme variables from tailwind.config.ts
 */
export function CheckoutSteps({
    steps,
    currentStepId,
    onStepClick,
    className
}: CheckoutStepsProps) {
    // Default step configuration if none provided
    const displaySteps = steps.length > 0 ? steps : [
        { id: 'cart', name: 'Cart', completed: false, current: true },
        { id: 'shipping', name: 'Shipping', completed: false, current: false },
        { id: 'payment', name: 'Payment', completed: false, current: false },
        { id: 'review', name: 'Review', completed: false, current: false },
    ];

    const handleStepClick = (step: Step) => {
        // Only allow clicking on completed steps or current step
        if ((step.completed || step.current) && onStepClick) {
            onStepClick(step.id);
        }
    };

    return (
        <nav
            className={cn(
                "@container w-full",
                className
            )}
            aria-label="Checkout progress"
        >
            {/* Breadcrumb style for all sizes */}
            <ol className="flex flex-wrap items-center gap-1 @sm:gap-2">
                {displaySteps.map((step, index) => {
                    const isActive = step.id === currentStepId || step.current;
                    const isCompleted = step.completed;
                    const isClickable = isCompleted || isActive;

                    return (
                        <li key={step.id} className="flex items-center">
                            {/* Separator chevron */}
                            {index > 0 && (
                                <span
                                    className="material-symbols-outlined text-text-muted mx-1 @sm:mx-2 text-[14px] @sm:text-[16px]"
                                    aria-hidden="true"
                                >
                                    chevron_right
                                </span>
                            )}

                            {/* Step button/text */}
                            <button
                                type="button"
                                onClick={() => handleStepClick(step)}
                                disabled={!isClickable}
                                className={cn(
                                    "text-xs @sm:text-sm font-medium transition-colors",
                                    isActive && "text-primary",
                                    isCompleted && !isActive && "text-primary/60 hover:text-primary cursor-pointer",
                                    !isClickable && "text-text-muted cursor-default",
                                    isClickable && "focus:outline-none focus:underline"
                                )}
                                aria-current={isActive ? 'step' : undefined}
                            >
                                {/* Step name - Hardcoded functional UI */}
                                {step.name}
                            </button>

                            {/* Completed checkmark (hidden, for accessibility) */}
                            {isCompleted && (
                                <span className="sr-only">(completed)</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default CheckoutSteps;
