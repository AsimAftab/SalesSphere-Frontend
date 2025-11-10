import { useState, useEffect, useCallback } from 'react';
import {
  logout,
  subscribeToAuthChanges,
  getCurrentUser,
  type User,
} from '../api/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Wrap initAuth in useCallback so it's a stable function
  const initAuth = useCallback(async () => {
    try {
      const freshUser = await getCurrentUser();
      setUser(freshUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means it's created once

  useEffect(() => {
    initAuth(); // Call on mount

    const unsubscribe = subscribeToAuthChanges(
      (updatedUser: User | null) => {
        setUser(updatedUser);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [initAuth]); // Add initAuth to dependency array

  // ADDED: A function to manually refresh the user state
  const refreshUser = useCallback(async () => {
    setIsLoading(true); // Optional: show loading while refreshing
    await initAuth(); // Re-run the auth logic
  }, [initAuth]);

  // --- Role logic ---
  const hasRole = (roles: string[]): boolean => {
    if (!user || !user.role) return false;
    return roles.includes(user.role.toLowerCase());
  };

  const isSuperAdmin = (): boolean => {
    if (!user || !user.role) return false;
    const role = user.role.toLowerCase();
    return role === 'superadmin' || role === 'super admin';
  };

  const isDeveloper = (): boolean => {
    if (!user || !user.role) return false;
    return user.role.toLowerCase() === 'developer';
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    refreshUser, // EXPORT the new refreshUser function
    hasRole,
    isSuperAdmin: isSuperAdmin(),
    isDeveloper: isDeveloper(),
  };
};