/**
 * Circuit Breaker
 * Prevents cascading failures by stopping requests to failing endpoints
 */

type CircuitState = 'closed' | 'open' | 'half-open';

interface CircuitBreakerConfig {
    failureThreshold: number; // Number of failures before opening
    resetTimeout: number; // Time in ms before attempting recovery
    monitoringWindow: number; // Time window for counting failures
}

export class CircuitBreaker {
    private state: CircuitState = 'closed';
    private failures: number = 0;
    private lastFailureTime: number = 0;
    private successCount: number = 0;
    private config: CircuitBreakerConfig;
    private failureTimestamps: number[] = [];

    constructor(config: Partial<CircuitBreakerConfig> = {}) {
        this.config = {
            failureThreshold: config.failureThreshold || 5,
            resetTimeout: config.resetTimeout || 30000, // 30 seconds
            monitoringWindow: config.monitoringWindow || 60000, // 1 minute
        };
    }

    /**
     * Execute a function with circuit breaker protection
     */
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        // Check if circuit should transition from open to half-open
        if (this.state === 'open') {
            const timeSinceFailure = Date.now() - this.lastFailureTime;

            if (timeSinceFailure >= this.config.resetTimeout) {
                this.state = 'half-open';
                this.successCount = 0;
            } else {
                throw new Error(
                    `Circuit breaker is open. Retry in ${Math.ceil((this.config.resetTimeout - timeSinceFailure) / 1000)}s`
                );
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess(): void {
        this.failures = 0;
        this.failureTimestamps = [];

        if (this.state === 'half-open') {
            this.successCount++;

            // After 3 successful requests in half-open, close the circuit
            if (this.successCount >= 3) {
                this.state = 'closed';
                this.successCount = 0;
            }
        }
    }

    private onFailure(): void {
        const now = Date.now();
        this.lastFailureTime = now;
        this.failureTimestamps.push(now);

        // Remove old failures outside monitoring window
        this.failureTimestamps = this.failureTimestamps.filter(
            timestamp => now - timestamp < this.config.monitoringWindow
        );

        this.failures = this.failureTimestamps.length;

        if (this.failures >= this.config.failureThreshold) {
            this.state = 'open';
        }

        // Reset success count on any failure
        this.successCount = 0;
    }

    /**
     * Get current circuit state
     */
    getState(): CircuitState {
        return this.state;
    }

    /**
     * Manually reset the circuit breaker
     */
    reset(): void {
        this.state = 'closed';
        this.failures = 0;
        this.successCount = 0;
        this.failureTimestamps = [];
    }

    /**
     * Check if circuit is allowing requests
     */
    isAllowingRequests(): boolean {
        if (this.state === 'open') {
            const timeSinceFailure = Date.now() - this.lastFailureTime;
            return timeSinceFailure >= this.config.resetTimeout;
        }
        return true;
    }
}

// Create circuit breakers for different endpoint groups
export const apiCircuitBreaker = new CircuitBreaker({
    failureThreshold: 5,
    resetTimeout: 30000,
    monitoringWindow: 60000,
});

export const analyticsCircuitBreaker = new CircuitBreaker({
    failureThreshold: 10, // More lenient for analytics
    resetTimeout: 15000, // Faster recovery
    monitoringWindow: 60000,
});
