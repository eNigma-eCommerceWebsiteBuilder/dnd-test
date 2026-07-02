import type { PaymentMethod as ApiPaymentMethod } from '@/lib/api/types';
import { PaymentMethodCard } from './PaymentMethodCard';
import type { PaymentMethodListProps, SavedPaymentMethod } from './types';

function isSavedPaymentMethod(
    method: ApiPaymentMethod | SavedPaymentMethod
): method is SavedPaymentMethod {
    return 'isDefault' in method || 'card' in method || 'billingDetails' in method;
}

function toSavedPaymentMethod(
    method: ApiPaymentMethod | SavedPaymentMethod
): SavedPaymentMethod {
    if (isSavedPaymentMethod(method)) {
        return method;
    }

    return {
        id: method.id,
        type: 'card',
        isDefault: false,
    };
}

export function PaymentMethodList({ paymentMethods }: PaymentMethodListProps) {
    return (
        <div className="@container flex w-full flex-col gap-4">
            {paymentMethods.map((method) => (
                <PaymentMethodCard
                    key={method.id}
                    method={toSavedPaymentMethod(method)}
                />
            ))}
        </div>
    );
}
