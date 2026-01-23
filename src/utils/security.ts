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
        // Validate blob URLs: Must be a valid blob: URL string
        if (url.startsWith('blob:')) {
            const blobUrl = new URL(url);
            if (blobUrl.protocol === 'blob:') return url;
            return null;
        }

        // Validate data URLs: Must be strictly image type and base64 encoded
        if (url.startsWith('data:')) {
            // Regex enforces: data:image/[type];base64,[valid-base64-chars]
            // EXCLUDING SVG (svg+xml) as it can contain scripts <script>
            const dataUrlRegex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$/;
            if (dataUrlRegex.test(url)) {
                return url;
            }
            return null;
        }

        // Parse and validate http/https URLs (from API)
        // Use a dummy base to allow relative URLs (e.g. "/assets/icon.png") to parse correctly
        const dummyBase = 'http://dummy.com';
        const parsed = new URL(url, dummyBase);

        // CASE 1: Relative URLs (parsed.origin === dummyBase)
        // These are safe local paths like "/assets/img.png"
        if (parsed.origin === dummyBase) {
            // Ensure no dangerous protocols slipped in via weird relative paths
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                return url;
            }
            return null;
        }

        // CASE 2: Absolute URLs
        // Must be strictly http or https
        if (['https:', 'http:'].includes(parsed.protocol)) {
            // Optional: Block known malicious domains or allowlist specific domains here if needed
            return url;
        }

        return null;
    } catch {
        // Invalid URL format
        return null;
    }
};
