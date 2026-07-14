/**
 * API Monitoring and Metrics
 * Tracks request performance and errors
 */

export interface ApiMetric {
    endpoint: string;
    method: string;
    status: number;
    duration: number;
    timestamp: number;
    success: boolean;
    error?: string;
    retryCount?: number;
}

class ApiMonitor {
    private metrics: ApiMetric[] = [];
    private maxMetrics = 1000; // Keep last 1000 metrics

    /**
     * Record an API request metric
     */
    record(metric: ApiMetric): void {
        this.metrics.push(metric);

        // Keep only recent metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            const statusEmoji = metric.success ? '✅' : '❌';
            console.log(
                `[API ${statusEmoji}] ${metric.method} ${metric.endpoint} - ${metric.status} (${metric.duration}ms)`
            );
        }

        // Send to external monitoring service if configured
        this.sendToMonitoring(metric);
    }

    /**
     * Get metrics for a specific endpoint
     */
    getMetrics(endpoint?: string): ApiMetric[] {
        if (endpoint) {
            return this.metrics.filter(m => m.endpoint === endpoint);
        }
        return [...this.metrics];
    }

    /**
     * Get average response time
     */
    getAverageDuration(endpoint?: string): number {
        const metrics = this.getMetrics(endpoint);
        if (metrics.length === 0) return 0;

        const total = metrics.reduce((sum, m) => sum + m.duration, 0);
        return Math.round(total / metrics.length);
    }

    /**
     * Get error rate
     */
    getErrorRate(endpoint?: string): number {
        const metrics = this.getMetrics(endpoint);
        if (metrics.length === 0) return 0;

        const errors = metrics.filter(m => !m.success).length;
        return (errors / metrics.length) * 100;
    }

    /**
     * Get success rate
     */
    getSuccessRate(endpoint?: string): number {
        return 100 - this.getErrorRate(endpoint);
    }

    /**
     * Clear all metrics
     */
    clear(): void {
        this.metrics = [];
    }

    /**
     * Send metric to external monitoring service
     * Override this in production with your monitoring solution (DataDog, New Relic, etc.)
     */
    private sendToMonitoring(metric: ApiMetric): void {
        // Example: Send to analytics
        if (typeof window !== 'undefined' && (window as unknown as { gtag: (...args: unknown[]) => void }).gtag) {
            (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'api_request', {
                endpoint: metric.endpoint,
                method: metric.method,
                status: metric.status,
                duration: metric.duration,
                success: metric.success,
            });
        }

        // Example: Send to custom analytics endpoint
        if (process.env.NEXT_PUBLIC_MONITORING_ENDPOINT) {
            fetch(process.env.NEXT_PUBLIC_MONITORING_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metric),
                keepalive: true,
            }).catch(() => {
                // Silently fail - monitoring shouldn't break the app
            });
        }
    }

    /**
     * Get performance report
     */
    getReport(): {
        totalRequests: number;
        successRate: number;
        averageDuration: number;
        slowestEndpoint: string | null;
        mostFailedEndpoint: string | null;
    } {
        const endpoints = [...new Set(this.metrics.map(m => m.endpoint))];

        let slowestEndpoint: string | null = null;
        let slowestDuration = 0;
        let mostFailedEndpoint: string | null = null;
        let highestErrorRate = 0;

        for (const endpoint of endpoints) {
            const avgDuration = this.getAverageDuration(endpoint);
            const errorRate = this.getErrorRate(endpoint);

            if (avgDuration > slowestDuration) {
                slowestDuration = avgDuration;
                slowestEndpoint = endpoint;
            }

            if (errorRate > highestErrorRate) {
                highestErrorRate = errorRate;
                mostFailedEndpoint = endpoint;
            }
        }

        return {
            totalRequests: this.metrics.length,
            successRate: this.getSuccessRate(),
            averageDuration: this.getAverageDuration(),
            slowestEndpoint,
            mostFailedEndpoint,
        };
    }
}

export const apiMonitor = new ApiMonitor();
