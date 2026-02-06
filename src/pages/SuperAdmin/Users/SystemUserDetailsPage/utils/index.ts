/**
 * System User - Utils
 * Centralized utilities for system user pages
 */

// --- Routes ---
export const SYSTEM_USER_ROUTES = {
    LIST: '/system-admin/system-users',
    DETAIL: (id: string) => `/system-admin/system-users/${id}`,
} as const;

// --- Re-export shared utilities ---
export { getAvatarUrl, formatRoleName, getRoleConfig, getInitials, ROLE_CONFIG } from '@/utils/userUtils';

// --- Field Config ---
export * from './fieldConfig';
