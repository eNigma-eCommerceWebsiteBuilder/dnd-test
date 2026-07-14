/**
 * Request Retry Logic
 * Implements exponential backoff for transient failures
 */

import { hasErrorStatus } from './errors';

export interface RetryConfig {
    maxRetries: number;
    initialDelay: number; // ms
    maxDelay: number; // ms
    backoffMultiplier: number;
    retryableStatuses: number[]; // HTTP status codes to retry
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    backoffMultiplier: 2,
    retryableStatuses: [408, 429, 500, 502, 503, 504], // Timeout, rate limit, server errors
};

/**
 * Execute a function with retry logic and exponential backoff
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    config: Partial<RetryConfig> = {}
): Promise<T> {
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
    const retryConfig = {
        ...DEFAULT_RETRY_CONFIG,
        ...config,
        ...(isBuildPhase ? { maxRetries: 0 } : {}),
    };
    let lastError: Error;
    let attempt = 0;

    while (attempt <= retryConfig.maxRetries) {
        try {
            return await fn();
        } catch (error: unknown) {
            lastError = error as Error;
            attempt++;

            // Don't retry if we've exhausted attempts
            if (attempt > retryConfig.maxRetries) {
                break;
            }

            // Don't retry on client errors (4xx except 408/429)
            if (hasErrorStatus(error) && error.status >= 400 && error.status < 500) {
                if (!retryConfig.retryableStatuses.includes(error.status)) {
                    throw error;
                }
            }

            // Calculate delay with exponential backoff
            const baseDelay = retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1);

            // Add jitter (±25%) to prevent thundering herd
            const jitter = baseDelay * 0.25 * (Math.random() * 2 - 1);
            const delay = Math.min(baseDelay + jitter, retryConfig.maxDelay);

            // Log retry attempt
            if (!isBuildPhase && typeof console !== 'undefined') {
                console.warn(
                    `[Retry] Attempt ${attempt}/${retryConfig.maxRetries} failed. Retrying in ${Math.round(delay)}ms...`,
                    (error as Error).message
                );
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError!;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown, config: Partial<RetryConfig> = {}): boolean {
    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

    // Network errors are always retryable
    if (!hasErrorStatus(error) || error.status === 0) {
        return true;
    }

    // Check if status is in retryable list
    return retryConfig.retryableStatuses.includes(error.status);
}
