import { apiMutate, ApiError } from '../../core/client';
import { validateEmail } from '../../utils/validators';
import type {
    ApiMutateOptions,
    SubscriptionCheckoutRequest,
    SubscriptionCheckoutResponse,
} from '../../types';

export async function createSubscriptionCheckout(
    data: SubscriptionCheckoutRequest,
    options: ApiMutateOptions = {}
): Promise<SubscriptionCheckoutResponse> {
    if (!data || typeof data !== 'object') {
        throw new ApiError('Checkout data is required', 400, 'MISSING_DATA');
    }

    if (!data.customerEmail) {
        throw new ApiError('Customer email is required', 400, 'MISSING_EMAIL');
    }
    validateEmail(data.customerEmail);

    if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.trim().length === 0) {
        throw new ApiError('Customer name is required', 400, 'MISSING_NAME');
    }

    if (!data.shippingAddress || typeof data.shippingAddress !== 'object') {
        throw new ApiError('Shipping address is required', 400, 'MISSING_ADDRESS');
    }

    const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredAddressFields) {
        if (!data.shippingAddress[field as keyof typeof data.shippingAddress]) {
            throw new ApiError(
                `Shipping address ${field} is required`,
                400,
                `MISSING_ADDRESS_${field.toUpperCase()}`
            );
        }
    }

    if (!data.successUrl) {
        throw new ApiError('Success URL is required', 400, 'MISSING_SUCCESS_URL');
    }

    if (!data.cancelUrl) {
        throw new ApiError('Cancel URL is required', 400, 'MISSING_CANCEL_URL');
    }

    return apiMutate<SubscriptionCheckoutResponse>('/checkout/subscription', {
        ...options,
        method: 'POST',
        body: data,
    });
}
