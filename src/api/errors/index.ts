/**
 * API Error Handling Module
 *
 * Centralized error handling utilities for all API services.
 * Import from this module for consistent error handling across the application.
 *
 * @example
 * ```typescript
 * import { handleApiError, ApiError, isApiError } from '@/api/errors';
 *
 * try {
 *   await api.get('/endpoint');
 * } catch (error) {
 *   throw handleApiError(error, 'Failed to fetch data');
 * }
 * ```
 */

export {
    // Main error class
    ApiError,

    // Error handling utilities
    handleApiError,
    extractErrorMessage,
    extractErrorStatus,

    // Type guards
    isApiError,
    isStatusError,

    // Error creators
    createValidationError,
    createNotFoundError,
    createForbiddenError,
    createUnauthorizedError,

    // Constants
    API_ERROR_CODES,

    // Types
    type ApiErrorData,
    type ApiErrorOptions,
    type ApiErrorCode,
} from './ApiError';
