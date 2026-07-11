import { parseJwt } from '@/services/helpers';
import { AuthContextType } from '@/services/types/auth';
import { User } from '@/services/types/user';
import { useQueryClient } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isRefreshPending, setIsRefreshPending] = useState<boolean>(true);

  const queryClient = useQueryClient();

  const login = (): void => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const user = parseJwt(token);
      setUser(user);
      setIsAuthenticated(true);
      sessionStorage.removeItem('registration');
    }
  };

  const logout = useCallback((): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('registration');
    setUser(null);
    setIsAuthenticated(false);
    queryClient.removeQueries({ queryKey: ['profile'], exact: true });
    queryClient.removeQueries({ queryKey: ['bookings', 'list'], exact: true });
  }, [queryClient]);
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      isRefreshPending,
      setIsRefreshPending,
    }),
    [isAuthenticated, isRefreshPending, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
