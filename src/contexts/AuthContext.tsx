import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../api/authService';
import { getStoredUser, getCurrentUser as fetchCurrentUser, isAuthenticated as checkAuth, logout as performLogout } from '../api/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
  isSuperAdmin: boolean;
  isDeveloper: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getStoredUser();
        const authenticated = checkAuth();

        if (authenticated && storedUser) {
          setUser(storedUser);

          // Optionally refresh user data from backend
          try {
            const freshUser = await fetchCurrentUser();
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          } catch (error) {
            console.warn('Could not refresh user data, using cached data');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    performLogout();
  };

  const refreshUser = async () => {
    try {
      const freshUser = await fetchCurrentUser();
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user || !user.role) return false;
    return roles.map(r => r.toLowerCase()).includes(user.role.toLowerCase());
  };

  const isSuperAdmin = user?.role?.toLowerCase() === 'superadmin' || user?.role?.toLowerCase() === 'super admin';
  const isDeveloper = user?.role?.toLowerCase() === 'developer';

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
    hasRole,
    isSuperAdmin,
    isDeveloper
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
