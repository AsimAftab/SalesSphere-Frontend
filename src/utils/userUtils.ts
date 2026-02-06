/**
 * User Utilities
 * Shared utility functions for ALL user types (employees, system users, admins)
 * These users are the same entity - just with different roles
 */

// --- Avatar Utilities ---

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

const AVATAR_SIZES: Record<AvatarSize, string> = {
    xs: '32x32',
    sm: '40x40',
    md: '80x80',
    lg: '150x150',
};

/**
 * Get initials from a user's name
 * @param name - User's full name
 * @param maxChars - Maximum characters to return (1 or 2)
 */
export const getInitials = (name?: string, maxChars: 1 | 2 = 2): string => {
    if (!name) return 'U';

    const initials = name
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word[0])
        .join('')
        .toUpperCase();

    return initials.slice(0, maxChars) || 'U';
};

/**
 * Get avatar URL with fallback to placeholder
 * @param avatarUrl - Existing avatar URL (if any)
 * @param userName - User's name for generating initials
 * @param size - Avatar size preset
 */
export const getAvatarUrl = (
    avatarUrl?: string | null,
    userName?: string,
    size: AvatarSize = 'lg'
): string => {
    if (avatarUrl) return avatarUrl;

    const initial = getInitials(userName, 1);
    const sizeStr = AVATAR_SIZES[size];
    return `https://placehold.co/${sizeStr}/197ADC/ffffff?text=${initial}`;
};

// --- Role Utilities ---

/**
 * Role display configuration for all user types
 * Includes system roles and organization roles
 */
export const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
    // System roles
    superadmin: {
        label: 'Super Admin',
        className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    developer: {
        label: 'Developer',
        className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    // Organization roles
    admin: {
        label: 'Admin',
        className: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    user: {
        label: 'User',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
    },
};

/**
 * Get role configuration with fallback
 */
export const getRoleConfig = (role?: string) => {
    const normalizedRole = role?.toLowerCase();
    return ROLE_CONFIG[normalizedRole || ''] || {
        label: role || 'Unknown',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
    };
};

/**
 * Format role name for display
 * Handles both base roles and custom roles
 */
export const formatRoleName = (role?: string): string => {
    return getRoleConfig(role).label;
};

/**
 * Resolve display role from user object
 * Priority: customRoleId.name > position > role > fallback
 */
export const resolveUserRole = (user?: {
    role?: string;
    position?: string;
    customRoleId?: string | { _id?: string; name?: string } | null;
}, fallback = 'Staff'): string => {
    if (!user) return fallback;

    // Check for custom role (populated object with name)
    if (user.customRoleId && typeof user.customRoleId === 'object' && user.customRoleId.name) {
        return user.customRoleId.name;
    }

    // Check for position field
    if (user.position) {
        return user.position;
    }

    // Format the base role
    if (user.role) {
        return formatRoleName(user.role);
    }

    return fallback;
};

// --- Type Exports ---
export type { AvatarSize };
