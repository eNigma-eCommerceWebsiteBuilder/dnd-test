import type {
    PaymentMethod as ApiPaymentMethod,
    StripeConfig as ApiStripeConfig
} from '@/lib/api/types';

/**
 * Saved Payment Method Interface
 * 
 * Represents a user's saved card/payment method.
 * Extends or complements the API PaymentMethod type.
 */
export interface SavedPaymentMethod {
    id: string;
    type: 'card' | 'paypal' | string;
    isDefault: boolean;

    // Card specific details
    card?: {
        brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unionpay' | 'jcb' | 'diners' | 'unknown';
        last4: string;
        expMonth: number;
        expYear: number;
    };

    // Billing details
    billingDetails?: {
        name?: string;
    };

    // Metadata
    createdAt?: string;
}

export interface PaymentMethodListProps {
    paymentMethods: ApiPaymentMethod[] | SavedPaymentMethod[];
}

export interface PaymentMethodCardProps {
    method: SavedPaymentMethod;
    className?: string;
}

export type StripeConfig = ApiStripeConfig;

export interface AddCardButtonProps {
    className?: string;
    stripeConfig?: StripeConfig;
}

export interface StripeCardFormProps {
    stripeConfig: StripeConfig;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export interface DefaultBadgeProps {
    className?: string;
}

export interface ExpiringWarningProps {
    expMonth: number;
    expYear: number;
    className?: string;
}

export interface CardBrandIconProps {
    brand: string;
    className?: string;
}

export interface DeleteCardButtonProps {
    paymentMethodId: string;
    className?: string;
}

export interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isDeleting?: boolean;
    paymentMethodId?: string;
}

export interface SetDefaultButtonProps {
    paymentMethodId: string;
    isDefault: boolean;
    className?: string;
}
