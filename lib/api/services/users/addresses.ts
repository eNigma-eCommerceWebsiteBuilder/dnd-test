import { apiMutate } from '../../core/client';
import type {
    AddAddressRequest,
    AddAddressResponse,
    DeleteAddressResponse,
    UserAddress,
    ApiMutateOptions,
} from '../../types';
import { unwrapResponseData } from '../../utils';

export async function addUserAddress(
    address: AddAddressRequest,
    options: ApiMutateOptions = {}
): Promise<UserAddress[]> {
    return unwrapResponseData(
        await apiMutate<AddAddressResponse>('/users/address', {
            ...options,
            method: 'POST',
            body: address,
            unwrapResponse: false,
        }),
    );
}

export async function deleteUserAddress(
    addressId: string,
    options: ApiMutateOptions = {}
): Promise<UserAddress[]> {
    return unwrapResponseData(
        await apiMutate<DeleteAddressResponse>(`/users/address/${addressId}`, {
            ...options,
            method: 'DELETE',
            unwrapResponse: false,
        }),
    );
}
