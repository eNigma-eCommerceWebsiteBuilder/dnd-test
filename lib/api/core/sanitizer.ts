/**
 * Input Sanitization
 * Removes potentially dangerous content from inputs
 */

/**
 * Sanitize string input to prevent XSS
 * Removes script tags, event handlers, and dangerous protocols
 */
export function sanitizeString(input: string): string {
    if (typeof input !== 'string') return input;

    return input
        // Remove script tags
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Remove data: protocol (can be used for XSS)
        .replace(/data:text\/html/gi, '')
        // Trim whitespace
        .trim();
}

/**
 * Sanitize object by recursively sanitizing all string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(item =>
            typeof item === 'object' ? sanitizeObject(item as Record<string, unknown>) :
                typeof item === 'string' ? sanitizeString(item) :
                    item
        ) as unknown as T;
    }

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value as Record<string, unknown>);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized as unknown as T;
}

/**
 * Validate payload size
 * Prevents excessively large payloads
 */
export function validatePayloadSize(
    data: unknown,
    maxSize: number = 1024 * 1024 // 1MB default
): void {
    if (!data) return;

    const size = new Blob([JSON.stringify(data)]).size;

    if (size > maxSize) {
        throw new Error(
            `Payload too large: ${(size / 1024).toFixed(2)}KB exceeds limit of ${(maxSize / 1024).toFixed(2)}KB`
        );
    }
}

/**
 * Sanitize and validate input data
 * Combines sanitization and size validation
 */
export function sanitizeAndValidate<T extends Record<string, unknown>>(
    data: T,
    maxSize?: number
): T {
    // Validate size first (before sanitization for performance)
    validatePayloadSize(data, maxSize);

    // Sanitize the data
    return sanitizeObject(data);
}
