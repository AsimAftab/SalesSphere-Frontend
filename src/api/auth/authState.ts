/**
 * Auth State Management - Single Responsibility: State management only
 * Implements Observer pattern for auth state changes.
 */

import type { User, AuthStateListener } from './types';

// --- Constants ---
export const LOGIN_TIME_KEY = 'loginTime';

// --- State ---
let cachedUser: User | null = null;
let userFetchPromise: Promise<User> | null = null;
const authStateListeners = new Set<AuthStateListener>();

// --- State Accessors ---

export const getCachedUser = (): User | null => cachedUser;

export const getUserFetchPromise = (): Promise<User> | null => userFetchPromise;

export const setUserFetchPromise = (promise: Promise<User> | null): void => {
  userFetchPromise = promise;
};

// --- Observer Pattern ---

/**
 * Notify all subscribers of auth state change
 */
export const notifyAuthChange = (user: User | null): void => {
  cachedUser = user;
  if (user === null) {
    userFetchPromise = null;
  }
  authStateListeners.forEach((listener) => listener(user));
};

/**
 * Subscribe to auth state changes
 * @returns Unsubscribe function
 */
export const subscribeToAuthChanges = (listener: AuthStateListener): (() => void) => {
  authStateListeners.add(listener);
  return () => {
    authStateListeners.delete(listener);
  };
};

// --- Session Helpers ---

export const hasActiveSession = (): boolean => {
  return !!localStorage.getItem(LOGIN_TIME_KEY);
};

export const setLoginTime = (): void => {
  localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
};

export const clearLoginTime = (): void => {
  localStorage.removeItem(LOGIN_TIME_KEY);
};
