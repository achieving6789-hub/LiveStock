import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import type { User, UserRole, AuthResponse } from '../types/auth';

interface AuthContextType {
  user: User | null;
  activeRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      const storedRole = (localStorage.getItem('active_role') as UserRole) || null;

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const effectiveRole = storedRole || parsedUser.roles?.[0] || 'FARMER';
          const mergedRoles = Array.from(new Set([...(parsedUser.roles || []), effectiveRole]));
          const updatedParsed = { ...parsedUser, roles: mergedRoles };

          setUser(updatedParsed);
          setActiveRole(effectiveRole);

          // Verify with /api/auth/me
          const res = await api.get('/auth/me');
          if (res.data?.data?.user) {
            const serverUser = res.data.data.user;
            const fullRoles = Array.from(new Set([...serverUser.roles, ...mergedRoles]));
            const finalUser = { ...serverUser, roles: fullRoles };
            setUser(finalUser);
            setActiveRole(effectiveRole);
            localStorage.setItem('user', JSON.stringify(finalUser));
            localStorage.setItem('active_role', effectiveRole);
          }
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          localStorage.removeItem('active_role');
          setUser(null);
          setActiveRole(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      const { user: loggedInUser, tokens } = res.data.data;
      const initialRole = loggedInUser.roles[0] || 'FARMER';

      localStorage.setItem('access_token', tokens.accessToken);
      localStorage.setItem('refresh_token', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('active_role', initialRole);

      setUser(loggedInUser);
      setActiveRole(initialRole);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/register', userData);
      const { user: registeredUser, tokens } = res.data.data;
      const initialRole = registeredUser.roles[0] || 'FARMER';

      localStorage.setItem('access_token', tokens.accessToken);
      localStorage.setItem('refresh_token', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      localStorage.setItem('active_role', initialRole);

      setUser(registeredUser);
      setActiveRole(initialRole);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('active_role');
      setUser(null);
      setActiveRole(null);
    }
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem('active_role', role);
    if (user) {
      const updatedRoles = user.roles.includes(role) ? user.roles : [...user.roles, role];
      const updatedUser = { ...user, roles: updatedRoles };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
