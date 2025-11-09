import { useState, useEffect } from 'react';
import {
  getStoredUser,
  isAuthenticated as checkAuth,
  logout,
  hasRole as checkRole,
  isSuperAdmin as checkSuperAdmin,
  isDeveloper as checkDeveloper,
  subscribeToAuthChanges,
  getCurrentUser,
  type User
} from '../api/authService';

/**
 * Custom hook for authentication state management
 * Subscribes to auth changes from authService
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const storedUser = getStoredUser();
        const authenticated = checkAuth();

        if (authenticated && storedUser) {
          setUser(storedUser);

          // Try to refresh user data from backend
          try {
            const freshUser = await getCurrentUser();
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          } catch (error) {
            console.warn('Could not refresh user data, using cached data');
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((updatedUser) => {
      setUser(updatedUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const hasRole = (roles: string[]): boolean => {
    if (!user || !user.role) return false;
    return checkRole(roles);
  };

  const refreshUser = async () => {
    try {
      const freshUser = await getCurrentUser();
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    refreshUser,
    hasRole,
    isSuperAdmin: checkSuperAdmin(),
    isDeveloper: checkDeveloper()
  };
};
