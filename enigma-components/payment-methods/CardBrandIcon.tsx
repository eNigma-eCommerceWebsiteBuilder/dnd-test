import { cn } from '@/lib/utils';
import type { CardBrandIconProps } from './types';

/**
 * Card Brand Icon Component
 * 
 * Displays SVG icon for credit card brands.
 * Supports: Visa, Mastercard, Amex, Discover, and fallback generic.
 */
export function CardBrandIcon({ brand, className }: CardBrandIconProps) {
    const normalizedBrand = brand.toLowerCase().replace(/\s/g, '');

    const containerClasses = cn(
        "@container w-full h-full flex items-center justify-center bg-contain bg-center bg-no-repeat",
        className
    );

    switch (normalizedBrand) {
        case 'visa':
            return (
                <div className={containerClasses} aria-label="Visa">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary">
                        <path d="M18 6L11 42H17.8L24.8 6H18ZM30 6L23 42H29.8L36.8 6H30Z" fill="currentColor" />
                        <path d="M48 6H40L36 28L34 6H26L32 42H40L48 6Z" fill="currentColor" />
                        <path d="M12 6H5.4C5 6 4.3 6.3 4 6.8L0 16L2.6 30H14L18 6H12Z" fill="currentColor" />
                    </svg>
                </div>
            );
        case 'mastercard':
            return (
                <div className={containerClasses} aria-label="Mastercard">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <circle cx="9" cy="12" r="7" className="fill-primary/80" />
                        <circle cx="15" cy="12" r="7" className="fill-accent/80" />
                    </svg>
                </div>
            );
        case 'amex':
        case 'americanexpress':
            return (
                <div className={containerClasses} aria-label="American Express">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-badge bg-primary">
                        <path d="M4 14H6M8 14H12M14 14H16M18 14H20" stroke="var(--color-on-primary)" strokeWidth="2" />
                        <path d="M6 10H18" stroke="var(--color-on-primary)" strokeWidth="2" />
                    </svg>
                </div>
            );
        default:
            return (
                <div className={containerClasses} aria-label="Generic Card">
                    <span className="material-symbols-outlined text-text-muted text-2xl">
                        credit_card
                    </span>
                </div>
            );
    }
}
