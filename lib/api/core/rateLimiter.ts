/**
 * Rate Limiter
 * Prevents client-side API abuse with configurable rate limits
 */

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

class RateLimiter {
    private requests: number[] = [];
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }) {
        this.config = config;
    }

    /**
     * Check if a request can be made
     * @returns True if within rate limit
     */
    canMakeRequest(): boolean {
        const now = Date.now();

        // Remove requests outside the time window
        this.requests = this.requests.filter(
            time => now - time < this.config.windowMs
        );

        if (this.requests.length >= this.config.maxRequests) {
            return false;
        }

        this.requests.push(now);
        return true;
    }

    /**
     * Get time until rate limit resets
     * @returns Milliseconds until next request allowed
     */
    getResetTime(): number {
        if (this.requests.length === 0) return 0;

        const oldestRequest = Math.min(...this.requests);
        const resetTime = oldestRequest + this.config.windowMs;
        const remaining = resetTime - Date.now();

        return Math.max(0, remaining);
    }

    /**
     * Get remaining requests in current window
     */
    getRemainingRequests(): number {
        const now = Date.now();
        this.requests = this.requests.filter(
            time => now - time < this.config.windowMs
        );
        return Math.max(0, this.config.maxRequests - this.requests.length);
    }

    /**
     * Reset the rate limiter
     */
    reset(): void {
        this.requests = [];
    }
}

// Create singleton instances for different rate limit tiers
export const apiRateLimiter = new RateLimiter({
    maxRequests: 100,
    windowMs: 60000, // 100 requests per minute
});

export const analyticsRateLimiter = new RateLimiter({
    maxRequests: 500,
    windowMs: 60000, // 500 analytics events per minute
});

export { RateLimiter };
