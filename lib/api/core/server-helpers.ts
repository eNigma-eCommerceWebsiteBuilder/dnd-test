import { getServerCookies } from './server-context';

export async function withServerCookies<T>(apiCall: () => Promise<T>): Promise<T> {
  await getServerCookies();
  return apiCall();
}

export async function withCookies<T extends Record<string, unknown>>(
  options: T = {} as T,
): Promise<T & { cookies: string }> {
  const cookieString = await getServerCookies();

  return {
    ...options,
    cookies: cookieString,
  };
}

export async function batchServerRequests<T extends unknown[]>(
  apiCalls: Array<() => Promise<unknown>>,
): Promise<T> {
  await getServerCookies();
  return Promise.all(apiCalls.map((apiCall) => apiCall())) as Promise<T>;
}

export function isServerComponent(): boolean {
  return typeof window === 'undefined';
}

export function assertClientSide(): void {
  if (isServerComponent()) {
    throw new Error(
      'This function can only be called from Client Components. ' +
        'Mutations (POST/PUT/DELETE) must be performed in Client Components or Server Actions.',
    );
  }
}

export async function serverSafeApiCall<T, Args extends unknown[]>(
  apiFunction: (...args: Args) => Promise<T>,
  args: Args,
  options?: { cookies?: string },
): Promise<T> {
  void options;

  try {
    return await apiFunction(...args);
  } catch (error: unknown) {
    if (isServerComponent()) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Server] API call failed: ${errorMessage}`);
    }

    throw error;
  }
}
