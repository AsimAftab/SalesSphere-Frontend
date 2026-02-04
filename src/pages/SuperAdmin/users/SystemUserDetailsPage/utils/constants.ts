/**
 * System User - Constants
 * Centralized constants for routes and configuration
 */

/**
 * System User Routes
 */
export const SYSTEM_USER_ROUTES = {
    LIST: '/system-admin/system-users',
    DETAIL: (id: string) => `/system-admin/system-users/${id}`,
} as const;

/**
 * Placeholder Configuration
 */
export const PLACEHOLDER_CONFIG = {
    AVATAR_SIZE: '150x150',
    AVATAR_BG_COLOR: '197ADC',
    AVATAR_TEXT_COLOR: 'ffffff',
} as const;

