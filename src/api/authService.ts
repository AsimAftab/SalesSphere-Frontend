/**
 * Auth Service - Backward Compatibility Layer
 *
 * This file re-exports from the modular auth implementation.
 * The auth module has been split into smaller, focused modules:
 *
 * - auth/types.ts        - Type definitions
 * - auth/authState.ts    - State management (Observer pattern)
 * - auth/authApi.ts      - API calls
 * - auth/permissionUtils.ts - Permission checking utilities
 * - auth/useAuth.ts      - React hook
 *
 * @see src/api/auth/index.ts for the full export list
 */

export * from './auth';
