/**
 * Centralized Date Utilities
 * Provides consistent date handling across the application
 */

/**
 * Formats a Date object to YYYY-MM-DD string (local timezone)
 * @param date - The date to format
 * @returns YYYY-MM-DD string
 */
export const formatDateToLocalISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Checks if two date strings are the same day
 * @param date1 - First date string (YYYY-MM-DD)
 * @param date2 - Second date string (YYYY-MM-DD)
 * @returns true if same day
 */
export const isSameDate = (date1: string, date2: string): boolean => {
    return date1 === date2;
};

/**
 * Extracts the month name from a date string
 * @param dateString - Date string (YYYY-MM-DD or ISO format)
 * @returns Month name (e.g., "January")
 */
export const getMonthName = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', { month: 'long' });
};

/**
 * Formats a Date object from a filter to YYYY-MM-DD for comparison
 * Prevents timezone shift issues when comparing dates
 * @param date - The filter date
 * @returns YYYY-MM-DD string
 */
export const formatFilterDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Formats a date string to display format "21 Jan 2026"
 * @param dateString - Date string (ISO or YYYY-MM-DD format)
 * @returns Formatted string like "21 Jan 2026"
 */
export const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

/**
 * Formats a date string to display format with time "21 Jan 2026, 11:47 PM"
 * Handles various input formats and invalid dates gracefully
 * @param dateInput - Date string (ISO), Date object, or time string
 * @returns Formatted string or "-" if invalid
 */
export const formatDisplayDateTime = (dateInput: string | Date | null | undefined): string => {
    if (!dateInput) return '-';

    // Handle "HH:mm" time-only strings (legacy support for some API responses)
    if (typeof dateInput === 'string' && /^\d{1,2}:\d{2}/.test(dateInput)) {
        if (dateInput.includes('T')) {
            // It's a full ISO string that happens to start with numbers looking like time? Unlikely but safe to fall through
        } else {
            // Truly just a time string, e.g. "14:30"
            const [hours, minutes] = dateInput.split(':');
            const date = new Date(); // Use today's date
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));
            return _formatDateObjectWithTime(date);
        }
    }

    const date = new Date(dateInput);

    // Check for invalid date
    if (isNaN(date.getTime())) {
        return typeof dateInput === 'string' ? dateInput : '-';
    }

    return _formatDateObjectWithTime(date);
};

// Private helper to ensure consistent formatting
const _formatDateObjectWithTime = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Ensure AM/PM is uppercase (toLocaleTimeString usually does, but being explicit doesn't hurt if we wanted to force it)
    return `${day} ${month} ${year}, ${timeStr.toUpperCase()}`;
};

/**
 * Calculate age from date of birth
 * @param dobString - Date of birth string (ISO or YYYY-MM-DD format)
 * @returns Age in years or null if invalid
 */
export const getAge = (dobString?: string): number | null => {
    if (!dobString) return null;
    const today = new Date();
    const birthDate = new Date(dobString);
    
    // Check for invalid date
    if (isNaN(birthDate.getTime())) return null;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

