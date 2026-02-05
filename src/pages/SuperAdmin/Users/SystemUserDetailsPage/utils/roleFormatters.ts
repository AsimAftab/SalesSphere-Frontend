/**
 * System User - Role Formatters
 * Utility functions for formatting role names
 */

/**
 * Format system user role for display
 */
export const formatRoleName = (role?: string): string => {
    const roleMap: Record<string, string> = {
        'superadmin': 'Super Admin',
        'developer': 'Developer',
    };

    return roleMap[role || ''] || role || 'Unknown';
};
