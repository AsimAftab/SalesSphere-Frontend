/**
 * Security Utilities
 * Centralized security functions to prevent XSS and other vulnerabilities
 */

/**
 * Validates URL against allowlist of safe protocols
 * Prevents XSS via javascript: or malicious data: URLs
 * 
 * @param url - The URL to validate
 * @returns The URL if safe, null otherwise
 * 
 * @example
 * getSafeImageUrl("blob:https://example.com/abc") // returns the URL
 * getSafeImageUrl("javascript:alert(1)") // returns null
 */
export const getSafeImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    try {
        // Allow blob URLs (local file previews from URL.createObjectURL)
        if (url.startsWith('blob:')) return url;
        // Allow data URLs but only for images
        if (url.startsWith('data:image/')) return url;
        // Parse and validate http/https URLs (from API)
        const parsed = new URL(url);
        if (['https:', 'http:'].includes(parsed.protocol)) {
            return url;
        }
        // Reject all other protocols (javascript:, vbscript:, file:, etc.)
        return null;
    } catch {
        // Invalid URL format
        return null;
    }
};
