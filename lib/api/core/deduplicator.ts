/**
 * Request Deduplication
 * Prevents duplicate concurrent requests to the same endpoint
 */

type PendingRequest<T> = Promise<T>;

class RequestDeduplicator {
    private pendingRequests = new Map<string, PendingRequest<unknown>>();

    /**
     * Execute a request with deduplication
     * If the same key is already pending, returns that promise
     */
    async execute<T>(
        key: string,
        fn: () => Promise<T>
    ): Promise<T> {
        // Check if request is already pending
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key)! as PendingRequest<T>;
        }

        // Create new request
        const promise = fn().finally(() => {
            // Remove from pending after completion
            this.pendingRequests.delete(key);
        });

        this.pendingRequests.set(key, promise);
        return promise;
    }

    /**
     * Clear all pending requests
     */
    clear(): void {
        this.pendingRequests.clear();
    }

    /**
     * Check if a request is currently pending
     */
    isPending(key: string): boolean {
        return this.pendingRequests.has(key);
    }

    /**
     * Get count of pending requests
     */
    getPendingCount(): number {
        return this.pendingRequests.size;
    }
}

export const requestDeduplicator = new RequestDeduplicator();

/**
 * Create a cache key for request deduplication
 */
export function createRequestKey(
    endpoint: string,
    method: string,
    params?: Record<string, unknown>
): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${method}:${endpoint}:${paramString}`;
}
