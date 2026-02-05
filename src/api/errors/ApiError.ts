/**
 * Centralized API Error Handling Utilities
 *
 * This module provides standardized error handling across all API services,
 * following the Single Responsibility Principle and DRY principles.
 */

// --- V8 Stack Trace Support ---
// V8 engines (Chrome, Node.js) have captureStackTrace but it's not in TS types
interface ErrorWithCaptureStackTrace extends ErrorConstructor {
    captureStackTrace?(targetObject: object, constructorOpt?: NewableFunction): void;
}

// --- Error Types ---

export interface ApiErrorData {
    message?: string;
    errors?: Record<string, string[]>;
    code?: string;
    [key: string]: unknown;
}

export interface ApiErrorOptions {
    status?: number;
    code?: string;
    data?: ApiErrorData;
    originalError?: unknown;
}

// --- ApiError Class ---

/**
 * Custom Error class for API-related errors.
 * Provides structured error information including HTTP status, error codes, and response data.
 */
export class ApiError extends Error {
    public readonly status: number;
    public readonly code: string;
    public readonly data: ApiErrorData | null;
    public readonly isApiError = true;
    public readonly timestamp: Date;

    constructor(message: string, options: ApiErrorOptions = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = options.status ?? 500;
        this.code = options.code ?? 'UNKNOWN_ERROR';
        this.data = options.data ?? null;
        this.timestamp = new Date();

        // Maintains proper stack trace for where error was thrown (only in V8)
        const ErrorWithCapture = Error as ErrorWithCaptureStackTrace;
        if (typeof ErrorWithCapture.captureStackTrace === 'function') {
            ErrorWithCapture.captureStackTrace(this, ApiError);
        }
    }

    /**
     * Check if this is a specific HTTP status error
     */
    isStatus(status: number): boolean {
        return this.status === status;
    }

    /**
     * Check if this is a client error (4xx)
     */
    isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }

    /**
     * Check if this is a server error (5xx)
     */
    isServerError(): boolean {
        return this.status >= 500;
    }

    /**
     * Check if this is an authentication error
     */
    isAuthError(): boolean {
        return this.status === 401;
    }

    /**
     * Check if this is a forbidden error
     */
    isForbidden(): boolean {
        return this.status === 403;
    }

    /**
     * Check if this is a not found error
     */
    isNotFound(): boolean {
        return this.status === 404;
    }

    /**
     * Check if this is a validation error
     */
    isValidationError(): boolean {
        return this.status === 422 || this.code === 'VALIDATION_ERROR';
    }

    /**
     * Get validation errors if available
     */
    getValidationErrors(): Record<string, string[]> | null {
        return this.data?.errors ?? null;
    }

    /**
     * Serialize error for logging
     */
    toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            code: this.code,
            data: this.data,
            timestamp: this.timestamp.toISOString(),
        };
    }
}

// --- Error Code Constants ---

export const API_ERROR_CODES = {
    // Network errors
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',

    // Authentication errors
    UNAUTHORIZED: 'UNAUTHORIZED',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

    // Authorization errors
    FORBIDDEN: 'FORBIDDEN',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

    // Resource errors
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    CONFLICT: 'CONFLICT',

    // Validation errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',

    // Server errors
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

    // Generic
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];

// --- Error Extraction Utilities ---

interface AxiosLikeError {
    response?: {
        status?: number;
        data?: ApiErrorData;
    };
    message?: string;
    code?: string;
}

/**
 * Extracts error message from various error formats
 */
export function extractErrorMessage(error: unknown, defaultMessage: string = 'An unexpected error occurred'): string {
    if (error instanceof ApiError) {
        return error.message;
    }

    if (error instanceof Error) {
        // Check for Axios-like error structure
        const axiosError = error as Error & AxiosLikeError;
        if (axiosError.response?.data?.message) {
            return axiosError.response.data.message;
        }
        return error.message || defaultMessage;
    }

    if (typeof error === 'string') {
        return error;
    }

    // Handle plain objects with message property
    if (error && typeof error === 'object' && 'message' in error) {
        return String((error as { message: unknown }).message);
    }

    return defaultMessage;
}

