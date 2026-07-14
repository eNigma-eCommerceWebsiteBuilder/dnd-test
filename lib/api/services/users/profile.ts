import { apiRequest, apiMutate } from '../../core/client';
import type {
    User,
    UpdateUserProfileRequest,
    UpdateUserProfileResponse,
    ApiRequestOptions,
    ApiMutateOptions,
} from '../../types';

export async function getUserProfile(options: ApiRequestOptions = {}): Promise<User> {
    return await apiRequest<User>('/users/profile', {
        cache: 'no-store',
        ...options,
    });
}

export async function updateUserProfile(
    data: UpdateUserProfileRequest,
    options: ApiMutateOptions = {}
): Promise<UpdateUserProfileResponse> {
    return await apiMutate<UpdateUserProfileResponse>('/users/profile', {
        ...options,
        method: 'PUT',
        body: data,
    });
}
