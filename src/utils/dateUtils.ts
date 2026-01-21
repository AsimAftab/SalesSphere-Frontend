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