/**
 * Extracts HTTP status from various error formats
 */
export function extractErrorStatus(error: unknown): number {
    if (error instanceof ApiError) {
        return error.status;
    }

    const axiosError = error as AxiosLikeError;
    return axiosError?.response?.status ?? 500;
}

/**
 * Maps HTTP status codes to error codes
 */
function statusToErrorCode(status: number): ApiErrorCode {
    switch (status) {
        case 401:
            return API_ERROR_CODES.UNAUTHORIZED;
        case 403:
            return API_ERROR_CODES.FORBIDDEN;
        case 404:
            return API_ERROR_CODES.NOT_FOUND;
        case 409:
            return API_ERROR_CODES.CONFLICT;
        case 422:
            return API_ERROR_CODES.VALIDATION_ERROR;
        case 500:
            return API_ERROR_CODES.INTERNAL_ERROR;
        case 503:
            return API_ERROR_CODES.SERVICE_UNAVAILABLE;
        default:
            return API_ERROR_CODES.UNKNOWN_ERROR;
    }
}

// --- Main Error Handler ---

/**
 * Converts any error into a standardized ApiError.
 * Use this in catch blocks to ensure consistent error handling.
 *
 * @example
 * ```typescript
 * try {
 *   await api.get('/endpoint');
 * } catch (error) {
 *   throw handleApiError(error, 'Failed to fetch data');
 * }
 * ```
 */
export function handleApiError(error: unknown, defaultMessage: string = 'An unexpected error occurred'): ApiError {
    // Already an ApiError, return as-is
    if (error instanceof ApiError) {
        return error;
    }

    const message = extractErrorMessage(error, defaultMessage);
    const status = extractErrorStatus(error);
    const code = statusToErrorCode(status);

    const axiosError = error as AxiosLikeError;
    const data = axiosError?.response?.data ?? null;

    return new ApiError(message, {
        status,
        code,
        data: data ?? undefined,
        originalError: error,
    });
}

// --- Type Guards ---

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError || (
        error !== null &&
        typeof error === 'object' &&
        'isApiError' in error &&
        (error as { isApiError: unknown }).isApiError === true
    );
}

/**
 * Type guard to check if error is a specific HTTP status
 */
export function isStatusError(error: unknown, status: number): boolean {
    if (isApiError(error)) {
        return error.status === status;
    }
    return extractErrorStatus(error) === status;
}

// --- Convenience Error Creators ---

/**
 * Creates a validation error with field-specific errors
 */
export function createValidationError(
    message: string,
    fieldErrors: Record<string, string[]>
): ApiError {
    return new ApiError(message, {
        status: 422,
        code: API_ERROR_CODES.VALIDATION_ERROR,
        data: { message, errors: fieldErrors },
    });
}

/**
 * Creates a not found error
 */
export function createNotFoundError(resourceName: string, resourceId?: string): ApiError {
    const message = resourceId
        ? `${resourceName} with ID '${resourceId}' not found`
        : `${resourceName} not found`;

    return new ApiError(message, {
        status: 404,
        code: API_ERROR_CODES.NOT_FOUND,
    });
}

/**
 * Creates a forbidden error
 */
export function createForbiddenError(message: string = 'You do not have permission to perform this action'): ApiError {
    return new ApiError(message, {
        status: 403,
        code: API_ERROR_CODES.FORBIDDEN,
    });
}

/**
 * Creates an unauthorized error
 */
export function createUnauthorizedError(message: string = 'Authentication required'): ApiError {
    return new ApiError(message, {
        status: 401,
        code: API_ERROR_CODES.UNAUTHORIZED,
    });
}
