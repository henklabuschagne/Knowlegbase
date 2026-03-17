/**
 * Auth Context & Hook
 *
 * Provides authentication state and helpers (user, hasRole, isAdmin, etc.)
 * via React Context. Internally delegates to the centralized appStore and
 * the api.users auth endpoints, so no direct dependency on old service files.
 *
 * Usage:
 *   const { user, hasRole, login, logout } = useAuth();
 */

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { appStore } from '../lib/appStore';
import { api } from '../lib/api';
import type { AuthResponse } from '../types/dto';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
  isAdmin: () => boolean;
  isSupport: () => boolean;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    try {
      return appStore.currentUser ?? null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Subscribe to appStore auth slice so context stays in sync
  useEffect(() => {
    // Sync once on mount in case appStore was updated before subscription
    try {
      setUser(appStore.currentUser ?? null);
    } catch {
      // appStore not ready yet
    }
    const unsub = appStore.subscribe('auth', () => {
      try {
        setUser(appStore.currentUser ?? null);
      } catch {
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const checkAuth = () => {
    try {
      setUser(appStore.currentUser ?? null);
    } catch {
      setUser(null);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const result = await api.users.login(email, password);
    if (result.success) {
      // appStore already updated via api.users.login → appStore.loginUser
      return result.data;
    }
    throw new Error(result.error?.message || 'Invalid credentials');
  };

  const logout = async () => {
    await api.users.logout();
    // appStore already updated via api.users.logout → appStore.logoutUser
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.some(r => r.toLowerCase() === user.roleName.toLowerCase());
  };

  const isAdmin = (): boolean => hasRole('Admin');
  const isSupport = (): boolean => hasRole(['Admin', 'Support']);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      hasRole,
      isAdmin,
      isSupport,
      checkAuth,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}