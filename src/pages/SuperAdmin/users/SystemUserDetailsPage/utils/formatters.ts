/**
 * System User - Formatters
 * Utility functions for formatting dates, ages, and user display data
 */

/**
 * Format date string to human-readable format
 */
export const formatDate = (date: string | undefined): string => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Calculate age from date of birth
 */
export const getAge = (dobString?: string): number | string => {
    if (!dobString) return '';

    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

/**
 * Format date of birth with age
 */
export const formatDateOfBirth = (dobString?: string): string => {
    if (!dobString) return 'N/A';

    const formattedDate = formatDate(dobString);
    const age = getAge(dobString);

    return age ? `${formattedDate} (${age} years)` : formattedDate;
};

/**
 * Get avatar URL with fallback to placeholder
 */
export const getAvatarUrl = (avatarUrl?: string, userName?: string): string => {
    if (avatarUrl) return avatarUrl;

    const initial = (userName || 'U').charAt(0).toUpperCase();
    return `https://placehold.co/150x150/197ADC/ffffff?text=${initial}`;
};
